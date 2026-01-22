# SYSTEMARTIFACT.md

## Documentación Técnica del Sistema Backend Express + MySQL + JWT

---

## 📋 Tabla de Contenidos

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Estructura de Directorios](#estructura-de-directorios)
3. [Flujo de Datos](#flujo-de-datos)
4. [Componentes Principales](#componentes-principales)
5. [Base de Datos](#base-de-datos)
6. [Sistema de Autenticación](#sistema-de-autenticación)
7. [API Endpoints](#api-endpoints)
8. [Seguridad](#seguridad)
9. [Manejo de Errores](#manejo-de-errores)
10. [Guía de Desarrollo](#guía-de-desarrollo)

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

```
┌─────────────────────────────────────────┐
│           CLIENTE (Frontend)            │
│     (HTML/JS/React/Vue/Angular)         │
└─────────────┬───────────────────────────┘
              │ HTTP/HTTPS
              │ JSON
┌─────────────▼───────────────────────────┐
│         EXPRESS.JS SERVER               │
│  ┌───────────────────────────────────┐  │
│  │  Middlewares                      │  │
│  │  - CORS                           │  │
│  │  - Morgan (Logging)               │  │
│  │  - Body Parser                    │  │
│  │  - Auth JWT Verification          │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Rutas (Routes)                   │  │
│  │  - /api/auth                      │  │
│  │  - /api/usuarios                  │  │
│  │  - /api/clientes                  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Controladores (Controllers)      │  │
│  │  - Lógica de Negocio              │  │
│  │  - Validaciones                   │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Capa de Datos (Data Layer)      │  │
│  │  - MySQL Connection               │  │
│  │  - Query Builders                 │  │
│  └───────────────────────────────────┘  │
└─────────────┬───────────────────────────┘
              │ SQL Queries
              │ Prepared Statements
┌─────────────▼───────────────────────────┐
│         MySQL DATABASE                  │
│  ┌───────────────────────────────────┐  │
│  │  Tables                           │  │
│  │  - usuarios                       │  │
│  │  - auth                           │  │
│  │  - clientes                       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Patrón de Diseño: MVC (Modificado)

- **Model**: Capa de datos (`src/db/mysql.js`)
- **View**: API JSON (respuestas estructuradas)
- **Controller**: Controladores de módulos (`src/modulos/*/controlador.js`)

---

## 📁 Estructura de Directorios

```
first_backend/
├── .env                          # Variables de entorno (NO subir a Git)
├── .env.example                  # Plantilla de variables de entorno
├── .gitignore                    # Archivos ignorados por Git
├── package.json                  # Dependencias y scripts
├── package-lock.json             # Lock de dependencias
├── README.md                     # Documentación general
├── SYSTEMARTIFACT.md            # Documentación técnica (este archivo)
├── database.sql                  # Script de creación de BD
│
└── src/
    ├── index.js                  # Punto de entrada de la aplicación
    ├── app.js                    # Configuración de Express
    ├── config.js                 # Configuración centralizada
    │
    ├── db/
    │   ├── mysql.js              # Conexión y queries a MySQL
    │   └── exampleData.js        # Datos de ejemplo (desarrollo)
    │
    ├── middlewares/
    │   ├── auth.js               # Middleware de autenticación JWT
    │   └── error.js              # Middleware de manejo de errores
    │
    ├── red/
    │   ├── respuestas.js         # Respuestas estandarizadas
    │   └── error.js              # Manejador de errores global
    │
    └── modulos/
        ├── auth/
        │   ├── controlador.js    # Lógica de autenticación
        │   ├── rutas.js          # Endpoints de auth
        │   └── index.js          # Export con dependencias
        │
        ├── usuarios/
        │   ├── controlador.js    # CRUD de usuarios
        │   ├── rutas.js          # Endpoints de usuarios
        │   └── index.js          # Export con dependencias
        │
        └── clientes/
            ├── controlador.js    # CRUD de clientes
            ├── rutas.js          # Endpoints de clientes
            └── index.js          # Export con dependencias
```

---

## 🔄 Flujo de Datos

### 1. Request Flow (Cliente → Servidor)

```
Cliente
   ↓
[HTTP Request]
   ↓
Express Server (app.js)
   ↓
Middleware Stack
   ├─→ CORS
   ├─→ Morgan (Logging)
   ├─→ Body Parser
   └─→ Auth JWT (si es ruta protegida)
   ↓
Router (rutas.js)
   ↓
Controller (controlador.js)
   ├─→ Validaciones
   ├─→ Lógica de Negocio
   └─→ Llamadas a DB
   ↓
Database Layer (mysql.js)
   ↓
MySQL Database
```

### 2. Response Flow (Servidor → Cliente)

```
MySQL Database
   ↓
Database Layer (mysql.js)
   ↓
Controller (controlador.js)
   ↓
Response Handler (respuestas.js)
   ├─→ success() o error()
   └─→ Formato JSON estandarizado
   ↓
Express Response
   ↓
Cliente
```

---

## 🧩 Componentes Principales

### 1. **src/index.js**

Punto de entrada de la aplicación.

```javascript
// Inicia el servidor Express
const app = require("./app");
app.listen(app.get("port"), callback);
```

**Responsabilidad**: Inicializar el servidor.

---

### 2. **src/app.js**

Configuración central de Express.

```javascript
// Configuración de middlewares y rutas
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/auth", authRoutes);
```

**Responsabilidades**:

- Configurar middlewares globales
- Registrar rutas de módulos
- Configurar manejo de errores

---

### 3. **src/config.js**

Configuración centralizada desde variables de entorno.

```javascript
module.exports = {
  app: { port: process.env.PORT },
  mysql: { host, user, pass, database },
  jwt: { secret: process.env.JWT_SECRET },
};
```

**Patrón**: Single Source of Truth para configuración.

---

### 4. **src/db/mysql.js**

Capa de abstracción de base de datos.

**Funciones principales**:

| Función                     | Descripción               | Retorno         |
| --------------------------- | ------------------------- | --------------- |
| `todos(tabla)`              | SELECT \* FROM tabla      | Promise<Array>  |
| `uno(tabla, id)`            | SELECT \* WHERE id        | Promise<Array>  |
| `query(tabla, condiciones)` | SELECT con WHERE dinámico | Promise<Array>  |
| `agregar(tabla, datos)`     | INSERT o UPDATE           | Promise<Result> |
| `eliminar(tabla, id)`       | DELETE WHERE id           | Promise<Result> |

**Seguridad**: Usa **prepared statements** para prevenir SQL Injection.

---

### 5. **src/middlewares/auth.js**

Sistema de autenticación JWT.

**Funciones**:

```javascript
// Genera un token JWT
generarToken({ id, usuario });
// → "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Verifica un token JWT
verificarToken(token);
// → { id, usuario, iat, exp }

// Middleware para proteger rutas
chequearToken.confirmarToken(req, res, next);
// → Valida token y adjunta req.usuario
```

**Headers esperados**:

```
Authorization: Bearer {token}
```

---

### 6. **src/red/respuestas.js**

Estandarización de respuestas HTTP.

**Success Response**:

```json
{
  "error": false,
  "status": 200,
  "body": { "data": "..." }
}
```

**Error Response**:

```json
{
  "error": true,
  "status": 500,
  "body": "Mensaje de error"
}
```

---

### 7. **Módulos (src/modulos/)**

Cada módulo sigue la estructura:

```
modulo/
├── controlador.js  # Lógica de negocio
├── rutas.js        # Definición de endpoints
└── index.js        # Inyección de dependencias
```

**Patrón**: Dependency Injection para facilitar testing.

```javascript
// controlador.js
module.exports = function (dbInyectada) {
  let db = dbInyectada || require("../../db/mysql.js");
  // ... funciones
};
```

---

## 💾 Base de Datos

### Diagrama de Entidades

```
┌─────────────────┐
│    usuarios     │
├─────────────────┤
│ id (PK)         │◄─┐
│ nombre          │  │
│ usuario (UQ)    │  │
│ activo          │  │
└─────────────────┘  │
                     │ FK
┌─────────────────┐  │
│      auth       │  │
├─────────────────┤  │
│ id (PK, FK)     │──┘
│ usuario (UQ)    │
│ password        │
└─────────────────┘

┌─────────────────┐
│    clientes     │
├─────────────────┤
│ id (PK)         │
│ nombre          │
│ edad            │
│ profesion       │
└─────────────────┘
```

### Script de Creación

```sql
CREATE DATABASE IF NOT EXISTS first_backend_express;
USE first_backend_express;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    usuario VARCHAR(20) UNIQUE NOT NULL,
    activo INT(1) DEFAULT 1
);

CREATE TABLE auth (
    id INT PRIMARY KEY,
    usuario VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE clientes (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(50),
    edad INTEGER(2),
    profesion VARCHAR(50)
);
```

---

## 🔐 Sistema de Autenticación

### Flujo de Registro

```
1. POST /api/auth/register
   ↓
2. Validar datos
   ↓
3. Verificar usuario no exista
   ↓
4. Hashear password (bcrypt, 10 rounds)
   ↓
5. INSERT en tabla usuarios
   ↓
6. INSERT en tabla auth
   ↓
7. Retornar usuario creado (sin password)
```

### Flujo de Login

```
1. POST /api/auth/login
   ↓
2. Buscar usuario en BD
   ↓
3. Comparar password con bcrypt.compare()
   ↓
4. Generar JWT token (exp: 24h)
   ↓
5. Retornar { token, usuario }
```

### Flujo de Acceso a Ruta Protegida

```
1. Request con header: Authorization: Bearer {token}
   ↓
2. Middleware chequearToken.confirmarToken
   ↓
3. Extraer token del header
   ↓
4. Verificar token con jwt.verify()
   ↓
5. Adjuntar datos a req.usuario
   ↓
6. Continuar a controlador (next())
```

### Formato del Token JWT

```json
{
  "id": 1,
  "usuario": "juanp",
  "iat": 1234567890,
  "exp": 1234654290
}
```

**Firma**: HMAC SHA256 con `JWT_SECRET`

---

## 🌐 API Endpoints

### Rutas Públicas

#### `POST /api/auth/register`

Registra un nuevo usuario.

**Request Body**:

```json
{
  "nombre": "Juan Pérez",
  "usuario": "juanp",
  "password": "123456"
}
```

**Response** (201):

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

#### `POST /api/auth/login`

Inicia sesión y obtiene token.

**Request Body**:

```json
{
  "usuario": "juanp",
  "password": "123456"
}
```

**Response** (200):

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

### Rutas Protegidas

#### `GET /api/auth/me`

Obtiene información del usuario autenticado.

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (200):

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

#### `GET /api/usuarios`

Lista todos los usuarios.

**Response** (200):

```json
{
  "error": false,
  "status": 200,
  "body": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "usuario": "juanp",
      "activo": 1
    }
  ]
}
```

---

#### `GET /api/usuarios/:id`

Obtiene un usuario específico.

**Response** (200):

```json
{
  "error": false,
  "status": 200,
  "body": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "usuario": "juanp",
      "activo": 1
    }
  ]
}
```

---

#### `POST /api/usuarios`

Crea o actualiza un usuario.

**Request Body (Crear)**:

```json
{
  "nombre": "María López",
  "usuario": "marial",
  "activo": 1
}
```

**Request Body (Actualizar)**:

```json
{
  "id": 1,
  "nombre": "Juan Pérez Actualizado",
  "usuario": "juanp",
  "activo": 1
}
```

---

#### `PUT /api/usuarios`

Elimina un usuario.

**Request Body**:

```json
{
  "id": 1
}
```

---

### CRUD de Clientes

Similar a usuarios, endpoints disponibles:

- `GET /api/clientes`
- `GET /api/clientes/:id`
- `POST /api/clientes`
- `PUT /api/clientes`

---

## 🔒 Seguridad

### 1. **Prevención de SQL Injection**

✅ **Correcto** (Prepared Statements):

```javascript
connection.query("SELECT * FROM ?? WHERE id = ?", [tabla, id]);
```

❌ **Incorrecto** (String Interpolation):

```javascript
connection.query(`SELECT * FROM ${tabla} WHERE id = ${id}`);
```

### 2. **Encriptación de Contraseñas**

```javascript
// Hashear (10 rounds de salt)
const hash = await bcrypt.hash(password, 10);

// Verificar
const valido = await bcrypt.compare(password, hash);
```

**Nunca** almacenar contraseñas en texto plano.

### 3. **JWT Token Security**

- Secret almacenado en variable de entorno
- Tokens firmados con HMAC SHA256
- Expiración en 24 horas
- Validación en cada request protegido

### 4. **CORS**

```javascript
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Origen permitido
  }),
);
```

### 5. **Variables de Entorno**

```bash
# .gitignore debe incluir:
.env
/node_modules
```

Nunca commitear `.env` a Git.

---

## ⚠️ Manejo de Errores

### 1. **Try-Catch en Controladores**

```javascript
async function agregar(req, res, next) {
  try {
    const resultado = await controlador.agregar(req.body);
    respuesta.success(req, res, resultado, 201);
  } catch (error) {
    next(error); // Pasa al middleware de error
  }
}
```

### 2. **Middleware Global de Errores**

```javascript
// src/red/error.js
function errors(err, req, res, next) {
  const message = err.message || "Error interno";
  const status = err.statusCode || 500;
  respuesta.error(req, res, message, status);
}
```

### 3. **Errores Personalizados**

```javascript
// src/middlewares/error.js
function error(message, code) {
  let e = new Error(message);
  if (code) {
    e.statusCode = code;
  }
  return e;
}
```

---

## 👨‍💻 Guía de Desarrollo

### Setup Inicial

```bash
# 1. Clonar repositorio
git clone <repo-url>

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Crear base de datos
mysql -u root -p < database.sql

# 5. Iniciar servidor
npm run dev
```

### Agregar un Nuevo Módulo

```bash
# 1. Crear carpeta
mkdir src/modulos/nuevo_modulo

# 2. Crear archivos
touch src/modulos/nuevo_modulo/controlador.js
touch src/modulos/nuevo_modulo/rutas.js
touch src/modulos/nuevo_modulo/index.js

# 3. Implementar lógica (ver estructura de módulos existentes)

# 4. Registrar en app.js
const nuevoModulo = require('./modulos/nuevo_modulo/rutas.js');
app.use('/api/nuevo-modulo', nuevoModulo);
```

### Testing con cURL

```bash
# Registro
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test User","usuario":"testuser","password":"123456"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"testuser","password":"123456"}'

# Ruta protegida
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer {TOKEN}"
```

### Debugging

```javascript
// Agregar logs en controladores
console.log("[DEBUG]", "Variable:", variable);

// Morgan ya registra todas las peticiones HTTP
// Revisar la consola para ver requests entrantes
```

---

## 📊 Métricas y Monitoreo

### Logs Automáticos (Morgan)

```
GET /api/usuarios 200 45.123 ms - 234
POST /api/auth/login 401 12.456 ms - 56
```

Formato: `METHOD /path STATUS TIME - SIZE`

---

## 🚀 Despliegue

### Variables de Entorno en Producción

```env
NODE_ENV=production
PORT=8000
MYSQL_HOST=db.production.com
MYSQL_USER=prod_user
MYSQL_PASS=secure_password
MYSQL_DB=prod_database
JWT_SECRET=super_secure_random_string_here
```

### Consideraciones

- Usar HTTPS en producción
- Configurar rate limiting
- Implementar logging robusto
- Backup automático de base de datos
- Monitoreo de errores (Sentry, LogRocket)

---

## 📚 Referencias

- [Express.js Documentation](https://expressjs.com/)
- [MySQL2 npm Package](https://www.npmjs.com/package/mysql2)
- [JWT.io](https://jwt.io/)
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
- [OWASP Security Guidelines](https://owasp.org/)

---

**Versión**: 1.0  
**Última Actualización**: Enero 2026  
**Autor**: Alexi Durán  
**Licencia**: ISC
