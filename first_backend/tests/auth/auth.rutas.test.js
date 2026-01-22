const request = require('supertest');
const express = require('express');
const authRoutes = require('../../src/modulos/auth/rutas');
const authController = require('../../src/modulos/auth/index');

// Mock del controlador
jest.mock('../../src/modulos/auth/index', () => ({
    login: jest.fn(),
    registrar: jest.fn(),
    obtenerUsuario: jest.fn()
}));

// Mock del middleware de autenticación
jest.mock('../../src/middlewares/auth', () => ({
    chequearToken: {
        confirmarToken: (req, res, next) => {
            req.usuario = { id: 1, usuario: 'testuser' };
            next();
        }
    }
}));

describe('Auth Routes', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/auth', authRoutes);
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('debe registrar un usuario exitosamente', async () => {
            const userData = {
                nombre: 'Juan Pérez',
                usuario: 'juanp',
                password: 'password123'
            };

            authController.registrar.mockResolvedValueOnce({
                id: 1,
                nombre: 'Juan Pérez',
                usuario: 'juanp'
            });

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body).toMatchObject({
                error: false,
                status: 201,
                body: {
                    message: 'Usuario registrado exitosamente',
                    usuario: {
                        id: 1,
                        nombre: 'Juan Pérez',
                        usuario: 'juanp'
                    }
                }
            });
        });

        it('debe retornar error 409 si el usuario ya existe', async () => {
            const userData = {
                nombre: 'Juan Pérez',
                usuario: 'juanp',
                password: 'password123'
            };

            authController.registrar.mockRejectedValueOnce(new Error('El usuario ya existe'));

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(409);

            expect(response.body.error).toBe(true);
            expect(response.body.body).toBe('El usuario ya existe');
        });

        it('debe retornar error 400 si faltan datos', async () => {
            const userData = {
                nombre: 'Juan Pérez'
                // Falta usuario y password
            };

            authController.registrar.mockRejectedValueOnce(
                new Error('Datos incompletos: nombre, usuario y password son requeridos')
            );

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body.error).toBe(true);
        });
    });

    describe('POST /api/auth/login', () => {
        it('debe hacer login exitosamente', async () => {
            const loginData = {
                usuario: 'juanp',
                password: 'password123'
            };

            authController.login.mockResolvedValueOnce({
                token: 'mock-token-123',
                usuario: {
                    id: 1,
                    nombre: 'Juan Pérez',
                    usuario: 'juanp'
                }
            });

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(200);

            expect(response.body).toMatchObject({
                error: false,
                status: 200,
                body: {
                    message: 'Login exitoso',
                    token: 'mock-token-123',
                    usuario: {
                        id: 1,
                        nombre: 'Juan Pérez',
                        usuario: 'juanp'
                    }
                }
            });
        });

        it('debe retornar error 400 si faltan credenciales', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({})
                .expect(400);

            expect(response.body.error).toBe(true);
            expect(response.body.body).toBe('Usuario y contraseña son requeridos');
        });

        it('debe retornar error 401 si las credenciales son inválidas', async () => {
            authController.login.mockRejectedValueOnce(new Error('Usuario no encontrado'));

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    usuario: 'inexistente',
                    password: 'password'
                })
                .expect(401);

            expect(response.body.error).toBe(true);
            expect(response.body.body).toBe('Credenciales inválidas');
        });
    });

    describe('GET /api/auth/me', () => {
        it('debe retornar el usuario actual', async () => {
            const usuarioMock = {
                id: 1,
                nombre: 'Juan Pérez',
                usuario: 'juanp',
                activo: 1
            };

            authController.obtenerUsuario.mockResolvedValueOnce(usuarioMock);

            const response = await request(app)
                .get('/api/auth/me')
                .expect(200);

            expect(response.body).toMatchObject({
                error: false,
                status: 200,
                body: usuarioMock
            });
        });
    });
});
