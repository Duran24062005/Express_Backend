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
        const respuesta = await datos.agregar(tabla, usuario);
        var insertId = 0;

        if (data.id == 0 || !data.id) {
            insertId = respuesta.insertId;
        } else {
            insertId = data.id;
        }

        if (data.usuario || data.password) {
            const bcrypt = require('bcrypt');
            const TABLA_AUTH = 'auth';
            
            if (data.password) {
                const passwordHash = await bcrypt.hash(data.password, 10);
                const authData = {
                    id: insertId,
                    usuario: data.usuario,
                    password: passwordHash
                };
                await datos.agregar(TABLA_AUTH, authData);
            } else if (data.usuario) {
                const authData = {
                    id: insertId,
                    usuario: data.usuario
                };
                await datos.agregar(TABLA_AUTH, authData);
            }
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