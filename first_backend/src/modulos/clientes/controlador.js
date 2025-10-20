const datos = require('../../db/mysql');

const tabla = 'clientes';


function todos() {
    return datos.todos(tabla);
};

function uno(id) {
    return datos.uno(tabla, id);
};

function agregar() {
    
};

function eliminar() {
    
};


module.exports = {
    todos,
    uno,
    agregar,
    eliminar
}