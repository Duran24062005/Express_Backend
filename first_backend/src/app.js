//src/app.js
const express = require('express');
const morgan = require('morgan');
const config = require('./config.js');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.js');


const clientes = require('./modulos/clientes/rutas.js');
const usuarios = require('./modulos/usuarios/rutas.js');
const auth = require('./modulos/auth/rutas.js')
const errors = require('./red/error.js');


const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: '*'
}));

app.set('port', config.app.port);


/*app.listen(port, () => console.log(`Example app listening on port ${port}!`))*/


app.get('/', (req, res) => {
  res.send({
    app_name: "Express Backend V1",
    message: "Primera API en Express y MySQL.",
    version: "1.0.0",
    status: "success",
    code: 200,
    endpoints: {
      auth: '/api/auth',
      blogs: "/api/blogs",
      projects: "/api/projects"
    },
    healty: {
      APP_PORT: config.app.port,
      MYSQL_HOST: config.mysql.host,
      MYSQL_DB: config.mysql.database
    }
  })
});

app.get('/hola', (req, res) => res.send('<h1>Hola estas en tu primera App de Backend con Express</h1>'));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Express Backend API Documentation',
}));

app.use('/api/clientes', clientes);
app.use('/api/usuarios', usuarios);
app.use('/api/auth', auth);


app.use(errors);


module.exports = app;