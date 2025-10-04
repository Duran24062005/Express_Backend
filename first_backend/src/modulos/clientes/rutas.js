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


module.exports = router;