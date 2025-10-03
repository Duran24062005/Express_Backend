const express = require('express');
// Importación de las respuestas unificadas
const respuesta = require('../../red/respuestas.js');

const router = express.Router();


router.get('/', (req, res) => {
    respuesta.success(req, res, 'Todo ok', 200)
});


module.exports = router;