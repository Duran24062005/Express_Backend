const request = require('supertest');
const express = require('express');
const clientesRoutes = require('../../src/modulos/clientes/rutas');
const clientesController = require('../../src/modulos/clientes/index');

// Mock del controlador
jest.mock('../../src/modulos/clientes/index', () => ({
    todos: jest.fn(),
    uno: jest.fn(),
    agregar: jest.fn(),
    eliminar: jest.fn()
}));

describe('Clientes Routes', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/clientes', clientesRoutes);
        jest.clearAllMocks();
    });

    describe('GET /api/clientes', () => {
        it('debe retornar todos los clientes', async () => {
            const clientesMock = [
                { id: 1, nombre: 'Juan Pérez', edad: 30, profesion: 'Ingeniero' },
                { id: 2, nombre: 'María López', edad: 25, profesion: 'Diseñadora' }
            ];

            clientesController.todos.mockResolvedValueOnce(clientesMock);

            const response = await request(app)
                .get('/api/clientes')
                .expect(200);

            expect(response.body).toMatchObject({
                error: false,
                status: 200,
                body: clientesMock
            });
        });

        it('debe manejar errores correctamente', async () => {
            clientesController.todos.mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .get('/api/clientes')
                .expect(500);

            expect(response.body.error).toBe(true);
        });
    });

    describe('GET /api/clientes/:id', () => {
        it('debe retornar un cliente por ID', async () => {
            const clienteMock = [{ id: 1, nombre: 'Juan Pérez', edad: 30, profesion: 'Ingeniero' }];

            clientesController.uno.mockResolvedValueOnce(clienteMock);

            const response = await request(app)
                .get('/api/clientes/1')
                .expect(200);

            expect(response.body).toMatchObject({
                error: false,
                status: 200,
                body: clienteMock
            });
        });

        it('debe manejar errores correctamente', async () => {
            clientesController.uno.mockRejectedValueOnce(new Error('Cliente no encontrado'));

            const response = await request(app)
                .get('/api/clientes/999')
                .expect(500);

            expect(response.body.error).toBe(true);
        });
    });

    describe('POST /api/clientes', () => {
        it('debe crear un nuevo cliente', async () => {
            const clienteData = {
                nombre: 'Juan Pérez',
                edad: 30,
                profesion: 'Ingeniero'
            };

            clientesController.agregar.mockResolvedValueOnce({ insertId: 1 });

            const response = await request(app)
                .post('/api/clientes')
                .send(clienteData)
                .expect(201);

            expect(response.body).toMatchObject({
                error: false,
                status: 201,
                body: 'Item creado correctamente'
            });
        });

        it('debe actualizar un cliente existente', async () => {
            const clienteData = {
                id: 1,
                nombre: 'Juan Pérez Actualizado',
                edad: 31,
                profesion: 'Ingeniero Senior'
            };

            clientesController.agregar.mockResolvedValueOnce({ affectedRows: 1 });

            const response = await request(app)
                .post('/api/clientes')
                .send(clienteData)
                .expect(201);

            expect(response.body).toMatchObject({
                error: false,
                status: 201,
                body: 'Item actualizado correctamente'
            });
        });
    });

    describe('PUT /api/clientes', () => {
        it('debe eliminar un cliente', async () => {
            const body = { id: 1 };

            clientesController.eliminar.mockResolvedValueOnce({ affectedRows: 1 });

            const response = await request(app)
                .put('/api/clientes')
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
