# Documentación de Bugs Corregidos

Este documento detalla todos los bugs encontrados y corregidos en el proyecto, incluyendo la descripción del problema, el código antes y después, y la explicación de la solución.

---

## Bug #1: Falta `await` en `usuarios/controlador.js`

### Archivo
`src/modulos/usuarios/controlador.js`

### Línea
30

### Descripción del Problema
La función `agregar()` en el controlador de usuarios llamaba a `datos.agregar()` sin usar `await`, lo que causaba que `respuesta.insertId` fuera `undefined`. Esto impedía que se creara correctamente el registro de autenticación asociado al usuario.

### Impacto
- Los usuarios no se podían crear correctamente con datos de autenticación
- El `insertId` no estaba disponible cuando se intentaba crear el registro en la tabla `auth`
- Errores silenciosos que no se manejaban correctamente

### Código Antes
```javascript
async function agregar(data) {
    const usuario = {
        id: data.id,
        nombre: data.nombre,
        activo: data.activo
    }
    const respuesta = datos.agregar(tabla, usuario);  // ❌ Falta await
    var insertId = 0;

    if (data.id == 0) {
        insertId = respuesta.insertId;  // ❌ respuesta es una Promise, no un objeto
    } else {
        insertId = data.id;
    }
    // ...
}
```

### Código Después
```javascript
async function agregar(data) {
    const usuario = {
        id: data.id,
        nombre: data.nombre,
        activo: data.activo
    }
    const respuesta = await datos.agregar(tabla, usuario);  // ✅ Agregado await
    var insertId = 0;

    if (data.id == 0 || !data.id) {  // ✅ Mejorada la validación
        insertId = respuesta.insertId;  // ✅ Ahora respuesta es un objeto con insertId
    } else {
        insertId = data.id;
    }
    // ...
}
```

### Solución Implementada
1. Se agregó `await` antes de `datos.agregar()` para esperar la resolución de la Promise
2. Se mejoró la validación para incluir el caso cuando `data.id` es `undefined`
3. Se corrigió la lógica de creación de datos de autenticación para usar directamente `db.agregar()` en lugar de una función inexistente `auth.agregar()`

---

## Bug #2: `express.json()` duplicado

### Archivo
`src/app.js`

### Líneas
18 y 25

### Descripción del Problema
El middleware `express.json()` estaba siendo registrado dos veces en la aplicación Express, lo cual es innecesario y puede causar problemas de rendimiento.

### Impacto
- Procesamiento duplicado de requests JSON
- Pequeño impacto en rendimiento
- Código redundante

### Código Antes
```javascript
// Middleware
app.use(morgan('dev'));
app.use(express.json());  // ✅ Primera vez
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));

app.use(express.json())  // ❌ Duplicado
app.set('port', config.app.port);
```

### Código Después
```javascript
// Middleware
app.use(morgan('dev'));
app.use(express.json());  // ✅ Solo una vez
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));

app.set('port', config.app.port);  // ✅ Eliminada la línea duplicada
```

### Solución Implementada
Se eliminó la segunda llamada a `app.use(express.json())` en la línea 25, manteniendo solo la primera instancia.

---

## Bug #3: Mensajes incorrectos en `clientes/rutas.js`

### Archivo
`src/modulos/clientes/rutas.js`

### Líneas
37-40

### Descripción del Problema
La función `agregar()` mostraba el mensaje "Item eliminado correctamente" tanto para crear como para actualizar un cliente, cuando debería mostrar mensajes diferentes según la operación.

### Impacto
- Mensajes confusos para el usuario
- Información incorrecta en las respuestas de la API
- Mala experiencia de usuario

### Código Antes
```javascript
async function agregar(req, res, next) {
    try {
        let message = '';
        const item = await controlador.agregar(req.body);
        if (req.body.id == 0) {
            message = 'Item eliminado correctamente';  // ❌ Mensaje incorrecto
        } else {
            message = 'Item eliminado correctamente';  // ❌ Mensaje incorrecto
        }
        respuesta.success(req, res, message, 201);
    } catch (error) {
        next(error);
    }
};
```

### Código Después
```javascript
async function agregar(req, res, next) {
    try {
        let message = '';
        const item = await controlador.agregar(req.body);
        if (req.body.id == 0 || !req.body.id) {
            message = 'Item creado correctamente';  // ✅ Mensaje correcto
        } else {
            message = 'Item actualizado correctamente';  // ✅ Mensaje correcto
        }
        respuesta.success(req, res, message, 201);
    } catch (error) {
        next(error);
    }
};
```

### Solución Implementada
1. Se corrigieron los mensajes para reflejar la operación real (crear vs actualizar)
2. Se mejoró la validación para incluir el caso cuando `req.body.id` es `undefined`

---

## Bug #4: Lógica incorrecta en `usuarios/rutas.js`

### Archivo
`src/modulos/usuarios/rutas.js`

### Líneas
37-40

### Descripción del Problema
La función `agregar()` verificaba `item.error`, pero el controlador retorna `true` cuando es exitoso, no un objeto con una propiedad `error`. Esto causaba que siempre se mostrara el mensaje genérico incorrecto.

### Impacto
- Mensajes incorrectos en las respuestas
- Lógica de validación rota
- Confusión sobre el estado real de la operación

### Código Antes
```javascript
async function agregar(req, res, next) {
    try {
        let message = '';
        const item = await controlador.agregar(req.body);
        if (item.error) {  // ❌ item es true, no tiene propiedad error
            message = 'No se puedo crear el usuario';
        } else {
            message = 'Item creado correctamente';
        }
        respuesta.success(req, res, message, 201);
    } catch (error) {
        next(error);
    }
};
```

### Código Después
```javascript
async function agregar(req, res, next) {
    try {
        let message = '';
        const item = await controlador.agregar(req.body);
        if (req.body.id == 0 || !req.body.id) {  // ✅ Validación correcta
            message = 'Usuario creado correctamente';
        } else {
            message = 'Usuario actualizado correctamente';  // ✅ Mensaje diferenciado
        }
        respuesta.success(req, res, message, 201);
    } catch (error) {
        next(error);
    }
};
```

### Solución Implementada
1. Se cambió la lógica para verificar `req.body.id` en lugar de `item.error`
2. Se agregaron mensajes diferenciados para crear y actualizar
3. Se mejoró la validación para incluir el caso cuando `req.body.id` es `undefined`

---

## Bug #5: Tabla `auth` sin PRIMARY KEY y FOREIGN KEY

### Archivo
`database.sql`

### Líneas
19-23

### Descripción del Problema
La tabla `auth` no tenía definida una PRIMARY KEY ni una FOREIGN KEY hacia la tabla `usuarios`. Además, el campo `password` tenía un tamaño insuficiente (VARCHAR(50)) para almacenar hashes de bcrypt (que requieren 60 caracteres).

### Impacto
- Falta de integridad referencial
- Posibilidad de duplicados en la tabla `auth`
- Errores al intentar almacenar passwords hasheados
- Problemas de consistencia de datos

### Código Antes
```sql
CREATE TABLE IF NOT EXISTS auth (
    id INT(10),  -- ❌ Sin PRIMARY KEY
    usuario VARCHAR(20),  -- ❌ Sin UNIQUE
    password VARCHAR(50)  -- ❌ Tamaño insuficiente para bcrypt
);
```

### Código Después
```sql
CREATE TABLE IF NOT EXISTS auth (
    id INT PRIMARY KEY,  -- ✅ PRIMARY KEY agregado
    usuario VARCHAR(20) UNIQUE NOT NULL,  -- ✅ UNIQUE y NOT NULL
    password VARCHAR(255) NOT NULL,  -- ✅ Tamaño suficiente y NOT NULL
    FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE  -- ✅ FOREIGN KEY con CASCADE
);
```

### Solución Implementada
1. Se agregó `PRIMARY KEY` al campo `id`
2. Se agregó `UNIQUE NOT NULL` al campo `usuario`
3. Se aumentó el tamaño de `password` a `VARCHAR(255)` para soportar hashes de bcrypt
4. Se agregó `NOT NULL` al campo `password`
5. Se agregó `FOREIGN KEY` con `ON DELETE CASCADE` para mantener la integridad referencial

---

## Bug #6: Manejo de errores asíncronos en rutas

### Archivos
`src/modulos/usuarios/rutas.js` y `src/modulos/clientes/rutas.js`

### Líneas
14-19 (usuarios) y 14-19 (clientes)

### Descripción del Problema
Las funciones `todos()` en ambos módulos no manejaban correctamente los errores asíncronos. Usaban `.then()` sin `.catch()`, lo que causaba que los errores no se propagaran correctamente al middleware de manejo de errores.

### Impacto
- Errores no manejados correctamente
- Posibles crashes de la aplicación
- Respuestas HTTP incorrectas en caso de error

### Código Antes
```javascript
async function todos(req, res) {
    const todos = controlador.todos().then((items) => {
        respuesta.success(req, res, items, 200);
    });  // ❌ Sin manejo de errores
};
```

### Código Después
```javascript
async function todos(req, res, next) {
    try {
        const items = await controlador.todos();  // ✅ Uso de await
        respuesta.success(req, res, items, 200);
    } catch (error) {
        next(error);  // ✅ Manejo correcto de errores
    }
};
```

### Solución Implementada
1. Se cambió de `.then()` a `await` para mejor manejo de errores
2. Se agregó `try-catch` para capturar errores
3. Se agregó el parámetro `next` para pasar errores al middleware de manejo de errores
4. Se aplicó la misma corrección en ambos módulos (usuarios y clientes)

---

## Resumen de Impacto

### Bugs Críticos (Alta Prioridad)
- **Bug #1**: Impedía la creación correcta de usuarios con autenticación
- **Bug #5**: Problemas de integridad de datos y almacenamiento de passwords

### Bugs de Funcionalidad (Media Prioridad)
- **Bug #3**: Mensajes incorrectos en respuestas de API
- **Bug #4**: Lógica rota en validación de operaciones

### Bugs Menores (Baja Prioridad)
- **Bug #2**: Redundancia en código (sin impacto funcional directo)
- **Bug #6**: Mejora en manejo de errores (prevención de problemas futuros)

---

## Notas Adicionales

- Todos los bugs fueron corregidos manteniendo la compatibilidad con el código existente
- Se mejoraron las validaciones en varios lugares para prevenir errores similares
- Los cambios fueron probados para asegurar que no rompieran funcionalidad existente

---

**Fecha de corrección**: Enero 2026  
**Versión**: 1.0.1
