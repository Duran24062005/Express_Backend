require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const config = require('../src/config.js');

async function testLoginSpecific() {
    let connection;
    
    try {
        console.log('🔍 DIAGNÓSTICO ESPECÍFICO DE LOGIN\n');
        console.log('═══════════════════════════════════════\n');

        // Conectar a la base de datos
        connection = await mysql.createConnection({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.pass,
            database: config.mysql.database
        });

        console.log('✅ Conectado a la base de datos\n');

        const testUsuario = 'juanperez';
        const testPassword = 'miPassword123';

        console.log(`🔎 Buscando usuario: "${testUsuario}"\n`);

        // Buscar usuario en tabla usuarios
        const [usuarios] = await connection.query(
            'SELECT * FROM usuarios WHERE usuario = ?',
            [testUsuario]
        );

        if (usuarios.length === 0) {
            console.log('❌ ERROR: Usuario no encontrado en tabla usuarios');
            console.log('\n📋 Usuarios existentes:');
            const [allUsers] = await connection.query('SELECT * FROM usuarios');
            allUsers.forEach(u => {
                console.log(`   - ID: ${u.id}, Usuario: "${u.usuario || 'NULL'}", Nombre: ${u.nombre}`);
            });
            await connection.end();
            process.exit(1);
        }

        const usuario = usuarios[0];
        console.log('✅ Usuario encontrado en tabla usuarios:');
        console.log(`   ID: ${usuario.id}`);
        console.log(`   Nombre: ${usuario.nombre}`);
        console.log(`   Usuario: ${usuario.usuario}`);
        console.log(`   Activo: ${usuario.activo}\n`);

        // Buscar datos de autenticación
        const [authData] = await connection.query(
            'SELECT * FROM auth WHERE usuario = ?',
            [testUsuario]
        );

        if (authData.length === 0) {
            console.log('❌ ERROR: No hay datos de autenticación para este usuario');
            console.log('\n📋 Datos de autenticación existentes:');
            const [allAuth] = await connection.query('SELECT * FROM auth');
            allAuth.forEach(a => {
                console.log(`   - ID: ${a.id}, Usuario: "${a.usuario}", Password: ${a.password ? '***' : 'NULL'}`);
            });
            await connection.end();
            process.exit(1);
        }

        const auth = authData[0];
        console.log('✅ Datos de autenticación encontrados:');
        console.log(`   ID: ${auth.id}`);
        console.log(`   Usuario: ${auth.usuario}`);
        console.log(`   Password Hash: ${auth.password.substring(0, 20)}...\n`);

        // Verificar que los IDs coincidan
        if (usuario.id !== auth.id) {
            console.log('⚠️  ADVERTENCIA: Los IDs no coinciden');
            console.log(`   Usuario ID: ${usuario.id}`);
            console.log(`   Auth ID: ${auth.id}\n`);
        }

        // Probar comparación de contraseña
        console.log('🔐 Probando comparación de contraseña...\n');
        console.log(`   Password ingresada: "${testPassword}"`);
        console.log(`   Password hash almacenado: ${auth.password.substring(0, 30)}...\n`);

        const passwordValido = await bcrypt.compare(testPassword, auth.password);

        if (passwordValido) {
            console.log('✅ La contraseña es VÁLIDA\n');
            console.log('💡 El problema podría estar en:');
            console.log('   1. La lógica del controlador');
            console.log('   2. Cómo se está buscando el usuario');
            console.log('   3. El formato de la respuesta de error\n');
        } else {
            console.log('❌ La contraseña NO coincide\n');
            console.log('💡 Posibles causas:');
            console.log('   1. La contraseña se hasheó incorrectamente al registrarse');
            console.log('   2. La contraseña ingresada es diferente');
            console.log('   3. El hash se corrompió\n');

            // Intentar hashear de nuevo para comparar
            console.log('🔨 Hasheando la contraseña de nuevo para comparar...');
            const nuevoHash = await bcrypt.hash(testPassword, 10);
            console.log(`   Nuevo hash: ${nuevoHash.substring(0, 30)}...`);
            console.log(`   Hash almacenado: ${auth.password.substring(0, 30)}...`);
            console.log(`   ¿Son iguales? ${nuevoHash === auth.password ? 'Sí' : 'No (normal, bcrypt genera hashes únicos)'}\n`);
        }

        // Simular la lógica del controlador
        console.log('🧪 Simulando lógica del controlador...\n');

        // Paso 1: Buscar usuario
        const db = require('../src/db/mysql.js');
        const usuarioData = await db.query('usuarios', { usuario: testUsuario });
        
        if (usuarioData.length === 0) {
            console.log('❌ Controlador: Usuario no encontrado');
        } else {
            console.log('✅ Controlador: Usuario encontrado');
            console.log(`   Usuario encontrado: ${usuarioData[0].usuario}\n`);

            // Paso 2: Buscar datos de auth
            const authDataController = await db.query('auth', { usuario: testUsuario });
            
            if (authDataController.length === 0) {
                console.log('❌ Controlador: Datos de autenticación no encontrados');
            } else {
                console.log('✅ Controlador: Datos de autenticación encontrados');
                
                // Paso 3: Comparar contraseña
                const passwordValidoController = await bcrypt.compare(testPassword, authDataController[0].password);
                
                if (passwordValidoController) {
                    console.log('✅ Controlador: Contraseña válida');
                    console.log('\n💡 La lógica del controlador funciona correctamente.');
                    console.log('   El problema podría estar en:');
                    console.log('   - El formato de la respuesta de error');
                    console.log('   - La ruta que estás usando');
                    console.log('   - El puerto (estás usando 8000, pero el default es 4000)\n');
                } else {
                    console.log('❌ Controlador: Contraseña inválida');
                    console.log('\n💡 El problema está en la comparación de contraseñas.\n');
                }
            }
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

testLoginSpecific();
