





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




// src/index.js
const app = require('./app');


app.listen(app.get('port'), () => {
    console.log('App listening on port ', app.get("port"));
    
});

/*app.listen(port, () => console.log(`Example app listening on port ${port}!`));*/




// modulos/clientes/rutas
const express = require('express');

const router = express.Router()


router.get('/', (req, res) => res.send('Clientes OK'));


module.exports = router;