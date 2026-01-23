const express = require('express');
const respuesta = require('../../red/respuestas.js');
const controlador = require('./index.js');
const { chequearToken } = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', registrar);
router.post('/login', login);
router.get('/me', chequearToken.confirmarToken, obtenerUsuarioActual);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Iniciar sesión
 *     description: Autentica un usuario y retorna un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLogin'
 *           example:
 *             usuario: juanperez
 *             password: password123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Usuario y contraseña son requeridos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 *             example:
 *               error: true
 *               status: 400
 *               body: Usuario y contraseña son requeridos
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 *             example:
 *               error: true
 *               status: 401
 *               body: Credenciales inválidas
 */
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

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registrar nuevo usuario
 *     description: Crea un nuevo usuario en el sistema con autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegister'
 *           example:
 *             nombre: Juan Pérez
 *             usuario: juanperez
 *             password: password123
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Datos incompletos o contraseña inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 *             example:
 *               error: true
 *               status: 400
 *               body: Datos incompletos: nombre, usuario y password son requeridos
 *       409:
 *         description: El usuario ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 *             example:
 *               error: true
 *               status: 409
 *               body: El usuario ya existe
 */
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

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Obtener usuario actual
 *     description: Retorna la información del usuario autenticado mediante el token JWT
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/RespuestaSuccess'
 *                 - type: object
 *                   properties:
 *                     body:
 *                       $ref: '#/components/schemas/Usuario'
 *             example:
 *               error: false
 *               status: 200
 *               body:
 *                 id: 1
 *                 nombre: Juan Pérez
 *                 usuario: juanperez
 *                 activo: 1
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 *             example:
 *               error: true
 *               status: 401
 *               body: Token no proporcionado
 */
async function obtenerUsuarioActual(req, res, next) {
    try {
        const usuario = await controlador.obtenerUsuario(req.usuario.id);
        respuesta.success(req, res, usuario, 200);

    } catch (error) {
        next(error);
    }
}

module.exports = router;