const datos = require('../../db/mysql');

const tabla = 'clientes';


function todos() {
    return datos.todos(tabla);
};

function uno(id) {
    return datos.uno(tabla, id);
};

function agregar(datos) {
    return datos.agregar(tabla, datos)
};

function eliminar(body) {
    return datos.eliminar(tabla, body.id);
};


module.exports = {
    todos,
    uno,
    agregar,
    eliminar
}