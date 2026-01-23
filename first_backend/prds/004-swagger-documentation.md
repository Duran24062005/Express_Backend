# Product Requirements Document (PRD)

## Documentación Swagger/OpenAPI con Swagger JSDoc

---

## 1. Resumen Ejecutivo

### 1.1 Objetivo

Implementar documentación completa de la API utilizando Swagger/OpenAPI 3.0 con Swagger JSDoc, proporcionando una interfaz interactiva para explorar, probar y entender todos los endpoints de la API, incluyendo soporte para autenticación JWT.

### 1.2 Alcance

- Documentación completa de todos los endpoints (Auth, Clientes, Usuarios)
- Interfaz Swagger UI interactiva accesible en `/api-docs`
- Esquemas de datos definidos para todos los modelos
- Soporte de autenticación JWT en Swagger UI
- Documentación inline usando comentarios JSDoc
- Configuración OpenAPI 3.0.0

---

## 2. Requisitos Funcionales

### 2.1 Configuración de Swagger

**Archivo**: `src/config/swagger.js`

**Requisitos**:

- Configuración OpenAPI 3.0.0
- Información de la API (título, versión, descripción)
- Servidor base configurado dinámicamente (puerto 8000 o 4000 según configuración)
- Esquema de seguridad Bearer JWT
- Definición de todos los componentes (schemas):
  - Cliente
  - Usuario
  - AuthRegister
  - AuthLogin
  - RespuestaSuccess
  - RespuestaError
  - LoginResponse
  - RegisterResponse
  - DeleteRequest

**Tags**:
- Auth: Endpoints de autenticación
- Clientes: Endpoints para gestión de clientes
- Usuarios: Endpoints para gestión de usuarios

### 2.2 Integración en Aplicación Principal

**Archivo**: `src/app.js`

**Requisitos**:

- Importar configuración de Swagger
- Configurar ruta `/api-docs` para Swagger UI
- Personalización básica de la interfaz (ocultar topbar, título personalizado)
- Integración sin afectar rutas existentes

### 2.3 Documentación de Endpoints de Autenticación

**Archivo**: `src/modulos/auth/rutas.js`

#### 2.3.1 POST /api/auth/register

**Documentación requerida**:

- Tag: Auth
- Descripción: Registrar nuevo usuario
- Request body: Schema AuthRegister
- Respuestas:
  - 201: Usuario registrado exitosamente (RegisterResponse)
  - 400: Datos incompletos o contraseña inválida
  - 409: El usuario ya existe

#### 2.3.2 POST /api/auth/login

**Documentación requerida**:

- Tag: Auth
- Descripción: Iniciar sesión
- Request body: Schema AuthLogin
- Respuestas:
  - 200: Login exitoso (LoginResponse con token)
  - 400: Usuario y contraseña requeridos
  - 401: Credenciales inválidas

#### 2.3.3 GET /api/auth/me

**Documentación requerida**:

- Tag: Auth
- Descripción: Obtener usuario actual
- Security: Bearer JWT (requerido)
- Respuestas:
  - 200: Información del usuario (Usuario)
  - 401: Token no proporcionado, inválido o expirado

### 2.4 Documentación de Endpoints de Clientes

**Archivo**: `src/modulos/clientes/rutas.js`

#### 2.4.1 GET /api/clientes

**Documentación requerida**:

- Tag: Clientes
- Descripción: Listar todos los clientes
- Respuestas:
  - 200: Lista de clientes (array de Cliente)

#### 2.4.2 GET /api/clientes/{id}

**Documentación requerida**:

- Tag: Clientes
- Descripción: Obtener un cliente por ID
- Parámetros: id (path, integer, requerido)
- Respuestas:
  - 200: Cliente obtenido exitosamente
  - 500: Error interno del servidor

#### 2.4.3 POST /api/clientes

**Documentación requerida**:

- Tag: Clientes
- Descripción: Crear o actualizar cliente
- Request body: Schema Cliente (id opcional para crear)
- Respuestas:
  - 201: Cliente creado o actualizado exitosamente
  - 500: Error interno del servidor

#### 2.4.4 PUT /api/clientes

**Documentación requerida**:

- Tag: Clientes
- Descripción: Eliminar cliente
- Request body: Schema DeleteRequest
- Respuestas:
  - 200: Cliente eliminado exitosamente
  - 500: Error interno del servidor

### 2.5 Documentación de Endpoints de Usuarios

**Archivo**: `src/modulos/usuarios/rutas.js`

#### 2.5.1 GET /api/usuarios

**Documentación requerida**:

- Tag: Usuarios
- Descripción: Listar todos los usuarios
- Respuestas:
  - 200: Lista de usuarios (array de Usuario)

#### 2.5.2 GET /api/usuarios/{id}

**Documentación requerida**:

- Tag: Usuarios
- Descripción: Obtener un usuario por ID
- Parámetros: id (path, integer, requerido)
- Respuestas:
  - 200: Usuario obtenido exitosamente
  - 500: Error interno del servidor

#### 2.5.3 POST /api/usuarios

**Documentación requerida**:

- Tag: Usuarios
- Descripción: Crear o actualizar usuario
- Request body: Schema Usuario + opcionalmente usuario/password
- Respuestas:
  - 201: Usuario creado o actualizado exitosamente
  - 500: Error interno del servidor

#### 2.5.4 PUT /api/usuarios

**Documentación requerida**:

- Tag: Usuarios
- Descripción: Eliminar usuario
- Request body: Schema DeleteRequest
- Respuestas:
  - 200: Usuario eliminado exitosamente
  - 500: Error interno del servidor

---

## 3. Requisitos No Funcionales

### 3.1 Rendimiento

- La carga de Swagger UI no debe afectar el rendimiento de la aplicación
- La documentación debe generarse dinámicamente sin impacto significativo en el tiempo de inicio

### 3.2 Mantenibilidad

- Documentación inline en el código fuente usando JSDoc
- Fácil actualización cuando se agreguen nuevos endpoints
- Separación de configuración en archivo dedicado

### 3.3 Usabilidad

- Interfaz intuitiva y fácil de usar
- Botón "Authorize" visible para autenticación JWT
- Ejemplos claros en cada endpoint
- Descripciones comprensibles

### 3.4 Compatibilidad

- OpenAPI 3.0.0
- Compatible con herramientas estándar de Swagger/OpenAPI
- Soporte para importación en Postman, Insomnia, etc.

---

## 4. Especificaciones Técnicas

### 4.1 Dependencias

```json
{
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.1"
}
```

### 4.2 Estructura de Archivos

```
src/
├── config/
│   └── swagger.js          # Configuración de Swagger
├── app.js                  # Integración de Swagger UI
└── modulos/
    ├── auth/
    │   └── rutas.js        # Documentación JSDoc de auth
    ├── clientes/
    │   └── rutas.js        # Documentación JSDoc de clientes
    └── usuarios/
        └── rutas.js        # Documentación JSDoc de usuarios
```

### 4.3 Esquemas de Datos

#### Cliente

```json
{
  "id": "integer",
  "nombre": "string",
  "edad": "integer",
  "profesion": "string"
}
```

#### Usuario

```json
{
  "id": "integer",
  "nombre": "string",
  "usuario": "string",
  "activo": "integer"
}
```

#### AuthRegister

```json
{
  "nombre": "string",
  "usuario": "string",
  "password": "string (min 6 caracteres)"
}
```

#### AuthLogin

```json
{
  "usuario": "string",
  "password": "string"
}
```

#### RespuestaSuccess

```json
{
  "error": false,
  "status": "integer",
  "body": "any"
}
```

#### RespuestaError

```json
{
  "error": true,
  "status": "integer",
  "body": "string"
}
```

### 4.4 Configuración de Seguridad

**Tipo**: Bearer Authentication (JWT)

**Header**: `Authorization: Bearer <token>`

**Descripción**: Token JWT obtenido del endpoint `/api/auth/login`

---

## 5. Criterios de Aceptación

### 5.1 Funcionalidad

- [x] Swagger UI accesible en `/api-docs`
- [x] Todos los endpoints documentados correctamente
- [x] Esquemas de datos definidos y utilizados
- [x] Autenticación JWT funcional en Swagger UI
- [x] Ejemplos proporcionados para cada endpoint
- [x] Respuestas de error documentadas

### 5.2 Calidad

- [x] Documentación clara y completa
- [x] Código bien estructurado y mantenible
- [x] Sin errores de sintaxis en JSDoc
- [x] Configuración correcta de OpenAPI 3.0

### 5.3 Integración

- [x] No afecta funcionalidad existente
- [x] Integración limpia en app.js
- [x] Puerto configurado dinámicamente

---

## 6. Plan de Implementación

### Fase 1: Configuración Base

1. Instalar dependencias (`swagger-jsdoc`, `swagger-ui-express`)
2. Crear archivo de configuración `src/config/swagger.js`
3. Definir todos los schemas y componentes
4. Configurar seguridad JWT

### Fase 2: Integración

1. Integrar Swagger UI en `src/app.js`
2. Configurar ruta `/api-docs`
3. Personalizar interfaz básica

### Fase 3: Documentación de Endpoints

1. Documentar endpoints de Auth
2. Documentar endpoints de Clientes
3. Documentar endpoints de Usuarios

### Fase 4: Validación y PRD

1. Probar Swagger UI
2. Verificar autenticación JWT
3. Validar todos los endpoints
4. Crear PRD completo

---

## 7. Ejemplos de Uso

### 7.1 Acceso a Swagger UI

1. Iniciar el servidor: `npm run dev`
2. Abrir navegador en: `http://localhost:8000/api-docs` (o puerto configurado)
3. Explorar endpoints disponibles

### 7.2 Autenticación en Swagger UI

1. Expandir endpoint `POST /api/auth/login`
2. Hacer clic en "Try it out"
3. Ingresar credenciales de ejemplo
4. Ejecutar y copiar el token recibido
5. Hacer clic en botón "Authorize" (arriba a la derecha)
6. Ingresar token en formato: `Bearer <token>` o solo `<token>`
7. Hacer clic en "Authorize" y luego "Close"
8. Probar endpoints protegidos como `GET /api/auth/me`

### 7.3 Probar Endpoints

1. Seleccionar cualquier endpoint
2. Hacer clic en "Try it out"
3. Completar parámetros si es necesario
4. Hacer clic en "Execute"
5. Revisar respuesta en la sección "Responses"

---

## 8. Notas Adicionales

### 8.1 Consideraciones

- Los endpoints no tienen nombres ni versiones individuales según requisitos
- Los modelos de datos fueron inferidos de la estructura de base de datos
- El puerto se configura dinámicamente (8000 o 4000 según configuración)
- La documentación se mantiene inline con el código para facilitar mantenimiento

### 8.2 Mejoras Futuras

- Agregar más ejemplos de respuestas
- Incluir códigos de estado HTTP adicionales
- Agregar validaciones más detalladas en schemas
- Considerar versionado de API en el futuro
- Agregar documentación de errores comunes

---

## 9. Referencias

- [OpenAPI Specification 3.0](https://swagger.io/specification/)
- [Swagger JSDoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [Swagger UI Express Documentation](https://github.com/scottie1984/swagger-ui-express)

---

**Versión del PRD**: 1.0.0  
**Fecha**: 2024  
**Autor**: Alexi_Dg
