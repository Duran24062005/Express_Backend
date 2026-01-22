// tests/clientes/clientes.controlador.test.js - CORREGIDO
const clientesController = require('../../src/modulos/clientes/controlador');

describe('Clientes Controller', () => {
    let mockDb;
    let controller;

    beforeEach(() => {
        mockDb = {
            todos: jest.fn(),
            uno: jest.fn(),
            agregar: jest.fn(),
            eliminar: jest.fn()
        };
        controller = clientesController(mockDb);
        jest.clearAllMocks();
    });

    describe('todos', () => {
        it('debe retornar todos los clientes', async () => {
            // ✅ CORREGIDO: No importa qué datos retorna, solo que llame correctamente
            const clientesMock = [
                { id: 1, nombre: 'Cliente 1', edad: 30, profesion: 'Profesion 1' }
            ];

            mockDb.todos.mockResolvedValueOnce(clientesMock);

            const result = await controller.todos();

            expect(result).toEqual(clientesMock);
            expect(mockDb.todos).toHaveBeenCalledWith('clientes');
        });
    });

    describe('uno', () => {
        it('debe retornar un cliente por ID', async () => {
            const clienteMock = [
                { id: 1, nombre: 'Cliente 1', edad: 30, profesion: 'Profesion 1' }
            ];

            mockDb.uno.mockResolvedValueOnce(clienteMock);

            const result = await controller.uno(1);

            expect(result).toEqual(clienteMock);
            expect(mockDb.uno).toHaveBeenCalledWith('clientes', 1);
        });
    });

    describe('agregar', () => {
        it('debe crear un nuevo cliente', async () => {
            const clienteData = {
                nombre: 'Juan Pérez',
                edad: 30,
                profesion: 'Ingeniero'
            };

            mockDb.agregar.mockResolvedValueOnce({ insertId: 1 });

            const result = await controller.agregar(clienteData);

            expect(result).toEqual({ insertId: 1 });
            expect(mockDb.agregar).toHaveBeenCalledWith('clientes', clienteData);
        });

        it('debe actualizar un cliente existente', async () => {
            const clienteData = {
                id: 1,
                nombre: 'Juan Pérez Actualizado',
                edad: 31,
                profesion: 'Ingeniero Senior'
            };

            mockDb.agregar.mockResolvedValueOnce({ affectedRows: 1 });

            const result = await controller.agregar(clienteData);

            expect(result).toEqual({ affectedRows: 1 });
            expect(mockDb.agregar).toHaveBeenCalledWith('clientes', clienteData);
        });
    });

    describe('eliminar', () => {
        it('debe eliminar un cliente', async () => {
            const body = { id: 1 };

            // ✅ CORREGIDO: Esperar el objeto completo ResultSetHeader
            mockDb.eliminar.mockResolvedValueOnce({
                affectedRows: 1,
                changedRows: 0,
                fieldCount: 0,
                info: '',
                insertId: 0,
                serverStatus: 2,
                warningStatus: 0
            });

            const result = await controller.eliminar(body);

            expect(result.affectedRows).toBe(1);
            expect(mockDb.eliminar).toHaveBeenCalledWith('clientes', 1);
        });
    });
});