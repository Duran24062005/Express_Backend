const jwt = require('jsonwebtoken');
const config = require('../config');

const secret = config.jwt.secret;

function generarToken(data) {
    return jwt.sign(data, secret, { expiresIn: '24h' });
}

function verificarToken(token) {
    return jwt.verify(token, secret);
}

const chequearToken = {
    confirmarToken: function (req, res, next) {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({
                error: true,
                status: 401,
                body: 'Token no proporcionado'
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: true,
                status: 401,
                body: 'Formato de token inválido'
            });
        }

        try {
            const decoded = verificarToken(token);
            req.usuario = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                error: true,
                status: 401,
                body: 'Token inválido o expirado'
            });
        }
    }
};

module.exports = {
    generarToken,
    verificarToken,
    chequearToken
};