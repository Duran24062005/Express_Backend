const mysql = require('mysql2');
const config = require('../config.js');
const { error } = require('../red/respuestas.js');


const dbConfig = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.pass,
  database: config.mysql.database
}

let connection;

function conectionToMySql() {
  connection = mysql.createConnection(dbConfig);

  connection.connect((error) => {
    if (error) {
      console.log('[db err]', error);
      setTimeout(conectionToMySql, 200);

    } else {
      console.log('DB connected.');

    };
  });

  connection.on('error', (error) => {
    console.log('[db err]', error);
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      conectionToMySql();

    } else {
      throw error;

    };
  });
};

conectionToMySql();

function todos(tabla) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${tabla};`, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};


function uno(tabla, id) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${tabla} WHERE id = ${id};`, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};


function insertar(tabla, datos) {
  return new Promise((resolve, reject) => {
    console.log(datos.nombre, datos.usuario, datos.activo);

    connection.query(`INSERT INTO ${tabla} (nombre, usuario, activo) VALUES ('${datos.nombre}', '${datos.usuario}', ${datos.activo});`, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    })
  })
};


function actualizar(tabla, datos, id) {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE ${tabla} SET ${datos} WHERE id=${id}`, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    })
  })
};


function agregar(tabla, data) {
  if (data && !data.id) {
    return insertar(tabla, data)
  } else {
    return actualizar(tabla, data, data.id)
  }
}

function eliminar(tabla, id) {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM ${tabla} WHERE id = ${id};`, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};


module.exports = {
  todos,
  uno,
  agregar,
  eliminar
};