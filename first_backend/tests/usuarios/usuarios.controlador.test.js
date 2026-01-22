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

            // ✅ CORREGIDO: Mock debe ser await
            const datos = require('../../src/db/mysql.js');
            const spyAgregar = jest.spyOn(datos, 'agregar')
                .mockResolvedValueOnce({ insertId: 1 });

            const result = await controller.agregar(userData);

            expect(result).toBe(true);
            expect(spyAgregar).toHaveBeenCalledWith('usuarios', {
                id: undefined,
                nombre: 'Juan Pérez',
                activo: 1
            });

            spyAgregar.mockRestore();
        });

        it('debe crear un usuario con datos de autenticación', async () => {
            const userData = {
                nombre: 'Juan Pérez',
                usuario: 'juanp',
                password: 'password123',
                activo: 1
            };

            const datos = require('../../src/db/mysql.js');
            const spyAgregar = jest.spyOn(datos, 'agregar')
                .mockResolvedValueOnce({ insertId: 1 })  // usuarios
                .mockResolvedValueOnce({ insertId: 1 }); // auth

            bcrypt.hash.mockResolvedValueOnce('hashed-password');

            const result = await controller.agregar(userData);

            expect(result).toBe(true);
            expect(spyAgregar).toHaveBeenCalledTimes(2);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

            spyAgregar.mockRestore();
        });

        it('debe actualizar un usuario existente', async () => {
            const userData = {
                id: 1,
                nombre: 'Juan Pérez Actualizado',
                activo: 1
            };

            const datos = require('../../src/db/mysql.js');
            const spyAgregar = jest.spyOn(datos, 'agregar')
                .mockResolvedValueOnce({ affectedRows: 1 });

            const result = await controller.agregar(userData);

            expect(result).toBe(true);
            expect(spyAgregar).toHaveBeenCalledWith('usuarios', {
                id: 1,
                nombre: 'Juan Pérez Actualizado',
                activo: 1
            });

            spyAgregar.mockRestore();
        });
    });

    describe('eliminar', () => {
        it('debe eliminar un usuario', async () => {
            const body = { id: 1 };

            // ✅ CORREGIDO: Esperar ResultSetHeader completo
            const datos = require('../../src/db/mysql.js');
            const spyEliminar = jest.spyOn(datos, 'eliminar')
                .mockResolvedValueOnce({
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
            expect(spyEliminar).toHaveBeenCalledWith('usuarios', 1);

            spyEliminar.mockRestore();
        });
    });
});