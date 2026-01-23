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
 * /api/clientes:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Listar todos los clientes
 *     description: Obtiene una lista de todos los clientes registrados
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida exitosamente
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
 *                         $ref: '#/components/schemas/Cliente'
 *             example:
 *               error: false
 *               status: 200
 *               body:
 *                 - id: 1
 *                   nombre: Alexi Duran
 *                   edad: 20
 *                   profesion: Desarrollador de Software
 *                 - id: 2
 *                   nombre: Mariana López
 *                   edad: 25
 *                   profesion: Diseñadora Gráfica
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
 * /api/clientes/{id}:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Obtener un cliente por ID
 *     description: Obtiene la información de un cliente específico mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *         example: 1
 *     responses:
 *       200:
 *         description: Cliente obtenido exitosamente
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
 *                         $ref: '#/components/schemas/Cliente'
 *             example:
 *               error: false
 *               status: 200
 *               body:
 *                 - id: 1
 *                   nombre: Alexi Duran
 *                   edad: 20
 *                   profesion: Desarrollador de Software
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
 * /api/clientes:
 *   post:
 *     tags:
 *       - Clientes
 *     summary: Crear o actualizar cliente
 *     description: Crea un nuevo cliente si no se proporciona ID o actualiza uno existente si se proporciona ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *           example:
 *             id: 0
 *             nombre: Juan Pérez
 *             edad: 30
 *             profesion: Ingeniero
 *     responses:
 *       201:
 *         description: Cliente creado o actualizado exitosamente
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
 *               body: Item creado correctamente
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
            message = 'Item creado correctamente';
        } else {
            message = 'Item actualizado correctamente';
        }
        respuesta.success(req, res, message, 201);

    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/clientes:
 *   put:
 *     tags:
 *       - Clientes
 *     summary: Eliminar cliente
 *     description: Elimina un cliente del sistema mediante su ID
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
 *         description: Cliente eliminado exitosamente
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