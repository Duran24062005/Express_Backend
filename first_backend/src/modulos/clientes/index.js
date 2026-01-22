const db = require('../../db/mysql.js');
const controller = require('./controlador.js');

module.exports = controller(db);