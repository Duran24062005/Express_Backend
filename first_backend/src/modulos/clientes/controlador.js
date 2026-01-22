// src/modulos/clientes/controlador.js - CORREGIDO
const TABLA = 'clientes';

module.exports = function (dbInyectada) {
    let db = dbInyectada;

    if (!db) {
        db = require('../../db/mysql.js');
    }

    function todos() {
        return db.todos(TABLA);
    }

    function uno(id) {
        return db.uno(TABLA, id);
    }

    // ✅ CORREGIDO: El parámetro se llama "datosNuevos" para evitar conflicto
    // con la importación "datos" de mysql
    function agregar(datosNuevos) {
        return db.agregar(TABLA, datosNuevos);
    }

    function eliminar(body) {
        return db.eliminar(TABLA, body.id);
    }

    return {
        todos,
        uno,
        agregar,
        eliminar
    };
};