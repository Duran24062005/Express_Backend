# Flujo de Autenticación - Guía Completa

## 📋 Usuario de Ejemplo

```
Nombre: Juan Pérez
Usuario: juanperez
Password: miPassword123
```

---

## 🔄 Flujo Completo

### Paso 1: Registrar un Nuevo Usuario

#### Endpoint
```
POST http://localhost:4000/api/auth/register
```

#### Headers
```
Content-Type: application/json
```

#### Body (JSON)
```json
{
  "nombre": "Juan Pérez",
  "usuario": "juanperez",
  "password": "miPassword123"
}
```

#### Ejemplo con cURL
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "usuario": "juanperez",
    "password": "miPassword123"
  }'
```

#### Respuesta Exitosa (201)
```json
{
  "error": false,
  "status": 201,
  "body": {
    "message": "Usuario registrado exitosamente",
    "usuario": {
      "id": 1,
      "nombre": "Juan Pérez",
      "usuario": "juanperez"
    }
  }
}
```

#### Validaciones
- ✅ El usuario no debe existir previamente
- ✅ Todos los campos son requeridos (nombre, usuario, password)
- ✅ La contraseña debe tener al menos 6 caracteres

#### Errores Posibles
- **409 Conflict**: El usuario ya existe
- **400 Bad Request**: Datos incompletos o contraseña muy corta

---

### Paso 2: Hacer Login

#### Endpoint
```
POST http://localhost:4000/api/auth/login
```

#### Headers
```
Content-Type: application/json
```

#### Body (JSON)
```json
{
  "usuario": "juanperez",
  "password": "miPassword123"
}
```

#### Ejemplo con cURL
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "juanperez",
    "password": "miPassword123"
  }'
```

#### Respuesta Exitosa (200)
```json
{
  "error": false,
  "status": 200,
  "body": {
    "message": "Login exitoso",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXN1YXJpbyI6Imp1YW5wZXJleiIsImlhdCI6MTcwNDE2ODAwMCwiZXhwIjoxNzA0MjU0NDAwfQ.abc123...",
    "usuario": {
      "id": 1,
      "nombre": "Juan Pérez",
      "usuario": "juanperez"
    }
  }
}
```

#### ⚠️ IMPORTANTE: Guarda el Token
El token JWT que recibes en la respuesta es necesario para acceder a rutas protegidas. Guárdalo para usarlo en el siguiente paso.

#### Errores Posibles
- **400 Bad Request**: Faltan credenciales
- **401 Unauthorized**: Credenciales inválidas (usuario no existe o contraseña incorrecta)

---

### Paso 3: Acceder a Rutas Protegidas

#### Endpoint (Ejemplo)
```
GET http://localhost:4000/api/auth/me
```

#### Headers
```
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json
```

#### Ejemplo con cURL
```bash
# Reemplaza TU_TOKEN_AQUI con el token recibido en el login
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

#### Respuesta Exitosa (200)
```json
{
  "error": false,
  "status": 200,
  "body": {
    "id": 1,
    "nombre": "Juan Pérez",
    "usuario": "juanperez",
    "activo": 1
  }
}
```

#### Errores Posibles
- **401 Unauthorized**: Token no proporcionado, formato inválido, o token expirado

---

## 📝 Ejemplo Completo Paso a Paso

### 1. Iniciar el Servidor

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:4000`

### 2. Registrar Usuario

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "usuario": "juanperez",
    "password": "miPassword123"
  }'
```

**Respuesta esperada:**
```json
{
  "error": false,
  "status": 201,
  "body": {
    "message": "Usuario registrado exitosamente",
    "usuario": {
      "id": 1,
      "nombre": "Juan Pérez",
      "usuario": "juanperez"
    }
  }
}
```

### 3. Hacer Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "juanperez",
    "password": "miPassword123"
  }'
```

**Respuesta esperada:**
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
      "usuario": "juanperez"
    }
  }
}
```

**💡 Copia el token de la respuesta**

### 4. Usar el Token para Acceder a Rutas Protegidas

```bash
# Reemplaza el token con el que recibiste
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXN1YXJpbyI6Imp1YW5wZXJleiIsImlhdCI6MTcwNDE2ODAwMCwiZXhwIjoxNzA0MjU0NDAwfQ.abc123" \
  -H "Content-Type: application/json"
```

**Respuesta esperada:**
```json
{
  "error": false,
  "status": 200,
  "body": {
    "id": 1,
    "nombre": "Juan Pérez",
    "usuario": "juanperez",
    "activo": 1
  }
}
```

---

## 🧪 Usuario de Prueba Pre-creado

Si quieres probar rápidamente sin registrarte, puedes usar el usuario de prueba:

```bash
# Crear usuario de prueba
npm run create-test-user
```

**Credenciales del usuario de prueba:**
```
Usuario: testuser
Password: test123456
```

Luego puedes hacer login directamente:

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "testuser",
    "password": "test123456"
  }'
```

---

## 🔐 Información del Token JWT

- **Expiración**: 24 horas
- **Algoritmo**: HMAC SHA256
- **Contenido**: ID del usuario y nombre de usuario
- **Formato**: `Bearer {token}` en el header Authorization

---

## 📱 Ejemplo con Postman

### 1. Registrar Usuario

1. Método: `POST`
2. URL: `http://localhost:4000/api/auth/register`
3. Headers:
   - `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "nombre": "Juan Pérez",
  "usuario": "juanperez",
  "password": "miPassword123"
}
```

### 2. Hacer Login

1. Método: `POST`
2. URL: `http://localhost:4000/api/auth/login`
3. Headers:
   - `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "usuario": "juanperez",
  "password": "miPassword123"
}
```

### 3. Guardar Token como Variable

En Postman, después del login:
1. Ve a Tests
2. Agrega:
```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.body.token);
```

### 4. Usar Token en Rutas Protegidas

1. Método: `GET`
2. URL: `http://localhost:4000/api/auth/me`
3. Headers:
   - `Authorization: Bearer {{token}}`
   - `Content-Type: application/json`

---

## 🛠️ Scripts Útiles

```bash
# Crear usuario de prueba
npm run create-test-user

# Probar lógica de autenticación completa
npm run test-auth
```

---

## ⚠️ Notas Importantes

1. **El token expira en 24 horas**: Si expira, debes hacer login nuevamente
2. **La contraseña se encripta**: Nunca se almacena en texto plano
3. **El usuario debe ser único**: No puedes registrar dos usuarios con el mismo nombre de usuario
4. **Mínimo 6 caracteres**: La contraseña debe tener al menos 6 caracteres

---

## 🐛 Troubleshooting

### Error: "Usuario no encontrado"
- Verifica que el usuario existe en la base de datos
- Asegúrate de haber hecho el registro primero

### Error: "Token no proporcionado"
- Verifica que estás enviando el header `Authorization: Bearer {token}`
- Asegúrate de que el token no tenga espacios extra

### Error: "Token inválido o expirado"
- El token expiró (24 horas)
- Haz login nuevamente para obtener un nuevo token

---

**Última actualización**: Enero 2026
