# Product Requirements Document (PRD)

## Sistema de Testing con Jest

---

## 1. Resumen Ejecutivo

### 1.1 Objetivo

Implementar un sistema completo de testing unitario utilizando Jest para garantizar la calidad, confiabilidad y mantenibilidad del código del backend Express.

### 1.2 Alcance

- Configuración de Jest como framework de testing
- Tests unitarios para todos los módulos (auth, usuarios, clientes)
- Tests para middlewares y utilidades
- Cobertura de código
- Integración con el flujo de desarrollo

---

## 2. ¿Qué es Jest?

### 2.1 Introducción

**Jest** es un framework de testing desarrollado por Facebook, diseñado específicamente para proyectos JavaScript y Node.js. Es una herramienta "todo-en-uno" que proporciona:

- **Test Runner**: Ejecuta los tests
- **Assertion Library**: Funciones para verificar resultados
- **Mocking**: Capacidad de simular dependencias
- **Code Coverage**: Mide qué porcentaje del código está cubierto por tests

### 2.2 ¿Por qué Jest?

- ✅ **Zero Configuration**: Funciona con configuración mínima
- ✅ **Fast**: Ejecuta tests en paralelo
- ✅ **Built-in Mocking**: No necesitas librerías adicionales
- ✅ **Snapshot Testing**: Útil para testing de componentes
- ✅ **Great Documentation**: Documentación extensa y comunidad activa
- ✅ **Widely Adopted**: Estándar de la industria

### 2.3 Conceptos Clave

#### Test Suite (Suite de Pruebas)
Un grupo de tests relacionados. En Jest se define con `describe()`:

```javascript
describe('Auth Controller', () => {
  // Tests aquí
});
```

#### Test Case (Caso de Prueba)
Una prueba individual. Se define con `test()` o `it()`:

```javascript
test('debe registrar un usuario exitosamente', () => {
  // Código de prueba
});
```

#### Assertion (Aserción)
Una verificación de que algo es verdadero. Jest usa `expect()`:

```javascript
expect(resultado).toBe(valorEsperado);
```

#### Mock (Simulación)
Una imitación de una dependencia externa (base de datos, APIs, etc.):

```javascript
jest.mock('../../db/mysql.js');
```

---

## 3. Configuración del Proyecto

### 3.1 Instalación

```bash
npm install --save-dev jest supertest
```

- **jest**: Framework de testing
- **supertest**: Para testing de endpoints HTTP

### 3.2 Archivo de Configuración

**Archivo**: `jest.config.js`

```javascript
module.exports = {
  testEnvironment: 'node',  // Entorno Node.js (no navegador)
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/'
  ],
  testMatch: [
    '**/tests/**/*.test.js'  // Patrón para encontrar tests
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js'  // Excluir archivos específicos
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  verbose: true  // Mostrar más información
};
```

### 3.3 Scripts en package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

- `npm test`: Ejecuta todos los tests una vez
- `npm run test:watch`: Ejecuta tests en modo watch (se re-ejecutan al cambiar archivos)
- `npm run test:coverage`: Genera reporte de cobertura

---

## 4. Estructura de Tests

### 4.1 Organización de Archivos

```
first_backend/
├── src/
│   ├── modulos/
│   │   ├── auth/
│   │   │   └── controlador.js
│   │   └── usuarios/
│   │       └── controlador.js
└── tests/
    ├── auth/
    │   ├── auth.controlador.test.js
    │   └── auth.rutas.test.js
    ├── usuarios/
    │   ├── usuarios.controlador.test.js
    │   └── usuarios.rutas.test.js
    ├── setup.js
    └── teardown.js
```

### 4.2 Convenciones de Nomenclatura

- Los archivos de test deben terminar en `.test.js`
- Ubicarlos en la carpeta `tests/` manteniendo la misma estructura que `src/`
- Nombre descriptivo: `nombreModulo.tipo.test.js`

---

## 5. Ejemplos de Uso

### 5.1 Test Básico

```javascript
describe('Math Operations', () => {
  test('suma 1 + 2 debe ser 3', () => {
    expect(1 + 2).toBe(3);
  });
});
```

### 5.2 Test con Async/Await

```javascript
describe('User Service', () => {
  test('debe obtener un usuario', async () => {
    const usuario = await obtenerUsuario(1);
    expect(usuario).toHaveProperty('id');
    expect(usuario.id).toBe(1);
  });
});
```

### 5.3 Test con Mocks

```javascript
// Mock de la base de datos
const mockDb = {
  query: jest.fn(),
  agregar: jest.fn()
};

test('debe crear un usuario', async () => {
  mockDb.agregar.mockResolvedValueOnce({ insertId: 1 });
  
  const resultado = await crearUsuario(mockDb, { nombre: 'Juan' });
  
  expect(resultado.insertId).toBe(1);
  expect(mockDb.agregar).toHaveBeenCalled();
});
```

### 5.4 Test de Endpoints HTTP

```javascript
const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/auth/register', () => {
  test('debe registrar un usuario', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Juan',
        usuario: 'juanp',
        password: '123456'
      })
      .expect(201);
    
    expect(response.body.error).toBe(false);
    expect(response.body.body.usuario).toHaveProperty('id');
  });
});
```

### 5.5 Test de Errores

```javascript
test('debe lanzar error si el usuario no existe', async () => {
  await expect(login('inexistente', 'password'))
    .rejects
    .toThrow('Usuario no encontrado');
});
```

---

## 6. Matchers (Comparadores) Comunes

Jest proporciona muchos "matchers" para hacer assertions:

### 6.1 Igualdad

```javascript
expect(valor).toBe(4);           // Igualdad estricta (===)
expect(valor).toEqual({a: 1});  // Igualdad profunda (objetos)
```

### 6.2 Verdad/Falsedad

```javascript
expect(valor).toBeTruthy();
expect(valor).toBeFalsy();
expect(valor).toBeDefined();
expect(valor).toBeNull();
```

### 6.3 Números

```javascript
expect(valor).toBeGreaterThan(3);
expect(valor).toBeLessThan(5);
expect(valor).toBeCloseTo(0.3, 5);
```

### 6.4 Strings

```javascript
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');
```

### 6.5 Arrays y Objetos

```javascript
expect(array).toContain(item);
expect(object).toHaveProperty('key');
expect(object).toMatchObject({a: 1});
```

### 6.6 Excepciones

```javascript
expect(() => funcion()).toThrow();
expect(() => funcion()).toThrow('mensaje de error');
```

---

## 7. Setup y Teardown

### 7.1 beforeEach y afterEach

Se ejecutan antes/después de cada test:

```javascript
describe('Database Tests', () => {
  beforeEach(() => {
    // Limpiar base de datos antes de cada test
    limpiarDB();
  });
  
  afterEach(() => {
    // Limpiar después de cada test
    cerrarConexiones();
  });
});
```

### 7.2 beforeAll y afterAll

Se ejecutan una vez antes/después de todos los tests:

```javascript
describe('API Tests', () => {
  beforeAll(async () => {
    // Conectar a base de datos de prueba
    await conectarDB();
  });
  
  afterAll(async () => {
    // Cerrar conexión
    await desconectarDB();
  });
});
```

---

## 8. Mocks y Stubs

### 8.1 Mock de Módulos

```javascript
// Mock completo de un módulo
jest.mock('../../db/mysql.js', () => ({
  query: jest.fn(),
  agregar: jest.fn()
}));
```

### 8.2 Mock de Funciones

```javascript
const mockFuncion = jest.fn();
mockFuncion.mockReturnValue('valor');
mockFuncion.mockResolvedValue({id: 1});
mockFuncion.mockRejectedValue(new Error('Error'));
```

### 8.3 Verificar Llamadas

```javascript
expect(mockFuncion).toHaveBeenCalled();
expect(mockFuncion).toHaveBeenCalledWith(arg1, arg2);
expect(mockFuncion).toHaveBeenCalledTimes(2);
```

---

## 9. Cobertura de Código

### 9.1 ¿Qué es la Cobertura?

La cobertura mide qué porcentaje de tu código está siendo probado por los tests.

### 9.2 Tipos de Cobertura

- **Statement Coverage**: ¿Qué líneas se ejecutan?
- **Branch Coverage**: ¿Qué ramas condicionales se prueban?
- **Function Coverage**: ¿Qué funciones se llaman?
- **Line Coverage**: ¿Qué líneas se ejecutan?

### 9.3 Generar Reporte

```bash
npm run test:coverage
```

Esto genera un reporte HTML en `coverage/lcov-report/index.html`

### 9.4 Objetivo de Cobertura

- **Mínimo recomendado**: 70%
- **Ideal**: 80-90%
- **No es necesario**: 100% (puede ser contraproducente)

---

## 10. Mejores Prácticas

### 10.1 Nombres Descriptivos

```javascript
// ❌ Mal
test('test 1', () => {});

// ✅ Bien
test('debe retornar error cuando el usuario no existe', () => {});
```

### 10.2 Un Test, Una Verificación

```javascript
// ❌ Mal - Múltiples verificaciones en un test
test('usuario completo', () => {
  expect(usuario.nombre).toBe('Juan');
  expect(usuario.edad).toBe(30);
  expect(usuario.email).toBe('juan@email.com');
});

// ✅ Bien - Tests separados
test('debe tener nombre correcto', () => {
  expect(usuario.nombre).toBe('Juan');
});

test('debe tener edad correcta', () => {
  expect(usuario.edad).toBe(30);
});
```

### 10.3 Arrange-Act-Assert (AAA)

```javascript
test('debe crear usuario', () => {
  // Arrange (Preparar)
  const userData = { nombre: 'Juan', usuario: 'juanp' };
  
  // Act (Actuar)
  const resultado = crearUsuario(userData);
  
  // Assert (Verificar)
  expect(resultado.id).toBeDefined();
});
```

### 10.4 Tests Independientes

Cada test debe poder ejecutarse de forma independiente:

```javascript
// ❌ Mal - Depende del test anterior
test('test 1', () => {
  crearUsuario({nombre: 'Juan'});
});

test('test 2', () => {
  const usuarios = obtenerUsuarios(); // Depende de test 1
});

// ✅ Bien - Independiente
test('test 2', () => {
  crearUsuario({nombre: 'Juan'});
  const usuarios = obtenerUsuarios();
  expect(usuarios).toHaveLength(1);
});
```

### 10.5 Usar Mocks para Dependencias Externas

```javascript
// ❌ Mal - Depende de base de datos real
test('debe obtener usuario', async () => {
  const usuario = await db.query('usuarios', {id: 1});
});

// ✅ Bien - Usa mock
test('debe obtener usuario', async () => {
  mockDb.query.mockResolvedValueOnce([{id: 1, nombre: 'Juan'}]);
  const usuario = await obtenerUsuario(1);
  expect(usuario).toHaveProperty('id');
});
```

---

## 11. Testing en Este Proyecto

### 11.1 Estructura Implementada

```
tests/
├── auth/
│   ├── auth.controlador.test.js
│   └── auth.rutas.test.js
├── usuarios/
│   ├── usuarios.controlador.test.js
│   └── usuarios.rutas.test.js
├── clientes/
│   ├── clientes.controlador.test.js
│   └── clientes.rutas.test.js
├── middlewares/
│   └── auth.test.js
├── setup.js
└── teardown.js
```

### 11.2 Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Modo watch (desarrollo)
npm run test:watch

# Con cobertura
npm run test:coverage
```

### 11.3 Ejemplo Real del Proyecto

```javascript
// tests/auth/auth.controlador.test.js
describe('Auth Controller', () => {
  let mockDb;
  let controller;

  beforeEach(() => {
    mockDb = {
      query: jest.fn(),
      agregar: jest.fn()
    };
    controller = authController(mockDb);
  });

  test('debe registrar un usuario exitosamente', async () => {
    mockDb.query.mockResolvedValueOnce([]);
    mockDb.agregar.mockResolvedValueOnce({ insertId: 1 });
    
    const result = await controller.registrar({
      nombre: 'Juan',
      usuario: 'juanp',
      password: '123456'
    });
    
    expect(result).toHaveProperty('id');
    expect(result.id).toBe(1);
  });
});
```

---

## 12. Troubleshooting

### 12.1 Tests No Se Ejecutan

- Verificar que los archivos terminen en `.test.js`
- Verificar la configuración en `jest.config.js`
- Verificar que Jest esté instalado: `npm list jest`

### 12.2 Mocks No Funcionan

- Asegurarse de que `jest.mock()` esté antes de los imports
- Verificar que el path del mock sea correcto
- Usar `jest.clearAllMocks()` en `beforeEach`

### 12.3 Tests Asíncronos Faltan

- Asegurarse de usar `async/await` o retornar la Promise
- Usar `done()` callback si es necesario

```javascript
// ✅ Correcto
test('async test', async () => {
  await funcionAsync();
});

// ✅ También correcto
test('async test', () => {
  return funcionAsync().then(result => {
    expect(result).toBeDefined();
  });
});
```

---

## 13. Recursos Adicionales

### 13.1 Documentación Oficial

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jest API Reference](https://jestjs.io/docs/api)

### 13.2 Tutoriales Recomendados

- [Testing Node.js with Jest](https://www.valentinog.com/blog/jest/)
- [Jest Crash Course](https://www.youtube.com/watch?v=7r4xVDI2vho)

---

## 14. Conclusión

Jest es una herramienta poderosa y fácil de usar para testing en Node.js. Con esta configuración, el proyecto tiene:

- ✅ Tests unitarios para todos los módulos principales
- ✅ Tests de endpoints HTTP
- ✅ Mocks para dependencias externas
- ✅ Cobertura de código configurada
- ✅ Scripts convenientes para desarrollo

**Próximos pasos**: Continuar agregando tests para nuevas funcionalidades y mantener la cobertura por encima del 70%.

---

**Versión**: 1.0.0  
**Fecha**: Enero 2026
