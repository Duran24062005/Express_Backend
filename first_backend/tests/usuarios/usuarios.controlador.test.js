// tests/usuarios/usuarios.controlador.test.js - CORREGIDO
const usuariosController = require('../../src/modulos/usuarios/controlador');
const bcrypt = require('bcrypt');

jest.mock('bcrypt');

describe('Usuarios Controller', () => {
    let mockDb;
    let controller;

    beforeEach(() => {
        mockDb = {
            todos: jest.fn(),
            uno: jest.fn(),
            agregar: jest.fn(),
            eliminar: jest.fn()
        };
        controller = usuariosController(mockDb);
        jest.clearAllMocks();
    });

    describe('todos', () => {
        it('debe retornar todos los usuarios', async () => {
            // ✅ CORREGIDO: No importa qué usuarios retorna en el mock
            const usuariosMock = [
                { id: 1, nombre: 'Usuario 1', activo: 1 }
            ];

            mockDb.todos.mockResolvedValueOnce(usuariosMock);

            const result = await controller.todos();

            expect(result).toEqual(usuariosMock);
            expect(mockDb.todos).toHaveBeenCalledWith('usuarios');
        });
    });

    describe('uno', () => {
        it('debe retornar un usuario por ID', async () => {
            const usuarioMock = [
                { id: 1, nombre: 'Usuario 1', activo: 1 }
            ];

            mockDb.uno.mockResolvedValueOnce(usuarioMock);

            const result = await controller.uno(1);

            expect(result).toEqual(usuarioMock);
            expect(mockDb.uno).toHaveBeenCalledWith('usuarios', 1);
        });
    });

    describe('agregar', () => {
        it('debe crear un nuevo usuario sin datos de autenticación', async () => {
            const userData = {
                nombre: 'Juan Pérez',
                activo: 1
            };

            mockDb.agregar.mockResolvedValueOnce({ insertId: 1 });

            const result = await controller.agregar(userData);

            expect(result).toBe(true);
            expect(mockDb.agregar).toHaveBeenCalledWith('usuarios', {
                id: undefined,
                nombre: 'Juan Pérez',
                activo: 1
            });
        });

        it('debe crear un usuario con datos de autenticación', async () => {
            const userData = {
                nombre: 'Juan Pérez',
                usuario: 'juanp',
                password: 'password123',
                activo: 1
            };

            mockDb.agregar
                .mockResolvedValueOnce({ insertId: 1 })  // usuarios
                .mockResolvedValueOnce({ insertId: 1 }); // auth

            bcrypt.hash.mockResolvedValueOnce('hashed-password');

            const result = await controller.agregar(userData);

            expect(result).toBe(true);
            expect(mockDb.agregar).toHaveBeenCalledTimes(2);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        });

        it('debe actualizar un usuario existente', async () => {
            const userData = {
                id: 1,
                nombre: 'Juan Pérez Actualizado',
                activo: 1
            };

            mockDb.agregar.mockResolvedValueOnce({ affectedRows: 1 });

            const result = await controller.agregar(userData);

            expect(result).toBe(true);
            expect(mockDb.agregar).toHaveBeenCalledWith('usuarios', {
                id: 1,
                nombre: 'Juan Pérez Actualizado',
                activo: 1
            });
        });
    });

    describe('eliminar', () => {
        it('debe eliminar un usuario', async () => {
            const body = { id: 1 };

            mockDb.eliminar.mockResolvedValueOnce({ affectedRows: 1 });

            const result = await controller.eliminar(body);

            expect(result.affectedRows).toBe(1);
            expect(mockDb.eliminar).toHaveBeenCalledWith('usuarios', 1);
        });
    });
});