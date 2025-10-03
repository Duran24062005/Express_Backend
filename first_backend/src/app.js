//src/app.js
const express = require('express');
const config = require('./config');

const clientes = require('./modulos/clientes/rutas');


const app = express();

app.set('port', config.app.port);


/*app.listen(port, () => console.log(`Example app listening on port ${port}!`))*/


app.get('/', (req, res) => res.send('Hello World!'))

app.get('/hola', (req, res) => res.send('<h1>Hola estas en tu primera App de Backend con Express</h1>'));

app.use('/api/clientes', clientes);



module.exports = app;