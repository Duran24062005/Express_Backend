const request = require('supertest');
const express = require('express');
const usuariosRoutes = require('../../src/modulos/usuarios/rutas');
const usuariosController = require('../../src/modulos/usuarios/index');

// Mock del controlador
jest.mock('../../src/modulos/usuarios/index', () => ({
    todos: jest.fn(),
    uno: jest.fn(),
    agregar: jest.fn(),
    eliminar: jest.fn()
}));

describe('Usuarios Routes', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/usuarios', usuariosRoutes);
        jest.clearAllMocks();
    });

    describe('GET /api/usuarios', () => {
        it('debe retornar todos los usuarios', async () => {
            const usuariosMock = [
                { id: 1, nombre: 'Juan Pérez', usuario: 'juanp', activo: 1 },
                { id: 2, nombre: 'María López', usuario: 'marial', activo: 1 }
            ];

            usuariosController.todos.mockResolvedValueOnce(usuariosMock);

            const response = await request(app)
                .get('/api/usuarios')
                .expect(200);

            expect(response.body).toMatchObject({
                error: false,
                status: 200,
                body: usuariosMock
            });
        });

        it('debe manejar errores correctamente', async () => {
            usuariosController.todos.mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .get('/api/usuarios')
                .expect(500);

            expect(response.body.error).toBe(true);
        });
    });

    describe('GET /api/usuarios/:id', () => {
        it('debe retornar un usuario por ID', async () => {
            const usuarioMock = [{ id: 1, nombre: 'Juan Pérez', usuario: 'juanp', activo: 1 }];

            usuariosController.uno.mockResolvedValueOnce(usuarioMock);

            const response = await request(app)
                .get('/api/usuarios/1')
                .expect(200);

            expect(response.body).toMatchObject({
                error: false,
                status: 200,
                body: usuarioMock
            });
        });

        it('debe manejar errores correctamente', async () => {
            usuariosController.uno.mockRejectedValueOnce(new Error('Usuario no encontrado'));

            const response = await request(app)
                .get('/api/usuarios/999')
                .expect(500);

            expect(response.body.error).toBe(true);
        });
    });

    describe('POST /api/usuarios', () => {
        it('debe crear un nuevo usuario', async () => {
            const userData = {
                nombre: 'Juan Pérez',
                activo: 1
            };

            usuariosController.agregar.mockResolvedValueOnce(true);

            const response = await request(app)
                .post('/api/usuarios')
                .send(userData)
                .expect(201);

            expect(response.body).toMatchObject({
                error: false,
                status: 201,
                body: 'Usuario creado correctamente'
            });
        });

        it('debe actualizar un usuario existente', async () => {
            const userData = {
                id: 1,
                nombre: 'Juan Pérez Actualizado',
                activo: 1
            };

            usuariosController.agregar.mockResolvedValueOnce(true);

            const response = await request(app)
                .post('/api/usuarios')
                .send(userData)
                .expect(201);

            expect(response.body).toMatchObject({
                error: false,
                status: 201,
                body: 'Usuario actualizado correctamente'
            });
        });
    });

    describe('PUT /api/usuarios', () => {
        it('debe eliminar un usuario', async () => {
            const body = { id: 1 };

            usuariosController.eliminar.mockResolvedValueOnce({ affectedRows: 1 });

            const response = await request(app)
                .put('/api/usuarios')
                .send(body)
                .expect(200);

            expect(response.body).toMatchObject({
                error: false,
                status: 200,
                body: 'Item eliminado correctamente'
            });
        });
    });
});
