const bcrypt = require('bcrypt');
const authController = require('../../src/modulos/auth/controlador');

// Mock bcrypt
jest.mock('bcrypt');
// Mock auth middleware
jest.mock('../../src/middlewares/auth', () => ({
    generarToken: jest.fn((data) => `mock-token-${data.id}-${data.usuario}`)
}));

describe('Auth Controller', () => {
    let mockDb;
    let controller;

    beforeEach(() => {
        mockDb = {
            query: jest.fn(),
            agregar: jest.fn(),
            uno: jest.fn()
        };
        controller = authController(mockDb);
        jest.clearAllMocks();
    });

    describe('registrar', () => {
        it('debe registrar un usuario exitosamente', async () => {
            const userData = {
                nombre: 'Juan Pérez',
                usuario: 'juanp',
                password: 'password123'
            };

            mockDb.query.mockResolvedValueOnce([]); // Usuario no existe
            mockDb.agregar
                .mockResolvedValueOnce({ insertId: 1 }) // Insert usuario
                .mockResolvedValueOnce({ insertId: 1 }); // Insert auth
            bcrypt.hash.mockResolvedValueOnce('hashed-password');

            const result = await controller.registrar(userData);

            expect(result).toEqual({
                id: 1,
                nombre: 'Juan Pérez',
                usuario: 'juanp'
            });
            expect(mockDb.query).toHaveBeenCalledWith('usuarios', { usuario: 'juanp' });
            expect(mockDb.agregar).toHaveBeenCalledTimes(2);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        });

        it('debe lanzar error si el usuario ya existe', async () => {
            const userData = {
                nombre: 'Juan Pérez',
                usuario: 'juanp',
                password: 'password123'
            };

            mockDb.query.mockResolvedValueOnce([{ id: 1, usuario: 'juanp' }]);

            await expect(controller.registrar(userData)).rejects.toThrow('El usuario ya existe');
        });

        it('debe lanzar error si faltan datos requeridos', async () => {
            const userData = {
                nombre: 'Juan Pérez'
                // Falta usuario y password
            };

            mockDb.query.mockResolvedValueOnce([]);

            await expect(controller.registrar(userData)).rejects.toThrow('Datos incompletos');
        });

        it('debe lanzar error si la contraseña es muy corta', async () => {
            const userData = {
                nombre: 'Juan Pérez',
                usuario: 'juanp',
                password: '12345' // Menos de 6 caracteres
            };

            mockDb.query.mockResolvedValueOnce([]);

            await expect(controller.registrar(userData)).rejects.toThrow('al menos 6 caracteres');
        });
    });

    describe('login', () => {
        it('debe hacer login exitosamente', async () => {
            const usuario = 'juanp';
            const password = 'password123';
            const hashedPassword = await bcrypt.hash('password123', 10);

            mockDb.query
                .mockResolvedValueOnce([{ id: 1, nombre: 'Juan Pérez', usuario: 'juanp' }])
                .mockResolvedValueOnce([{ usuario: 'juanp', password: hashedPassword }]);
            bcrypt.compare.mockResolvedValueOnce(true);

            const result = await controller.login(usuario, password);

            expect(result).toHaveProperty('token');
            expect(result).toHaveProperty('usuario');
            expect(result.usuario).toEqual({
                id: 1,
                nombre: 'Juan Pérez',
                usuario: 'juanp'
            });
            expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
        });

        it('debe lanzar error si el usuario no existe', async () => {
            mockDb.query.mockResolvedValueOnce([]);

            await expect(controller.login('inexistente', 'password')).rejects.toThrow('Usuario no encontrado');
        });

        it('debe lanzar error si no hay datos de autenticación', async () => {
            mockDb.query
                .mockResolvedValueOnce([{ id: 1, nombre: 'Juan Pérez', usuario: 'juanp' }])
                .mockResolvedValueOnce([]);

            await expect(controller.login('juanp', 'password')).rejects.toThrow('Datos de autenticación no encontrados');
        });

        it('debe lanzar error si la contraseña es incorrecta', async () => {
            const hashedPassword = await bcrypt.hash('correctpassword', 10);

            mockDb.query
                .mockResolvedValueOnce([{ id: 1, nombre: 'Juan Pérez', usuario: 'juanp' }])
                .mockResolvedValueOnce([{ usuario: 'juanp', password: hashedPassword }]);
            bcrypt.compare.mockResolvedValueOnce(false);

            await expect(controller.login('juanp', 'wrongpassword')).rejects.toThrow('Contraseña incorrecta');
        });
    });

    describe('obtenerUsuario', () => {
        it('debe obtener un usuario por ID', async () => {
            const usuarioMock = {
                id: 1,
                nombre: 'Juan Pérez',
                usuario: 'juanp',
                activo: 1
            };

            mockDb.uno.mockResolvedValueOnce([usuarioMock]);

            const result = await controller.obtenerUsuario(1);

            expect(result).toEqual(usuarioMock);
            expect(mockDb.uno).toHaveBeenCalledWith('usuarios', 1);
        });

        it('debe lanzar error si el usuario no existe', async () => {
            mockDb.uno.mockResolvedValueOnce([]);

            await expect(controller.obtenerUsuario(999)).rejects.toThrow('Usuario no encontrado');
        });
    });
});
