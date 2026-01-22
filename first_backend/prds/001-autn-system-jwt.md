# Product Requirements Document (PRD)

## Sistema de Autenticación con JWT

---

## 1. Resumen Ejecutivo

### 1.1 Objetivo

Implementar un sistema de autenticación robusto y seguro utilizando JSON Web Tokens (JWT) para el backend Express, permitiendo el registro, login y protección de rutas mediante tokens.

### 1.2 Alcance

- Registro de usuarios con encriptación de contraseñas
- Login con validación de credenciales
- Generación de tokens JWT
- Middleware de verificación de tokens
- Protección de rutas privadas
- Gestión de usuarios autenticados

---

## 2. Requisitos Funcionales

### 2.1 Registro de Usuarios (Sign Up)

**Endpoint**: `POST /api/auth/register`

**Entrada**:

```json
{
  "nombre": "Juan Pérez",
  "usuario": "juanp",
  "password": "miPassword123"
}
```

**Salida exitosa**:

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

**Validaciones**:

- Usuario no debe existir previamente
- Campos requeridos: nombre, usuario, password
- Password mínimo 6 caracteres
- La contraseña se encripta con bcrypt (10 rounds)

---

### 2.2 Inicio de Sesión (Login)

**Endpoint**: `POST /api/auth/login`

**Entrada**:

```json
{
  "usuario": "juanp",
  "password": "miPassword123"
}
```

**Salida exitosa**:

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

**Validaciones**:

- Usuario debe existir
- Password debe coincidir con el hash almacenado
- Token expira en 24 horas

---

### 2.3 Verificación de Token

**Middleware**: `verificarToken`

**Header requerido**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Comportamiento**:

- Extrae token del header Authorization
- Verifica validez y firma del token
- Adjunta datos del usuario a `req.usuario`
- Permite continuar si es válido
- Retorna error 401 si es inválido o ausente

---

### 2.4 Obtener Usuario Autenticado

**Endpoint**: `GET /api/auth/me`

**Header**: `Authorization: Bearer {token}`

**Salida**:

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

## 3. Requisitos No Funcionales

### 3.1 Seguridad

- Contraseñas hasheadas con bcrypt (salt rounds: 10)
- Tokens firmados con clave secreta (JWT_SECRET)
- Nunca retornar contraseñas en respuestas
- Protección contra SQL injection (consultas preparadas)

### 3.2 Rendimiento

- Hash de contraseña: < 200ms
- Verificación de token: < 50ms
- Generación de token: < 100ms

### 3.3 Disponibilidad

- Manejo de errores robusto
- Mensajes de error descriptivos
- Logs de errores de autenticación

---

## 4. Modelo de Datos

### 4.1 Tabla `usuarios`

```sql
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    usuario VARCHAR(20) UNIQUE NOT NULL,
    activo INT(1) DEFAULT 1
);
```

### 4.2 Tabla `auth`

```sql
CREATE TABLE auth (
    id INT PRIMARY KEY,
    usuario VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

---

## 5. Flujos de Usuario

### 5.1 Flujo de Registro

1. Usuario envía datos de registro
2. Sistema valida que el usuario no exista
3. Sistema hashea la contraseña
4. Sistema crea registro en tabla `usuarios`
5. Sistema crea registro en tabla `auth` con contraseña hasheada
6. Sistema retorna confirmación

### 5.2 Flujo de Login

1. Usuario envía credenciales
2. Sistema busca usuario en BD
3. Sistema compara password con bcrypt
4. Sistema genera token JWT con payload (id, usuario)
5. Sistema retorna token y datos del usuario

### 5.3 Flujo de Acceso a Ruta Protegida

1. Cliente envía request con token en header
2. Middleware extrae y verifica token
3. Si es válido, adjunta datos a req.usuario
4. Controlador procesa request
5. Sistema retorna respuesta

---

## 6. Códigos de Error

| Código | Mensaje                    | Descripción                   |
| ------ | -------------------------- | ----------------------------- |
| 400    | Datos incompletos          | Faltan campos requeridos      |
| 401    | Credenciales inválidas     | Usuario/password incorrectos  |
| 401    | Token no proporcionado     | Falta header Authorization    |
| 401    | Token inválido             | Token malformado o expirado   |
| 409    | Usuario ya existe          | Intento de registro duplicado |
| 500    | Error interno del servidor | Error no controlado           |

---

## 7. Variables de Entorno

```env
PORT=8000
MYSQL_HOST=localhost
MYSQL_USER=alexidg
MYSQL_PASS=campus2023
MYSQL_DB=first_backend_express
JWT_SECRET=tu_clave_secreta_super_segura_aqui_2024
```

---

## 8. Dependencias Requeridas

```json
{
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2"
}
```

---

## 9. Testing Manual

### 9.1 Registro

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan Pérez","usuario":"juanp","password":"123456"}'
```

### 9.2 Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"juanp","password":"123456"}'
```

### 9.3 Acceso a Ruta Protegida

```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer {TOKEN_AQUI}"
```

---

## 10. Criterios de Aceptación

- ✅ Usuario puede registrarse con datos válidos
- ✅ Usuario no puede registrarse con usuario duplicado
- ✅ Usuario puede iniciar sesión con credenciales correctas
- ✅ Usuario no puede iniciar sesión con credenciales incorrectas
- ✅ Token es generado correctamente al login
- ✅ Rutas protegidas rechazan requests sin token
- ✅ Rutas protegidas rechazan tokens inválidos
- ✅ Rutas protegidas permiten acceso con token válido
- ✅ Contraseñas nunca se exponen en respuestas
- ✅ Tokens expiran después de 24 horas

---

## 11. Roadmap Futuro

### Fase 2

- Refresh tokens
- Logout con blacklist de tokens
- Recuperación de contraseña
- Verificación de email
- Rate limiting en endpoints de auth

### Fase 3

- Autenticación de dos factores (2FA)
- OAuth (Google, GitHub)
- Roles y permisos (RBAC)
- Auditoría de accesos

---

## 12. Notas Técnicas

### Estructura del Token JWT

```javascript
{
  "id": 1,
  "usuario": "juanp",
  "iat": 1234567890,  // Issued at
  "exp": 1234654290   // Expiration (24h)
}
```

### Formato del Header Authorization

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

**Versión**: 1.0  
**Fecha**: Enero 2026  
**Autor**: Alexi Durán  
**Estado**: Ready for Implementation
