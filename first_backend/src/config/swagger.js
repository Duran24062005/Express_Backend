const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const config = require('../config.js');

const port = config.app.port || 4000;
const host = process.env.HOST || 'localhost';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express Backend API',
    version: '1.0.0',
    description: 'API REST para gestión de clientes, usuarios y autenticación con JWT',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: `http://${host}:${port}`,
      description: 'Servidor de desarrollo',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresa el token JWT obtenido del endpoint de login',
      },
    },
    schemas: {
      Cliente: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID único del cliente',
            example: 1,
          },
          nombre: {
            type: 'string',
            description: 'Nombre completo del cliente',
            example: 'Alexi Duran',
          },
          edad: {
            type: 'integer',
            description: 'Edad del cliente',
            example: 20,
          },
          profesion: {
            type: 'string',
            description: 'Profesión del cliente',
            example: 'Desarrollador de Software',
          },
        },
        required: ['nombre'],
      },
      Usuario: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID único del usuario',
            example: 1,
          },
          nombre: {
            type: 'string',
            description: 'Nombre completo del usuario',
            example: 'Juan Pérez',
          },
          usuario: {
            type: 'string',
            description: 'Nombre de usuario único',
            example: 'juanperez',
          },
          activo: {
            type: 'integer',
            description: 'Estado del usuario (1 = activo, 0 = inactivo)',
            example: 1,
          },
        },
        required: ['nombre'],
      },
      AuthRegister: {
        type: 'object',
        required: ['nombre', 'usuario', 'password'],
        properties: {
          nombre: {
            type: 'string',
            description: 'Nombre completo del usuario',
            example: 'Juan Pérez',
          },
          usuario: {
            type: 'string',
            description: 'Nombre de usuario único',
            example: 'juanperez',
          },
          password: {
            type: 'string',
            format: 'password',
            description: 'Contraseña (mínimo 6 caracteres)',
            example: 'password123',
            minLength: 6,
          },
        },
      },
      AuthLogin: {
        type: 'object',
        required: ['usuario', 'password'],
        properties: {
          usuario: {
            type: 'string',
            description: 'Nombre de usuario',
            example: 'juanperez',
          },
          password: {
            type: 'string',
            format: 'password',
            description: 'Contraseña del usuario',
            example: 'password123',
          },
        },
      },
      RespuestaSuccess: {
        type: 'object',
        properties: {
          error: {
            type: 'boolean',
            example: false,
          },
          status: {
            type: 'integer',
            example: 200,
          },
          body: {
            type: 'object',
            description: 'Cuerpo de la respuesta (puede ser objeto, array o string)',
          },
        },
      },
      RespuestaError: {
        type: 'object',
        properties: {
          error: {
            type: 'boolean',
            example: true,
          },
          status: {
            type: 'integer',
            example: 400,
          },
          body: {
            type: 'string',
            description: 'Mensaje de error',
            example: 'Error en la solicitud',
          },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'boolean',
            example: false,
          },
          status: {
            type: 'integer',
            example: 200,
          },
          body: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Login exitoso',
              },
              token: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              },
              usuario: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    example: 1,
                  },
                  nombre: {
                    type: 'string',
                    example: 'Juan Pérez',
                  },
                  usuario: {
                    type: 'string',
                    example: 'juanperez',
                  },
                },
              },
            },
          },
        },
      },
      RegisterResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'boolean',
            example: false,
          },
          status: {
            type: 'integer',
            example: 201,
          },
          body: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Usuario registrado exitosamente',
              },
              usuario: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    example: 1,
                  },
                  nombre: {
                    type: 'string',
                    example: 'Juan Pérez',
                  },
                  usuario: {
                    type: 'string',
                    example: 'juanperez',
                  },
                },
              },
            },
          },
        },
      },
      DeleteRequest: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'integer',
            description: 'ID del elemento a eliminar',
            example: 1,
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Auth',
      description: 'Endpoints de autenticación y autorización',
    },
    {
      name: 'Clientes',
      description: 'Endpoints para gestión de clientes',
    },
    {
      name: 'Usuarios',
      description: 'Endpoints para gestión de usuarios',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, '../modulos/**/rutas.js'),
    path.join(__dirname, '../app.js')
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
