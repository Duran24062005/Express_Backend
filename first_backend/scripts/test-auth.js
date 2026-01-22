require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const config = require('../src/config.js');

async function testAuth() {
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

        // Verificar estructura de tabla usuarios
        const [usuariosColumns] = await connection.query(`
            SHOW COLUMNS FROM usuarios
        `);
        
        console.log('📋 Columnas en tabla usuarios:');
        usuariosColumns.forEach(col => {
            console.log(`   - ${col.Field} (${col.Type})`);
        });
        console.log('');

        // Verificar si existe columna 'usuario'
        const tieneColumnaUsuario = usuariosColumns.some(col => col.Field === 'usuario');
        
        if (!tieneColumnaUsuario) {
            console.log('⚠️  La columna "usuario" no existe. Agregándola...');
            await connection.query(`
                ALTER TABLE usuarios 
                ADD COLUMN usuario VARCHAR(20) UNIQUE AFTER nombre
            `);
            console.log('✅ Columna "usuario" agregada\n');
        }

        // Verificar estructura de tabla auth
        const [authColumns] = await connection.query(`
            SHOW COLUMNS FROM auth
        `);
        
        console.log('📋 Columnas en tabla auth:');
        authColumns.forEach(col => {
            console.log(`   - ${col.Field} (${col.Type})`);
        });
        console.log('');

        // Verificar si la tabla auth tiene PRIMARY KEY
        const [authKeys] = await connection.query(`
            SHOW KEYS FROM auth WHERE Key_name = 'PRIMARY'
        `);
        
        if (authKeys.length === 0) {
            console.log('⚠️  La tabla auth no tiene PRIMARY KEY. Agregándola...');
            // Primero eliminar datos si existen sin PK
            await connection.query(`DELETE FROM auth`);
            await connection.query(`
                ALTER TABLE auth 
                ADD PRIMARY KEY (id),
                ADD FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
            `);
            console.log('✅ PRIMARY KEY y FOREIGN KEY agregados\n');
        }

        // Verificar si el password tiene tamaño suficiente
        const passwordColumn = authColumns.find(col => col.Field === 'password');
        if (passwordColumn && passwordColumn.Type.includes('50')) {
            console.log('⚠️  El campo password es muy pequeño. Actualizándolo...');
            await connection.query(`
                ALTER TABLE auth 
                MODIFY COLUMN password VARCHAR(255) NOT NULL
            `);
            console.log('✅ Campo password actualizado a VARCHAR(255)\n');
        }

        // Crear usuario de prueba
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

        // Insertar usuario
        const [userResult] = await connection.query(
            'INSERT INTO usuarios (nombre, usuario, activo) VALUES (?, ?, ?)',
            [testUser.nombre, testUser.usuario, 1]
        );

        const userId = userResult.insertId;
        console.log(`✅ Usuario creado con ID: ${userId}`);

        // Hashear password
        const passwordHash = await bcrypt.hash(testUser.password, 10);

        // Insertar datos de autenticación
        await connection.query(
            'INSERT INTO auth (id, usuario, password) VALUES (?, ?, ?)',
            [userId, testUser.usuario, passwordHash]
        );

        console.log('✅ Datos de autenticación creados\n');

        // Probar login
        console.log('🔐 Probando login...');
        
        const [users] = await connection.query(
            'SELECT * FROM usuarios WHERE usuario = ?',
            [testUser.usuario]
        );

        if (users.length === 0) {
            throw new Error('Usuario no encontrado después de crearlo');
        }

        const [authData] = await connection.query(
            'SELECT * FROM auth WHERE usuario = ?',
            [testUser.usuario]
        );

        if (authData.length === 0) {
            throw new Error('Datos de autenticación no encontrados');
        }

        const passwordValido = await bcrypt.compare(testUser.password, authData[0].password);

        if (!passwordValido) {
            throw new Error('La contraseña no coincide');
        }

        console.log('✅ Login exitoso!\n');

        // Mostrar credenciales
        console.log('═══════════════════════════════════════');
        console.log('📋 CREDENCIALES DE PRUEBA');
        console.log('═══════════════════════════════════════');
        console.log('Usuario:', testUser.usuario);
        console.log('Password:', testUser.password);
        console.log('ID:', userId);
        console.log('═══════════════════════════════════════\n');

        console.log('💡 Prueba el login con:');
        console.log('   POST http://localhost:4000/api/auth/login');
        console.log('   Body: {');
        console.log('     "usuario": "testuser",');
        console.log('     "password": "test123456"');
        console.log('   }\n');

        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        if (connection) {
            await connection.end();
        }
        process.exit(1);
    }
}

testAuth();
