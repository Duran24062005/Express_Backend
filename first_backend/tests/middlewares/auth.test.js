const jwt = require('jsonwebtoken');
const auth = require('../../src/middlewares/auth');
const config = require('../../src/config');

jest.mock('jsonwebtoken');
jest.mock('../../src/config', () => ({
    jwt: {
        secret: 'test-secret-key'
    }
}));

describe('Auth Middleware', () => {
    describe('generarToken', () => {
        it('debe generar un token JWT válido', () => {
            const data = { id: 1, usuario: 'testuser' };
            const mockToken = 'mock-jwt-token';

            jwt.sign.mockReturnValueOnce(mockToken);

            const token = auth.generarToken(data);

            expect(token).toBe(mockToken);
            expect(jwt.sign).toHaveBeenCalledWith(
                data,
                'test-secret-key',
                { expiresIn: '24h' }
            );
        });
    });

    describe('verificarToken', () => {
        it('debe verificar un token válido', () => {
            const token = 'valid-token';
            const decoded = { id: 1, usuario: 'testuser' };

            jwt.verify.mockReturnValueOnce(decoded);

            const result = auth.verificarToken(token);

            expect(result).toEqual(decoded);
            expect(jwt.verify).toHaveBeenCalledWith(token, 'test-secret-key');
        });

        it('debe lanzar error si el token es inválido', () => {
            const token = 'invalid-token';

            jwt.verify.mockImplementationOnce(() => {
                throw new Error('Invalid token');
            });

            expect(() => auth.verificarToken(token)).toThrow('Invalid token');
        });
    });

    describe('chequearToken.confirmarToken', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                headers: {}
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            next = jest.fn();
            jest.clearAllMocks();
        });

        it('debe permitir acceso con token válido', () => {
            const token = 'valid-token';
            const decoded = { id: 1, usuario: 'testuser' };

            req.headers['authorization'] = `Bearer ${token}`;
            jwt.verify.mockReturnValueOnce(decoded);

            auth.chequearToken.confirmarToken(req, res, next);

            expect(req.usuario).toEqual(decoded);
            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('debe retornar 401 si no hay header de autorización', () => {
            auth.chequearToken.confirmarToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                status: 401,
                body: 'Token no proporcionado'
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('debe retornar 401 si el formato del token es inválido', () => {
            req.headers['authorization'] = 'InvalidFormat';

            auth.chequearToken.confirmarToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                status: 401,
                body: 'Formato de token inválido'
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('debe retornar 401 si el token es inválido o expirado', () => {
            const token = 'invalid-token';
            req.headers['authorization'] = `Bearer ${token}`;

            jwt.verify.mockImplementationOnce(() => {
                throw new Error('Token expired');
            });

            auth.chequearToken.confirmarToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                status: 401,
                body: 'Token inválido o expirado'
            });
            expect(next).not.toHaveBeenCalled();
        });
    });
});
