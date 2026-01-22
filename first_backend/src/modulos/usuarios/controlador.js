const datos = require('../../db/mysql.js');
const auth = require('../auth/index.js');

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

    async function agregar(data) {
        const usuario = {
            id: data.id,
            nombre: data.nombre,
            activo: data.activo
        }
        const respuesta = datos.agregar(tabla, usuario);
        var insertId = 0;

        if (data.id == 0) {
            insertId = respuesta.insertId;
        } else {
            insertId = data.id;
        }

        if (data.usuario || data.password) {
            await auth.agregar({
                id: insertId,
                usuario: data.usuario,
                password: data.password
            })
            console.log("datas------------------------------------------");

        }
        return true;
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