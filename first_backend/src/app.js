//src/app.js
const express = require('express');
const config = require('./config');
const cors = require('cors');


const clientes = require('./modulos/clientes/rutas');


const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));

app.use(express.json())
app.set('port', config.app.port);


/*app.listen(port, () => console.log(`Example app listening on port ${port}!`))*/


app.get('/', (req, res) => res.send('<body style="background-color: black; color: white;">Hello World!</body>'));

app.get('/hola', (req, res) => res.send('<h1>Hola estas en tu primera App de Backend con Express</h1>'));

app.use('/api/clientes', clientes);



module.exports = app;