const datos = require('../../db/mysql.js');

const tabla = 'usuarios';



module.exports = function (dbInyectada) {

    let db = dbInyectada;

    if (!db) {
        db = require('../../db/mysql.js');
    }

    function todos() {
        return datos.todos(tabla);
    };

    function uno(id) {
        return datos.uno(tabla, id);
    };

    function agregar(data) {
        return datos.agregar(tabla, data);
    };

    function eliminar(body) {
        return datos.eliminar(tabla, body.id);
    };

    return {
        todos,
        uno,
        agregar,
        eliminar
    }
}