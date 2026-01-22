require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const config = require('../src/config.js');

async function fixUserPassword() {
    let connection;
    
    try {
        console.log('🔧 CORRIGIENDO CONTRASEÑA DE USUARIO\n');
        console.log('═══════════════════════════════════════\n');

        // Conectar a la base de datos
        connection = await mysql.createConnection({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.pass,
            database: config.mysql.database
        });

        console.log('✅ Conectado a la base de datos\n');

        const usuario = 'juanperez';
        const nuevaPassword = 'miPassword123';

        console.log(`🔎 Buscando usuario: "${usuario}"\n`);

        // Buscar usuario
        const [usuarios] = await connection.query(
            'SELECT * FROM usuarios WHERE usuario = ?',
            [usuario]
        );

        if (usuarios.length === 0) {
            console.log('❌ Usuario no encontrado');
            await connection.end();
            process.exit(1);
        }

        const userData = usuarios[0];
        console.log('✅ Usuario encontrado:');
        console.log(`   ID: ${userData.id}`);
        console.log(`   Nombre: ${userData.nombre}`);
        console.log(`   Usuario: ${userData.usuario}\n`);

        // Verificar si existe en auth
        const [authData] = await connection.query(
            'SELECT * FROM auth WHERE usuario = ?',
            [usuario]
        );

        if (authData.length === 0) {
            console.log('⚠️  No hay datos de autenticación. Creándolos...\n');
            
            // Crear datos de autenticación
            const passwordHash = await bcrypt.hash(nuevaPassword, 10);
            await connection.query(
                'INSERT INTO auth (id, usuario, password) VALUES (?, ?, ?)',
                [userData.id, usuario, passwordHash]
            );
            
            console.log('✅ Datos de autenticación creados\n');
        } else {
            console.log('🔐 Actualizando contraseña...\n');
            
            // Actualizar contraseña
            const passwordHash = await bcrypt.hash(nuevaPassword, 10);
            await connection.query(
                'UPDATE auth SET password = ? WHERE usuario = ?',
                [passwordHash, usuario]
            );
            
            console.log('✅ Contraseña actualizada\n');
        }

        // Verificar que funciona
        console.log('✅ Verificando que la contraseña funciona...\n');
        const [verifyAuth] = await connection.query(
            'SELECT * FROM auth WHERE usuario = ?',
            [usuario]
        );
        
        const passwordValido = await bcrypt.compare(nuevaPassword, verifyAuth[0].password);
        
        if (passwordValido) {
            console.log('✅ La contraseña funciona correctamente!\n');
        } else {
            console.log('❌ Error: La contraseña no funciona después de actualizarla');
            await connection.end();
            process.exit(1);
        }

        await connection.end();

        console.log('═══════════════════════════════════════');
        console.log('✅ CONTRASEÑA CORREGIDA');
        console.log('═══════════════════════════════════════\n');
        console.log('📋 Credenciales actualizadas:');
        console.log(`   Usuario: ${usuario}`);
        console.log(`   Password: ${nuevaPassword}\n`);
        console.log('💡 Ahora puedes hacer login con estas credenciales\n');

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

fixUserPassword();
