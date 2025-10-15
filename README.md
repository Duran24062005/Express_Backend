# Express Back-End



## Guía Completa de Backend con Express.js

![Express.js Logo](https://www.dongee.com/tutoriales/content/images/size/w1000/2023/11/image-59.png)

## ¿Qué es Express.js?

Express.js es un framework web minimalista y flexible para Node.js que proporciona un conjunto robusto de características para aplicaciones web y móviles. Es uno de los frameworks más populares del ecosistema Node.js y se utiliza para construir APIs y aplicaciones web de manera rápida y eficiente.

### Características principales

- **Minimalista**: Proporciona solo las herramientas esenciales sin imponer una estructura rígida
- **Flexible**: Permite personalizar y extender funcionalidades fácilmente
- **Middleware**: Sistema de middleware potente para manejar peticiones
- **Routing**: Sistema de enrutamiento robusto y sencillo
- **Gran comunidad**: Amplio ecosistema de plugins y middleware disponibles

## ¿Para qué se usa Express.js?

![Node.js y Express](https://www.dongee.com/tutoriales/content/images/2023/11/image-60.png)

Express.js se utiliza principalmente para:

### 1. Crear APIs REST
Desarrollar interfaces de programación que permiten la comunicación entre el frontend y la base de datos.

### 2. Aplicaciones web
Construir aplicaciones web completas con renderizado del lado del servidor.

### 3. Microservicios
Desarrollar servicios independientes que forman parte de una arquitectura más grande.

### 4. Aplicaciones en tiempo real
Junto con Socket.io, crear aplicaciones de chat, notificaciones en vivo, etc.

### 5. Proxy y Gateway
Actuar como intermediario entre diferentes servicios o APIs.

## Guía Básica de Inicio

![Getting Started](https://www.freecodecamp.org/news/content/images/size/w2000/2021/06/Ekran-Resmi-2019-11-18-18.08.13.png)

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
- **Node.js** (versión 14 o superior)
- **npm** o **yarn** (gestores de paquetes)

### Paso 1: Inicializar el proyecto

```bash
# Crear una carpeta para el proyecto
mkdir mi-proyecto-express
cd mi-proyecto-express

# Inicializar npm
npm init -y
```

### Paso 2: Instalar Express

```bash
npm install express
```

### Paso 3: Crear el servidor básico

Crea un archivo llamado `index.js` o `app.js`:

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta básica
app.get('/', (req, res) => {
  res.send('¡Hola Mundo desde Express!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
```

### Paso 4: Ejecutar el servidor

```bash
node index.js
```

Visita `http://localhost:3000` en tu navegador y verás el mensaje "¡Hola Mundo desde Express!".

## Conceptos Fundamentales

![Express Routing](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/routes/mvc_express.png)

### Rutas (Routes)

Las rutas definen los endpoints de tu aplicación:

```javascript
// GET - Obtener datos
app.get('/api/usuarios', (req, res) => {
  res.json({ mensaje: 'Lista de usuarios' });
});

// POST - Crear datos
app.post('/api/usuarios', (req, res) => {
  const nuevoUsuario = req.body;
  res.status(201).json({ mensaje: 'Usuario creado', usuario: nuevoUsuario });
});

// PUT - Actualizar datos
app.put('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  res.json({ mensaje: `Usuario ${id} actualizado` });
});

// DELETE - Eliminar datos
app.delete('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  res.json({ mensaje: `Usuario ${id} eliminado` });
});
```

### Middleware

Los middleware son funciones que tienen acceso al objeto de petición (req), al objeto de respuesta (res) y a la siguiente función middleware:

```javascript
// Middleware personalizado
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next(); // Pasar al siguiente middleware
};

app.use(logger);

// Middleware de terceros
const cors = require('cors');
app.use(cors());
```

### Parámetros de Ruta y Query

```javascript
// Parámetros de ruta
app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  res.json({ mensaje: `Usuario con ID: ${id}` });
});

// Query parameters
app.get('/buscar', (req, res) => {
  const { nombre, edad } = req.query;
  res.json({ busqueda: { nombre, edad } });
});
// Ejemplo: /buscar?nombre=Juan&edad=25
```

### Manejo de Errores

```javascript
// Middleware de manejo de errores (debe ir al final)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo salió mal!',
    mensaje: err.message 
  });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});
```

## Ejemplo Completo: API REST Básica

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Base de datos simulada
let usuarios = [
  { id: 1, nombre: 'Ana', email: 'ana@email.com' },
  { id: 2, nombre: 'Carlos', email: 'carlos@email.com' }
];

// Obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
  res.json(usuarios);
});

// Obtener un usuario por ID
app.get('/api/usuarios/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  res.json(usuario);
});

// Crear un nuevo usuario
app.post('/api/usuarios', (req, res) => {
  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre: req.body.nombre,
    email: req.body.email
  };
  usuarios.push(nuevoUsuario);
  res.status(201).json(nuevoUsuario);
});

// Actualizar un usuario
app.put('/api/usuarios/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  usuario.nombre = req.body.nombre || usuario.nombre;
  usuario.email = req.body.email || usuario.email;
  res.json(usuario);
});

// Eliminar un usuario
app.delete('/api/usuarios/:id', (req, res) => {
  const index = usuarios.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  usuarios.splice(index, 1);
  res.json({ mensaje: 'Usuario eliminado' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
```

## Herramientas Útiles

### Nodemon
Reinicia automáticamente el servidor cuando detecta cambios:

```bash
npm install --save-dev nodemon
```

Agregar en `package.json`:
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

### Middleware Comunes

- **express.json()**: Parsea cuerpos JSON
- **express.urlencoded()**: Parsea datos de formularios
- **cors**: Habilita CORS
- **morgan**: Logger de peticiones HTTP
- **helmet**: Agrega seguridad con headers HTTP

## Estructura de Proyecto Recomendada

```
mi-proyecto/
├── src/
│   ├── controllers/     # Lógica de negocio
│   ├── routes/          # Definición de rutas
│   ├── middlewares/     # Middleware personalizados
│   ├── models/          # Modelos de datos
│   ├── config/          # Configuraciones
│   └── app.js           # Configuración de Express
├── .env                 # Variables de entorno
├── .gitignore
├── package.json
└── index.js             # Punto de entrada
```

## Próximos Pasos

Una vez que domines los conceptos básicos, puedes explorar:

1. **Bases de datos**: Integrar MongoDB (Mongoose) o PostgreSQL (Sequelize)
2. **Autenticación**: Implementar JWT o Passport.js
3. **Validación**: Usar bibliotecas como Joi o express-validator
4. **Testing**: Probar tu API con Jest o Mocha
5. **Documentación**: Generar documentación con Swagger
6. **Despliegue**: Publicar en Heroku, Vercel o AWS

## Recursos Adicionales

- 📚 [Documentación oficial de Express](https://expressjs.com/)
- 📚 [Node.js Documentation](https://nodejs.org/)
- 📚 [MDN Web Docs - HTTP](https://developer.mozilla.org/es/docs/Web/HTTP)

- 📚 [Documentation Oficial](https://expressjs.com/)
- 📚 [Documentation No Oficial](https://www.dongee.com/tutoriales/que-es-y-para-que-sirve-express-js/)
- 🚀 [Deploy](🚀)
---


![foto](./frontmicro/img/AlexiDgLogo_Backgroundless.png)



¡Felicitaciones! Ahora tienes las bases para comenzar a desarrollar aplicaciones backend con Express.js.



https://www.youtube.com/watch?v=iOhIV0_23qc&list=PLnfMiP0v59hAUA6QJNKBwKJyq5_gFkCYL&index=4

[Despliegue en vercel](https://dev.to/arindam_1729/deploy-your-express-backend-in-vercel-for-free-1321)