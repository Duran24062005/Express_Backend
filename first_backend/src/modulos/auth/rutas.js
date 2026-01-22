const express = require('express');
const respuesta = require('../../red/respuestas.js');
const controlador = require('./index.js');
const { chequearToken } = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', registrar);
router.post('/login', login);
router.get('/me', chequearToken.confirmarToken, obtenerUsuarioActual);

async function login(req, res, next) {
    try {
        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return respuesta.error(req, res, 'Usuario y contraseña son requeridos', 400);
        }

        const resultado = await controlador.login(usuario, password);

        respuesta.success(req, res, {
            message: 'Login exitoso',
            token: resultado.token,
            usuario: resultado.usuario
        }, 200);

    } catch (error) {
        if (error.message === 'Usuario no encontrado' ||
            error.message === 'Contraseña incorrecta') {
            respuesta.error(req, res, 'Credenciales inválidas', 401);
        } else {
            next(error);
        }
    }
}

async function registrar(req, res, next) {
    try {
        const usuario = await controlador.registrar(req.body);

        respuesta.success(req, res, {
            message: 'Usuario registrado exitosamente',
            usuario: usuario
        }, 201);

    } catch (error) {
        if (error.message === 'El usuario ya existe') {
            respuesta.error(req, res, error.message, 409);
        } else if (error.message.includes('Datos incompletos') ||
            error.message.includes('contraseña')) {
            respuesta.error(req, res, error.message, 400);
        } else {
            next(error);
        }
    }
}

async function obtenerUsuarioActual(req, res, next) {
    try {
        const usuario = await controlador.obtenerUsuario(req.usuario.id);
        respuesta.success(req, res, usuario, 200);

    } catch (error) {
        next(error);
    }
}

module.exports = router;