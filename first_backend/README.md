# First Backend in Express 🚀

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.1.0-blue.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-v8.0+-orange.svg)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-red.svg)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

> Backend RESTful API construido con Express.js, MySQL y autenticación JWT. Proyecto educativo para aprender desarrollo backend moderno.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Seguridad](#-seguridad)
- [Testing](#-testing)
- [Contribuir](#-contribuir)
- [Recursos](#-recursos)
- [Licencia](#-licencia)

---

## ✨ Características

- ✅ **API RESTful** completa con CRUD operations
- 🔐 **Autenticación JWT** segura con tokens
- 🔒 **Encriptación de contraseñas** con bcrypt
- 💾 **MySQL** con consultas preparadas (prevención SQL Injection)
- 📝 **Logging** de requests con Morgan
- 🌐 **CORS** configurado
- ⚡ **Hot reload** con Nodemon
- 📊 **Respuestas estandarizadas** JSON
- 🛡️ **Manejo de errores** centralizado
- 🧩 **Arquitectura modular** escalable

---

## 🛠️ Tecnologías

### Core

- **[Node.js](https://nodejs.org/)** - Runtime de JavaScript
- **[Express.js v5](https://expressjs.com/)** - Framework web
- **[MySQL2](https://www.npmjs.com/package/mysql2)** - Cliente MySQL para Node.js

### Seguridad & Auth

- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Encriptación de contraseñas
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)** - Generación y verificación de JWT
- **[CORS](https://www.npmjs.com/package/cors)** - Cross-Origin Resource Sharing

### Desarrollo

- **[Nodemon](https://nodemon.io/)** - Auto-restart en desarrollo
- **[Morgan](https://www.npmjs.com/package/morgan)** - HTTP request logger
- **[dotenv](https://www.npmjs.com/package/dotenv)** - Variables de entorno

---

## 📦 Instalación

### Requisitos Previos

- Node.js >= 18.0.0
- MySQL >= 8.0
- npm >= 9.0.0

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/first_backend.git
cd first_backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Crear la base de datos
mysql -u root -p < database.sql

# 5. Iniciar el servidor en modo desarrollo
npm run dev
```

El servidor estará corriendo en `http://localhost:8000`

---

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# Servidor
PORT=8000

# Base de Datos
MYSQL_HOST=localhost
MYSQL_USER=tu_usuario
MYSQL_PASS=tu_contraseña
MYSQL_DB=first_backend_express

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_aqui_2024
```

> ⚠️ **Importante**: Nunca subas el archivo `.env` a Git. Usa `.env.example` como plantilla.

### Base de Datos

Ejecuta el script SQL para crear las tablas necesarias:

```bash
mysql -u root -p < database.sql
```

O manualmente:

```sql
CREATE DATABASE IF NOT EXISTS first_backend_express;
USE first_backend_express;

-- Ver database.sql para el script completo
```

---

## 🚀 Uso

### Modo Desarrollo

```bash
npm run dev
```

Inicia el servidor con auto-reload usando Nodemon.

### Modo Producción

```bash
npm start
```

---

## 📡 API Endpoints

### Base URL

```
http://localhost:8000
```

### Autenticación

#### Registro

```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "usuario": "juanp",
  "password": "123456"
}
```

**Respuesta** (201):

```json
{
  "error": false,
  "status": 201,
  "body": {
    "message": "Usuario registrado exitosamente",
    "usuario": {
      "id": 1,
      "nombre": "Juan Pérez",
      "usuario": "juanp"
    }
  }
}
```

---

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "usuario": "juanp",
  "password": "123456"
}
```

**Respuesta** (200):

```json
{
  "error": false,
  "status": 200,
  "body": {
    "message": "Login exitoso",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 1,
      "nombre": "Juan Pérez",
      "usuario": "juanp"
    }
  }
}
```

---

#### Obtener Usuario Actual (Protegida)

```http
GET /api/auth/me
Authorization: Bearer {tu_token_jwt}
```

**Respuesta** (200):

```json
{
  "error": false,
  "status": 200,
  "body": {
    "id": 1,
    "nombre": "Juan Pérez",
    "usuario": "juanp",
    "activo": 1
  }
}
```

---

### Usuarios

#### Listar Usuarios

```http
GET /api/usuarios
```

#### Obtener Usuario por ID

```http
GET /api/usuarios/:id
```

#### Crear/Actualizar Usuario

```http
POST /api/usuarios
Content-Type: application/json

{
  "nombre": "María López",
  "usuario": "marial",
  "activo": 1
}
```

#### Eliminar Usuario

```http
PUT /api/usuarios
Content-Type: application/json

{
  "id": 1
}
```

---

### Clientes

Similar estructura a usuarios:

- `GET /api/clientes` - Listar
- `GET /api/clientes/:id` - Obtener por ID
- `POST /api/clientes` - Crear/Actualizar
- `PUT /api/clientes` - Eliminar

---

## 📂 Estructura del Proyecto

```
first_backend/
├── src/
│   ├── index.js              # Punto de entrada
│   ├── app.js                # Configuración de Express
│   ├── config.js             # Configuración centralizada
│   │
│   ├── db/
│   │   └── mysql.js          # Conexión y queries MySQL
│   │
│   ├── middlewares/
│   │   ├── auth.js           # Middleware JWT
│   │   └── error.js          # Manejo de errores
│   │
│   ├── red/
│   │   ├── respuestas.js     # Respuestas HTTP estandarizadas
│   │   └── error.js          # Manejador global de errores
│   │
│   └── modulos/
│       ├── auth/             # Módulo de autenticación
│       ├── usuarios/         # Módulo de usuarios
│       └── clientes/         # Módulo de clientes
│
├── .env                      # Variables de entorno (NO subir)
├── .env.example              # Plantilla de .env
├── database.sql              # Script de base de datos
├── package.json              # Dependencias
├── README.md                 # Este archivo
└── SYSTEMARTIFACT.md        # Documentación técnica detallada
```

---

## 🔒 Seguridad

### Implementaciones de Seguridad

✅ **SQL Injection Prevention**

- Uso de consultas preparadas (prepared statements)
- Validación de entrada con placeholders `?` y `??`

✅ **Password Security**

- Hashing con bcrypt (10 rounds de salt)
- Nunca almacenar contraseñas en texto plano

✅ **JWT Authentication**

- Tokens firmados con HMAC SHA256
- Expiración configurada (24 horas)
- Verificación en cada request protegido

✅ **CORS**

- Configuración de orígenes permitidos
- Protección contra cross-site scripting

✅ **Environment Variables**

- Credenciales sensibles en `.env`
- `.env` incluido en `.gitignore`

### Buenas Prácticas

```javascript
// ❌ NO HACER - SQL Injection vulnerable
query(`SELECT * FROM users WHERE id = ${userId}`);

// ✅ HACER - Prepared statements
query("SELECT * FROM users WHERE id = ?", [userId]);
```

---

## 🧪 Testing

### Testing Manual con cURL

#### Registro

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "usuario": "testuser",
    "password": "123456"
  }'
```

#### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "testuser",
    "password": "123456"
  }'
```

#### Ruta Protegida

```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Testing con Postman

1. Importar colección desde `/postman/collection.json` (próximamente)
2. Configurar variable de entorno `baseUrl` = `http://localhost:8000`
3. Ejecutar requests

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de Commits

- `Add:` Nueva funcionalidad
- `Fix:` Corrección de bug
- `Update:` Actualización de código existente
- `Docs:` Cambios en documentación
- `Refactor:` Refactorización de código

---

## 📚 Recursos

### Documentación

- 📖 [SYSTEMARTIFACT.md](./SYSTEMARTIFACT.md) - Documentación técnica completa
- 📋 [database.sql](./database.sql) - Schema de base de datos

### Tutoriales Recomendados

- [Curso de YouTube - Backend con Express](https://www.youtube.com/watch?v=F5oOq-FWUl4&list=PLnfMiP0v59hAUA6QJNKBwKJyq5_gFkCYL)
- [Express.js Documentation](https://expressjs.com/)
- [JWT Introduction](https://jwt.io/introduction)

### Herramientas Útiles

- [Postman](https://www.postman.com/) - Testing de APIs
- [MySQL Workbench](https://www.mysql.com/products/workbench/) - GUI para MySQL
- [VS Code REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) - Testing desde VS Code

---

## 🎯 Roadmap

### Versión Actual (v1.0) ✅

- [x] CRUD básico de usuarios y clientes
- [x] Autenticación JWT
- [x] Encriptación de contraseñas
- [x] Manejo de errores
- [x] Documentación completa

### Próximas Versiones

#### v1.1 🔄

- [ ] Tests unitarios con Jest
- [ ] Tests de integración
- [ ] Colección de Postman
- [ ] Docker containerization

#### v2.0 🚀

- [ ] Refresh tokens
- [ ] Roles y permisos (RBAC)
- [ ] Rate limiting
- [ ] Paginación en listados
- [ ] Búsqueda y filtros

#### v2.1 📈

- [ ] Subida de archivos
- [ ] Email notifications
- [ ] Password recovery
- [ ] 2FA (Two-Factor Authentication)

---

## 📊 Estado del Proyecto

```
┌─────────────────────────────────────────┐
│  Estado: ✅ En Producción (Educativo)   │
│  Versión: 1.0.0                         │
│  Última actualización: Enero 2026       │
│  Cobertura de tests: 0% (Pendiente)     │
└─────────────────────────────────────────┘
```

---

## 👨‍💻 Autor

**Alexi Durán** - [@Alexi_Dg](https://github.com/alexidg)

---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

---

## 🙏 Agradecimientos

- [Curso de YouTube](https://www.youtube.com/watch?v=F5oOq-FWUl4&list=PLnfMiP0v59hAUA6QJNKBwKJyq5_gFkCYL&index=4) por el tutorial base
- Comunidad de Express.js
- Stack Overflow community

---

## 📞 Soporte

Si tienes preguntas o problemas:

1. Revisa la [documentación técnica](./SYSTEMARTIFACT.md)
2. Busca en [Issues](../../issues)
3. Crea un nuevo Issue con el template adecuado

---

<div align="center">

**⭐ Si este proyecto te ayudó, considera darle una estrella ⭐**

Made with ❤️ by Alexi Durán

[🏠 Inicio](#first-backend-in-express-) · [📖 Docs](./SYSTEMARTIFACT.md) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

</div>
