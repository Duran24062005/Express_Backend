require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const config = require('../src/config.js');

async function fixMissingAuth() {
    let connection;
    
    try {
        console.log('🔧 CORRIGIENDO DATOS DE AUTENTICACIÓN FALTANTES\n');
        console.log('═══════════════════════════════════════\n');

        // Conectar a la base de datos
        connection = await mysql.createConnection({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.pass,
            database: config.mysql.database
        });

        console.log('✅ Conectado a la base de datos\n');

        // Obtener todos los usuarios
        const [usuarios] = await connection.query('SELECT * FROM usuarios');
        
        // Obtener todos los datos de autenticación
        const [authData] = await connection.query('SELECT * FROM auth');
        
        // Encontrar usuarios sin datos de autenticación
        const usuariosSinAuth = usuarios.filter(u => {
            return !authData.some(a => a.id === u.id);
        });

        if (usuariosSinAuth.length === 0) {
            console.log('✅ Todos los usuarios tienen datos de autenticación. No hay nada que corregir.\n');
            await connection.end();
            process.exit(0);
        }

        console.log(`⚠️  Encontrados ${usuariosSinAuth.length} usuarios sin datos de autenticación:\n`);
        
        for (const usuario of usuariosSinAuth) {
            console.log(`   Procesando: ID ${usuario.id} - ${usuario.nombre} (${usuario.usuario || 'sin usuario'})`);
            
            // Si el usuario no tiene campo "usuario", necesitamos crearlo
            if (!usuario.usuario) {
                // Generar un usuario basado en el nombre + ID para hacerlo único
                let baseUsuario = usuario.nombre
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
                    .replace(/[^a-z0-9]/g, '') // Solo letras y números
                    .substring(0, 15) || `user`;
                
                const usuarioGenerado = `${baseUsuario}${usuario.id}`;
                
                // Verificar que no exista
                const [existing] = await connection.query(
                    'SELECT id FROM usuarios WHERE usuario = ?',
                    [usuarioGenerado]
                );
                
                if (existing.length > 0) {
                    // Si existe, usar solo el ID
                    const usuarioGenerado = `user${usuario.id}`;
                    console.log(`   ⚠️  Usuario sin campo "usuario", generando: ${usuarioGenerado}`);
                    await connection.query(
                        'UPDATE usuarios SET usuario = ? WHERE id = ?',
                        [usuarioGenerado, usuario.id]
                    );
                    usuario.usuario = usuarioGenerado;
                } else {
                    console.log(`   ⚠️  Usuario sin campo "usuario", generando: ${usuarioGenerado}`);
                    await connection.query(
                        'UPDATE usuarios SET usuario = ? WHERE id = ?',
                        [usuarioGenerado, usuario.id]
                    );
                    usuario.usuario = usuarioGenerado;
                }
            }

            // Crear password por defecto
            const passwordDefault = `password${usuario.id}`;
            const passwordHash = await bcrypt.hash(passwordDefault, 10);

            // Insertar datos de autenticación
            try {
                await connection.query(
                    'INSERT INTO auth (id, usuario, password) VALUES (?, ?, ?)',
                    [usuario.id, usuario.usuario, passwordHash]
                );
                
                console.log(`   ✅ Datos de autenticación creados`);
                console.log(`      Usuario: ${usuario.usuario}`);
                console.log(`      Password temporal: ${passwordDefault}`);
                console.log(`      ⚠️  IMPORTANTE: Cambia esta contraseña después del primer login\n`);
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    console.log(`   ⚠️  Ya existe un registro en auth para este usuario, saltando...\n`);
                } else {
                    throw error;
                }
            }
        }

        console.log('═══════════════════════════════════════');
        console.log('✅ CORRECCIÓN COMPLETADA');
        console.log('═══════════════════════════════════════\n');
        console.log('💡 Los usuarios ahora pueden hacer login con:');
        console.log('   Usuario: [el campo usuario del registro]');
        console.log('   Password: password[ID] (ejemplo: password1, password2, etc.)');
        console.log('\n⚠️  RECOMENDACIÓN: Cambia las contraseñas después del primer login\n');

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

fixMissingAuth();
