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
            const clientesMock = [
                { id: 1, nombre: 'Juan Pérez', edad: 30, profesion: 'Ingeniero' },
                { id: 2, nombre: 'María López', edad: 25, profesion: 'Diseñadora' }
            ];

            mockDb.todos.mockResolvedValueOnce(clientesMock);

            const result = await controller.todos();

            expect(result).toEqual(clientesMock);
            expect(mockDb.todos).toHaveBeenCalledWith('clientes');
        });
    });

    describe('uno', () => {
        it('debe retornar un cliente por ID', async () => {
            const clienteMock = [{ id: 1, nombre: 'Juan Pérez', edad: 30, profesion: 'Ingeniero' }];

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

            mockDb.eliminar.mockResolvedValueOnce({ affectedRows: 1 });

            const result = await controller.eliminar(body);

            expect(result).toEqual({ affectedRows: 1 });
            expect(mockDb.eliminar).toHaveBeenCalledWith('clientes', 1);
        });
    });
});
