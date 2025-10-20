const express = require('express');
// Importación de las respuestas unificadas
const respuesta = require('../../red/respuestas.js');
const controlador = require('./controlador.js')

const router = express.Router();


router.get('/', async(req, res) => {
    const todos = controlador.todos().then( (items) => {
        respuesta.success(req, res, items, 200);

    } );
});


router.get('/:id', async (req, res) => {
    const item = await controlador.uno(req.params.id);
    respuesta.success(req, res, item, 200);
});


module.exports = router;