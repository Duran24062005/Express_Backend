require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const config = require('../src/config.js');

async function createTestUser() {
    let connection;
    
    try {
        // Conectar a la base de datos
        connection = await mysql.createConnection({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.pass,
            database: config.mysql.database
        });

        console.log('✅ Conectado a la base de datos\n');

        // Verificar y agregar columna usuario si no existe
        const [columns] = await connection.query('SHOW COLUMNS FROM usuarios');
        const tieneUsuario = columns.some(col => col.Field === 'usuario');
        
        if (!tieneUsuario) {
            console.log('⚠️  La columna "usuario" no existe. Agregándola...');
            await connection.query('ALTER TABLE usuarios ADD COLUMN usuario VARCHAR(20) UNIQUE AFTER nombre');
            console.log('✅ Columna "usuario" agregada\n');
        }

        // Verificar estructura de auth
        const [authColumns] = await connection.query('SHOW COLUMNS FROM auth');
        const passwordColumn = authColumns.find(col => col.Field === 'password');
        
        if (passwordColumn && passwordColumn.Type.includes('50')) {
            console.log('⚠️  Actualizando tamaño del campo password...');
            await connection.query('ALTER TABLE auth MODIFY COLUMN password VARCHAR(255) NOT NULL');
            console.log('✅ Campo password actualizado\n');
        }

        // Verificar PRIMARY KEY en auth
        const [authKeys] = await connection.query("SHOW KEYS FROM auth WHERE Key_name = 'PRIMARY'");
        if (authKeys.length === 0) {
            console.log('⚠️  Agregando PRIMARY KEY a tabla auth...');
            await connection.query('ALTER TABLE auth ADD PRIMARY KEY (id)');
            await connection.query('ALTER TABLE auth ADD FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE');
            console.log('✅ PRIMARY KEY y FOREIGN KEY agregados\n');
        }

        const testUser = {
            nombre: 'Usuario de Prueba',
            usuario: 'testuser',
            password: 'test123456'
        };

        console.log('🔨 Creando usuario de prueba...');

        // Verificar si el usuario ya existe
        const [existingUsers] = await connection.query(
            'SELECT * FROM usuarios WHERE usuario = ?',
            [testUser.usuario]
        );

        if (existingUsers.length > 0) {
            console.log('⚠️  El usuario ya existe. Eliminando y recreando...');
            const userId = existingUsers[0].id;
            await connection.query('DELETE FROM auth WHERE id = ?', [userId]);
            await connection.query('DELETE FROM usuarios WHERE id = ?', [userId]);
        }

        // Crear usuario
        const [userResult] = await connection.query(
            'INSERT INTO usuarios (nombre, usuario, activo) VALUES (?, ?, ?)',
            [testUser.nombre, testUser.usuario, 1]
        );

        const idUsuario = userResult.insertId;
        console.log(`✅ Usuario creado con ID: ${idUsuario}`);

        // Crear datos de autenticación
        const passwordHash = await bcrypt.hash(testUser.password, 10);
        await connection.query(
            'INSERT INTO auth (id, usuario, password) VALUES (?, ?, ?)',
            [idUsuario, testUser.usuario, passwordHash]
        );

        console.log('✅ Datos de autenticación creados\n');

        await connection.end();

        console.log('═══════════════════════════════════════');
        console.log('✅ USUARIO DE PRUEBA CREADO EXITOSAMENTE');
        console.log('═══════════════════════════════════════\n');
        console.log('📋 Credenciales:');
        console.log('   Usuario: testuser');
        console.log('   Password: test123456');
        console.log('   ID:', idUsuario);
        console.log('\n💡 Puedes usar estas credenciales para probar el login:');
        console.log('   POST http://localhost:4000/api/auth/login');
        console.log('\n   Body:');
        console.log('   {');
        console.log('     "usuario": "testuser",');
        console.log('     "password": "test123456"');
        console.log('   }\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error al crear usuario de prueba:', error.message);
        console.error(error.stack);
        if (connection) {
            await connection.end();
        }
        process.exit(1);
    }
}

createTestUser();
