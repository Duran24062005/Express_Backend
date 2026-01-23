const express = require('express');
// Importación de las respuestas unificadas
const respuesta = require('../../red/respuestas.js');
const controlador = require('./index.js')

const router = express.Router();


router.get('/', todos);
router.get('/:id', uno);
router.post('/', agregar);
router.put('/', eliminar);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Listar todos los usuarios
 *     description: Obtiene una lista de todos los usuarios registrados
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/RespuestaSuccess'
 *                 - type: object
 *                   properties:
 *                     body:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Usuario'
 *             example:
 *               error: false
 *               status: 200
 *               body:
 *                 - id: 1
 *                   nombre: Juan Pérez
 *                   usuario: juanperez
 *                   activo: 1
 *                 - id: 2
 *                   nombre: María García
 *                   usuario: mariagarcia
 *                   activo: 1
 */
async function todos(req, res, next) {
    try {
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
};


/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtener un usuario por ID
 *     description: Obtiene la información de un usuario específico mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/RespuestaSuccess'
 *                 - type: object
 *                   properties:
 *                     body:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Usuario'
 *             example:
 *               error: false
 *               status: 200
 *               body:
 *                 - id: 1
 *                   nombre: Juan Pérez
 *                   usuario: juanperez
 *                   activo: 1
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 */
async function uno(req, res) {
    try {
        const item = await controlador.uno(req.params.id);
        respuesta.success(req, res, item, 200);

    } catch (error) {
        respuesta.error(req, res, error, 500);

    }
};

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Crear o actualizar usuario
 *     description: Crea un nuevo usuario si no se proporciona ID o actualiza uno existente si se proporciona ID. Opcionalmente puede incluir usuario y password para crear credenciales de autenticación.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID del usuario (opcional para crear, requerido para actualizar)
 *                 example: 0
 *               nombre:
 *                 type: string
 *                 description: Nombre completo del usuario
 *                 example: Juan Pérez
 *               activo:
 *                 type: integer
 *                 description: Estado del usuario (1 = activo, 0 = inactivo)
 *                 example: 1
 *               usuario:
 *                 type: string
 *                 description: Nombre de usuario (opcional, para crear credenciales)
 *                 example: juanperez
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña (opcional, para crear credenciales)
 *                 example: password123
 *           example:
 *             id: 0
 *             nombre: Juan Pérez
 *             activo: 1
 *             usuario: juanperez
 *             password: password123
 *     responses:
 *       201:
 *         description: Usuario creado o actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/RespuestaSuccess'
 *                 - type: object
 *                   properties:
 *                     body:
 *                       type: string
 *             example:
 *               error: false
 *               status: 201
 *               body: Usuario creado correctamente
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 */
async function agregar(req, res, next) {
    try {
        let message = '';
        const item = await controlador.agregar(req.body);
        if (req.body.id == 0 || !req.body.id) {
            message = 'Usuario creado correctamente';
        } else {
            message = 'Usuario actualizado correctamente';
        }
        respuesta.success(req, res, message, 201);

    } catch (error) {
        next(error);
    }
};


/**
 * @swagger
 * /api/usuarios:
 *   put:
 *     tags:
 *       - Usuarios
 *     summary: Eliminar usuario
 *     description: Elimina un usuario del sistema mediante su ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteRequest'
 *           example:
 *             id: 1
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/RespuestaSuccess'
 *                 - type: object
 *                   properties:
 *                     body:
 *                       type: string
 *             example:
 *               error: false
 *               status: 200
 *               body: Item eliminado correctamente
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 */
async function eliminar(req, res, next) {
    try {
        const item = await controlador.eliminar(req.body);
        respuesta.success(req, res, 'Item eliminado correctamente', 200);

    } catch (error) {
        // respuesta.error(req, res, error, 500);
        next(error);

    }
};


module.exports = router;


/**
 * try {
        let message = '';
        const item = await controlador.agregar(req.body);
        if (req.body.id == 0) {
            message = 'No existe este item';
        } else {
            message = 'Item eliminado correctamente';
        }
        respuesta.success(req, res, message, 201);

    } catch (error) {
        // respuesta.error(req, res, error, 500);
        next(error);
    }
 */