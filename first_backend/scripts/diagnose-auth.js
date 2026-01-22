require('dotenv').config();
const mysql = require('mysql2/promise');
const config = require('../src/config.js');

async function diagnoseAuth() {
    let connection;
    
    try {
        console.log('🔍 DIAGNÓSTICO DE AUTENTICACIÓN\n');
        console.log('═══════════════════════════════════════\n');

        // Conectar a la base de datos
        connection = await mysql.createConnection({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.pass,
            database: config.mysql.database
        });

        console.log('✅ Conectado a la base de datos\n');

        // Listar todos los usuarios
        const [usuarios] = await connection.query('SELECT * FROM usuarios');
        
        console.log(`📋 Usuarios en la base de datos (${usuarios.length}):`);
        usuarios.forEach(u => {
            console.log(`   ID: ${u.id}, Nombre: ${u.nombre}, Usuario: ${u.usuario || 'NULL'}, Activo: ${u.activo}`);
        });
        console.log('');

        // Listar todos los datos de autenticación
        const [authData] = await connection.query('SELECT * FROM auth');
        
        console.log(`🔐 Datos de autenticación (${authData.length}):`);
        authData.forEach(a => {
            console.log(`   ID: ${a.id}, Usuario: ${a.usuario}, Password: ${a.password ? '***' : 'NULL'}`);
        });
        console.log('');

        // Encontrar usuarios sin datos de autenticación
        console.log('🔎 Buscando usuarios sin datos de autenticación...\n');
        
        const usuariosSinAuth = usuarios.filter(u => {
            return !authData.some(a => a.id === u.id);
        });

        if (usuariosSinAuth.length > 0) {
            console.log(`⚠️  Encontrados ${usuariosSinAuth.length} usuarios sin datos de autenticación:\n`);
            
            usuariosSinAuth.forEach(u => {
                console.log(`   - ID: ${u.id}, Usuario: ${u.usuario || 'NULL'}, Nombre: ${u.nombre}`);
            });
            console.log('');

            // Preguntar si quiere crear datos de auth para estos usuarios
            console.log('💡 SOLUCIÓN:');
            console.log('   Estos usuarios necesitan datos de autenticación.');
            console.log('   Puedes:');
            console.log('   1. Eliminar estos usuarios');
            console.log('   2. Crear datos de autenticación para ellos');
            console.log('   3. Usar el script fix-missing-auth.js para corregirlos automáticamente\n');
        } else {
            console.log('✅ Todos los usuarios tienen datos de autenticación\n');
        }

        // Verificar estructura de tablas
        console.log('📊 Verificando estructura de tablas...\n');
        
        const [usuariosColumns] = await connection.query('SHOW COLUMNS FROM usuarios');
        const tieneUsuario = usuariosColumns.some(col => col.Field === 'usuario');
        
        if (!tieneUsuario) {
            console.log('❌ PROBLEMA: La tabla usuarios NO tiene columna "usuario"');
            console.log('   Esto causará errores en la autenticación.\n');
        } else {
            console.log('✅ La tabla usuarios tiene columna "usuario"\n');
        }

        // Verificar usuarios con usuario NULL
        const usuariosSinUsuario = usuarios.filter(u => !u.usuario);
        if (usuariosSinUsuario.length > 0) {
            console.log(`⚠️  Encontrados ${usuariosSinUsuario.length} usuarios con campo "usuario" NULL:\n`);
            usuariosSinUsuario.forEach(u => {
                console.log(`   - ID: ${u.id}, Nombre: ${u.nombre}`);
            });
            console.log('   Estos usuarios no podrán hacer login.\n');
        }

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

diagnoseAuth();
