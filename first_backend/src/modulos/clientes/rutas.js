const express = require('express');
// Importación de las respuestas unificadas
const respuesta = require('../../red/respuestas.js');
const controlador = require('./index.js')

const router = express.Router();


router.get('/', todos);
router.get('/:id', uno);
router.post('/', agregar);
router.put('/', eliminar);

async function todos(req, res, next) {
    try {
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
};


async function uno(req, res) {
    try {
        const item = await controlador.uno(req.params.id);
        respuesta.success(req, res, item, 200);

    } catch (error) {
        respuesta.error(req, res, error, 500);

    }
};

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