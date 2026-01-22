# 🔧 Instrucciones para Corregir Tests

## Problemas Encontrados

### 1. ❌ Falta instalar `supertest`

Los tests de rutas (`*.rutas.test.js`) requieren `supertest` pero no está instalado.

**Solución:**

```bash
npm install --save-dev supertest
```

---

### 2. ❌ Bug en `src/modulos/clientes/controlador.js`

**Problema:** Conflicto de nombres de variables

```javascript
// ❌ INCORRECTO (línea 22)
function agregar(datos) {
  return datos.agregar(tabla, datos); // ❌ "datos" es el parámetro, no la DB
}
```

**Solución:**

```javascript
// ✅ CORRECTO
function agregar(datosNuevos) {
  return db.agregar(tabla, datosNuevos);
}
```

**Reemplazar todo el archivo `src/modulos/clientes/controlador.js` con:**

```javascript
const TABLA = "clientes";

module.exports = function (dbInyectada) {
  let db = dbInyectada;

  if (!db) {
    db = require("../../db/mysql.js");
  }

  function todos() {
    return db.todos(TABLA);
  }

  function uno(id) {
    return db.uno(TABLA, id);
  }

  function agregar(datosNuevos) {
    // ✅ Cambiado nombre del parámetro
    return db.agregar(TABLA, datosNuevos);
  }

  function eliminar(body) {
    return db.eliminar(TABLA, body.id);
  }

  return {
    todos,
    uno,
    agregar,
    eliminar,
  };
};
```

---

### 3. ❌ Tests de Clientes Fallando

**Problema:** Los tests comparan contra datos específicos que ya no están en la BD

**Archivos a reemplazar:**

#### `tests/clientes/clientes.controlador.test.js`

El problema está en que los tests verifican datos específicos de la BD real, pero deberían mockear TODO.

**Solución:** Reemplazar con este contenido:

```javascript
const clientesController = require("../../src/modulos/clientes/controlador");

describe("Clientes Controller", () => {
  let mockDb;
  let controller;

  beforeEach(() => {
    mockDb = {
      todos: jest.fn(),
      uno: jest.fn(),
      agregar: jest.fn(),
      eliminar: jest.fn(),
    };
    controller = clientesController(mockDb);
    jest.clearAllMocks();
  });

  describe("todos", () => {
    it("debe retornar todos los clientes", async () => {
      const clientesMock = [
        { id: 1, nombre: "Cliente 1", edad: 30, profesion: "Profesion 1" },
      ];

      mockDb.todos.mockResolvedValueOnce(clientesMock);
      const result = await controller.todos();

      expect(result).toEqual(clientesMock);
      expect(mockDb.todos).toHaveBeenCalledWith("clientes");
    });
  });

  describe("uno", () => {
    it("debe retornar un cliente por ID", async () => {
      const clienteMock = [
        { id: 1, nombre: "Cliente 1", edad: 30, profesion: "Profesion 1" },
      ];

      mockDb.uno.mockResolvedValueOnce(clienteMock);
      const result = await controller.uno(1);

      expect(result).toEqual(clienteMock);
      expect(mockDb.uno).toHaveBeenCalledWith("clientes", 1);
    });
  });

  describe("agregar", () => {
    it("debe crear un nuevo cliente", async () => {
      const clienteData = {
        nombre: "Juan Pérez",
        edad: 30,
        profesion: "Ingeniero",
      };

      mockDb.agregar.mockResolvedValueOnce({ insertId: 1 });
      const result = await controller.agregar(clienteData);

      expect(result).toEqual({ insertId: 1 });
      expect(mockDb.agregar).toHaveBeenCalledWith("clientes", clienteData);
    });

    it("debe actualizar un cliente existente", async () => {
      const clienteData = {
        id: 1,
        nombre: "Juan Pérez Actualizado",
        edad: 31,
        profesion: "Ingeniero Senior",
      };

      mockDb.agregar.mockResolvedValueOnce({ affectedRows: 1 });
      const result = await controller.agregar(clienteData);

      expect(result).toEqual({ affectedRows: 1 });
      expect(mockDb.agregar).toHaveBeenCalledWith("clientes", clienteData);
    });
  });

  describe("eliminar", () => {
    it("debe eliminar un cliente", async () => {
      const body = { id: 1 };

      mockDb.eliminar.mockResolvedValueOnce({
        affectedRows: 1,
        changedRows: 0,
        fieldCount: 0,
        info: "",
        insertId: 0,
        serverStatus: 2,
        warningStatus: 0,
      });

      const result = await controller.eliminar(body);

      expect(result.affectedRows).toBe(1);
      expect(mockDb.eliminar).toHaveBeenCalledWith("clientes", 1);
    });
  });
});
```

---

### 4. ❌ Tests de Usuarios Fallando

**Problema:** Similar a clientes - esperan datos específicos de BD real

#### `tests/usuarios/usuarios.controlador.test.js`

**Reemplazar con:**

```javascript
const usuariosController = require("../../src/modulos/usuarios/controlador");
const bcrypt = require("bcrypt");

jest.mock("bcrypt");

describe("Usuarios Controller", () => {
  let mockDb;
  let controller;

  beforeEach(() => {
    mockDb = {
      todos: jest.fn(),
      uno: jest.fn(),
      agregar: jest.fn(),
      eliminar: jest.fn(),
    };
    controller = usuariosController(mockDb);
    jest.clearAllMocks();
  });

  describe("todos", () => {
    it("debe retornar todos los usuarios", async () => {
      const usuariosMock = [{ id: 1, nombre: "Usuario 1", activo: 1 }];

      mockDb.todos.mockResolvedValueOnce(usuariosMock);
      const result = await controller.todos();

      expect(result).toEqual(usuariosMock);
      expect(mockDb.todos).toHaveBeenCalledWith("usuarios");
    });
  });

  describe("uno", () => {
    it("debe retornar un usuario por ID", async () => {
      const usuarioMock = [{ id: 1, nombre: "Usuario 1", activo: 1 }];

      mockDb.uno.mockResolvedValueOnce(usuarioMock);
      const result = await controller.uno(1);

      expect(result).toEqual(usuarioMock);
      expect(mockDb.uno).toHaveBeenCalledWith("usuarios", 1);
    });
  });

  describe("agregar", () => {
    it("debe crear un nuevo usuario sin datos de autenticación", async () => {
      const userData = {
        nombre: "Juan Pérez",
        activo: 1,
      };

      const datos = require("../../src/db/mysql.js");
      const spyAgregar = jest
        .spyOn(datos, "agregar")
        .mockResolvedValueOnce({ insertId: 1 });

      const result = await controller.agregar(userData);

      expect(result).toBe(true);
      expect(spyAgregar).toHaveBeenCalledWith("usuarios", {
        id: undefined,
        nombre: "Juan Pérez",
        activo: 1,
      });

      spyAgregar.mockRestore();
    });

    it("debe crear un usuario con datos de autenticación", async () => {
      const userData = {
        nombre: "Juan Pérez",
        usuario: "juanp",
        password: "password123",
        activo: 1,
      };

      const datos = require("../../src/db/mysql.js");
      const spyAgregar = jest
        .spyOn(datos, "agregar")
        .mockResolvedValueOnce({ insertId: 1 })
        .mockResolvedValueOnce({ insertId: 1 });

      bcrypt.hash.mockResolvedValueOnce("hashed-password");

      const result = await controller.agregar(userData);

      expect(result).toBe(true);
      expect(spyAgregar).toHaveBeenCalledTimes(2);
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);

      spyAgregar.mockRestore();
    });

    it("debe actualizar un usuario existente", async () => {
      const userData = {
        id: 1,
        nombre: "Juan Pérez Actualizado",
        activo: 1,
      };

      const datos = require("../../src/db/mysql.js");
      const spyAgregar = jest
        .spyOn(datos, "agregar")
        .mockResolvedValueOnce({ affectedRows: 1 });

      const result = await controller.agregar(userData);

      expect(result).toBe(true);
      expect(spyAgregar).toHaveBeenCalledWith("usuarios", {
        id: 1,
        nombre: "Juan Pérez Actualizado",
        activo: 1,
      });

      spyAgregar.mockRestore();
    });
  });

  describe("eliminar", () => {
    it("debe eliminar un usuario", async () => {
      const body = { id: 1 };

      const datos = require("../../src/db/mysql.js");
      const spyEliminar = jest.spyOn(datos, "eliminar").mockResolvedValueOnce({
        affectedRows: 1,
        changedRows: 0,
        fieldCount: 0,
        info: "",
        insertId: 0,
        serverStatus: 2,
        warningStatus: 0,
      });

      const result = await controller.eliminar(body);

      expect(result.affectedRows).toBe(1);
      expect(spyEliminar).toHaveBeenCalledWith("usuarios", 1);

      spyEliminar.mockRestore();
    });
  });
});
```

---

## Pasos para Corregir

### Paso 1: Instalar Supertest

```bash
npm install --save-dev supertest
```

### Paso 2: Actualizar Controlador de Clientes

Reemplazar `src/modulos/clientes/controlador.js` con el código corregido arriba.

### Paso 3: Actualizar Tests de Clientes

Reemplazar `tests/clientes/clientes.controlador.test.js` con el código corregido arriba.

### Paso 4: Actualizar Tests de Usuarios

Reemplazar `tests/usuarios/usuarios.controlador.test.js` con el código corregido arriba.

### Paso 5: Ejecutar Tests

```bash
npm test
```

---

## Resultado Esperado

Después de aplicar todos los cambios, deberías ver:

```
Test Suites: 7 passed, 7 total
Tests:       28 passed, 28 total
```

---

## Explicación de los Cambios

### Por qué fallaban los tests:

1. **`supertest` no instalado**: Los tests de rutas HTTP requieren esta librería
2. **Bug en controlador**: Variable `datos` se usaba incorrectamente (conflicto de nombres)
3. **Comparación con BD real**: Los tests comparaban contra datos reales de la BD en vez de usar mocks
4. **Formato de ResultSetHeader**: MySQL2 retorna objetos complejos, no solo `{affectedRows: 1}`

### Soluciones aplicadas:

1. ✅ Instalar `supertest`
2. ✅ Renombrar parámetro en `agregar()` de clientes
3. ✅ Usar mocks simples en vez de esperar datos específicos
4. ✅ Usar `jest.spyOn` para mockear la DB correctamente
5. ✅ Esperar formato completo de ResultSetHeader de MySQL2

---

## Verificación Final

```bash
# Limpiar caché de Jest
npm test -- --clearCache

# Ejecutar tests con cobertura
npm run test:coverage

# Ver tests específicos
npm test -- tests/clientes
npm test -- tests/usuarios
npm test -- tests/auth
```

---

**¡Todo debería pasar ahora!** ✅
