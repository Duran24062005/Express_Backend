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
    connection.query('SELECT * FROM ??', [tabla], (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}

function uno(tabla, id) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM ?? WHERE id = ?', [tabla, id], (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}

function insertar(tabla, datos) {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO ?? SET ?', [tabla, datos], (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

function actualizar(tabla, datos, id) {
  return new Promise((resolve, reject) => {
    connection.query('UPDATE ?? SET ? WHERE id = ?', [tabla, datos, id], (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

function agregar(tabla, data) {
  if (data && data.id) {
    // Si tiene ID, es una actualización
    const { id, ...datosActualizar } = data;
    return actualizar(tabla, datosActualizar, id);
  } else {
    // Si no tiene ID, es una inserción
    return insertar(tabla, data);
  }
}

function eliminar(tabla, id) {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM ?? WHERE id = ?', [tabla, id], (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}

function query(tabla, condiciones) {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(condiciones);
    const valores = Object.values(condiciones);

    const where = keys.map(() => `?? = ?`).join(' AND ');
    const params = [tabla];

    keys.forEach((key, index) => {
      params.push(key);
      params.push(valores[index]);
    });

    connection.query(
      `SELECT * FROM ?? WHERE ${where}`,
      params,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
}


module.exports = {
  todos,
  uno,
  agregar,
  eliminar,
  query
};