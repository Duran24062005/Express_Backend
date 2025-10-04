const mysql = require('mysql2');
const config = require('../config.js');

const clients = [
  {
    id: 1,
    name: "Alexi Dg",
    years: 20,
    phone: "3219876",
    address: {
      city: "Bucaramanga",
      street: "Provenza",
      ubi: "Calle 105 #22 - 33"
    }
  },
  {
    id: 2,
    name: "María López",
    years: 25,
    phone: "300112233",
    address: {
      city: "Bogotá",
      street: "Chapinero",
      ubi: "Carrera 7 #54 - 12"
    }
  },
  {
    id: 3,
    name: "Carlos Ramírez",
    years: 32,
    phone: "310445566",
    address: {
      city: "Medellín",
      street: "El Poblado",
      ubi: "Calle 10 #43 - 21"
    }
  },
  {
    id: 4,
    name: "Laura Martínez",
    years: 28,
    phone: "315778899",
    address: {
      city: "Cali",
      street: "San Fernando",
      ubi: "Avenida Roosevelt #33 - 25"
    }
  },
  {
    id: 5,
    name: "Andrés Gómez",
    years: 22,
    phone: "320998877",
    address: {
      city: "Barranquilla",
      street: "Alameda",
      ubi: "Calle 84 #53 - 17"
    }
  }
];

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
      // setTimeout(conectionToMySql, 200);
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
      connection.query(`SELECT * FROM ${tabla};`, (error, result ) => {
        if (error) return reject(error);
        resolve(result);
      });
    })
};

function uno(tabla, id) {
    
};

function agregar(tabla, datos) {
    
};

function eliminar(tabla, id) {
    
};


module.exports = {
    todos,
    uno,
    agregar,
    eliminar
};