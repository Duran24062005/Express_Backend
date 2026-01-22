const bcrypt = require('bcrypt');
const auth = require('../../middlewares/auth');

const TABLA_USUARIOS = 'usuarios';
const TABLA_AUTH = 'auth';

module.exports = function (dbInyectada) {
    let db = dbInyectada;

    if (!db) {
        db = require('../../db/mysql.js');
    }

    async function login(usuario, password) {
        const data = await db.query(TABLA_USUARIOS, { usuario: usuario });

        if (!data || data.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        const usuarioData = data[0];
        const authData = await db.query(TABLA_AUTH, { usuario: usuario });

        if (!authData || authData.length === 0) {
            throw new Error('Datos de autenticación no encontrados');
        }

        const passwordValido = await bcrypt.compare(password, authData[0].password);

        if (!passwordValido) {
            throw new Error('Contraseña incorrecta');
        }

        const token = auth.generarToken({
            id: usuarioData.id,
            usuario: usuarioData.usuario
        });

        return {
            token,
            usuario: {
                id: usuarioData.id,
                nombre: usuarioData.nombre,
                usuario: usuarioData.usuario
            }
        };
    }

    async function registrar(data) {
        const usuarioExistente = await db.query(TABLA_USUARIOS, { usuario: data.usuario });

        if (usuarioExistente && usuarioExistente.length > 0) {
            throw new Error('El usuario ya existe');
        }

        if (!data.nombre || !data.usuario || !data.password) {
            throw new Error('Datos incompletos: nombre, usuario y password son requeridos');
        }

        if (data.password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        const usuarioData = {
            nombre: data.nombre,
            usuario: data.usuario,
            activo: 1
        };

        const resultado = await db.agregar(TABLA_USUARIOS, usuarioData);
        const idUsuario = resultado.insertId;

        const passwordHash = await bcrypt.hash(data.password, 10);

        const authData = {
            id: idUsuario,
            usuario: data.usuario,
            password: passwordHash
        };

        await db.agregar(TABLA_AUTH, authData);

        return {
            id: idUsuario,
            nombre: data.nombre,
            usuario: data.usuario
        };
    }

    async function obtenerUsuario(id) {
        const usuarios = await db.uno(TABLA_USUARIOS, id);

        if (!usuarios || usuarios.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        const usuario = usuarios[0];
        delete usuario.password;

        return usuario;
    }

    return {
        login,
        registrar,
        obtenerUsuario
    };
};