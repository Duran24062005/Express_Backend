const express = require('express');
// Importación de las respuestas unificadas
const respuesta = require('../../red/respuestas.js');
const controlador = require('./index.js')

const router = express.Router();





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