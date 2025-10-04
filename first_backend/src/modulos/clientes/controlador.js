const datos = require('../../db/mysql');

const tabla = 'clientes';


function todos() {
    return datos.todos(tabla);
};

function uno() {
    
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