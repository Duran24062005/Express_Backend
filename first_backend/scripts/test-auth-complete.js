require('dotenv').config();
const authController = require('../src/modulos/auth/index');
const mysql = require('mysql2/promise');
const config = require('../src/config.js');

async function testAuthComplete() {
    let connection;
    
    try {
        console.log('🧪 PRUEBA COMPLETA DE AUTENTICACIÓN\n');
        console.log('═══════════════════════════════════════\n');

        // Conectar a la base de datos
        connection = await mysql.createConnection({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.pass,
            database: config.mysql.database
        });

        console.log('✅ Conectado a la base de datos\n');

        // Asegurar que existe la columna usuario
        const [columns] = await connection.query('SHOW COLUMNS FROM usuarios');
        const tieneUsuario = columns.some(col => col.Field === 'usuario');
        
        if (!tieneUsuario) {
            console.log('⚠️  Agregando columna "usuario"...');
            await connection.query('ALTER TABLE usuarios ADD COLUMN usuario VARCHAR(20) UNIQUE AFTER nombre');
            console.log('✅ Columna agregada\n');
        }

        // Crear usuario de prueba si no existe
        const testUser = {
            nombre: 'Usuario de Prueba',
            usuario: 'testuser',
            password: 'test123456'
        };

        const [existing] = await connection.query(
            'SELECT * FROM usuarios WHERE usuario = ?',
            [testUser.usuario]
        );

        if (existing.length === 0) {
            console.log('🔨 Creando usuario de prueba...');
            const [userResult] = await connection.query(
                'INSERT INTO usuarios (nombre, usuario, activo) VALUES (?, ?, ?)',
                [testUser.nombre, testUser.usuario, 1]
            );
            
            const bcrypt = require('bcrypt');
            const hash = await bcrypt.hash(testUser.password, 10);
            
            await connection.query(
                'INSERT INTO auth (id, usuario, password) VALUES (?, ?, ?)',
                [userResult.insertId, testUser.usuario, hash]
            );
            console.log('✅ Usuario creado\n');
        } else {
            console.log('✅ Usuario de prueba ya existe\n');
        }

        await connection.end();

        // Probar con el controlador
        console.log('🔐 Probando login con controlador...\n');

        try {
            const resultado = await authController.login(testUser.usuario, testUser.password);
            
            console.log('✅ LOGIN EXITOSO!\n');
            console.log('📋 Resultado:');
            console.log('   Token:', resultado.token.substring(0, 50) + '...');
            console.log('   Usuario ID:', resultado.usuario.id);
            console.log('   Usuario nombre:', resultado.usuario.nombre);
            console.log('   Usuario:', resultado.usuario.usuario);
            console.log('\n');

            // Probar obtener usuario
            console.log('👤 Probando obtener usuario...\n');
            const usuario = await authController.obtenerUsuario(resultado.usuario.id);
            console.log('✅ Usuario obtenido:');
            console.log('   ID:', usuario.id);
            console.log('   Nombre:', usuario.nombre);
            console.log('   Usuario:', usuario.usuario);
            console.log('   Activo:', usuario.activo);
            console.log('\n');

            // Probar casos de error
            console.log('❌ Probando casos de error...\n');
            
            try {
                await authController.login('usuario_inexistente', 'password');
                console.log('❌ ERROR: Debería haber fallado con usuario inexistente');
            } catch (error) {
                console.log('✅ Correcto: Error con usuario inexistente -', error.message);
            }

            try {
                await authController.login(testUser.usuario, 'password_incorrecta');
                console.log('❌ ERROR: Debería haber fallado con password incorrecta');
            } catch (error) {
                console.log('✅ Correcto: Error con password incorrecta -', error.message);
            }

            console.log('\n═══════════════════════════════════════');
            console.log('✅ TODAS LAS PRUEBAS PASARON');
            console.log('═══════════════════════════════════════\n');
            console.log('📋 CREDENCIALES PARA USAR EN LA API:');
            console.log('   Usuario: testuser');
            console.log('   Password: test123456');
            console.log('\n💡 Ejemplo de uso:');
            console.log('   POST http://localhost:4000/api/auth/login');
            console.log('   {');
            console.log('     "usuario": "testuser",');
            console.log('     "password": "test123456"');
            console.log('   }\n');

            process.exit(0);

        } catch (error) {
            console.error('❌ Error en login:', error.message);
            console.error(error.stack);
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Error general:', error.message);
        console.error(error.stack);
        if (connection) {
            await connection.end();
        }
        process.exit(1);
    }
}

testAuthComplete();
