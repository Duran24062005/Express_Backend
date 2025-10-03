// Success message
exports.success = function (req, res, message, status) {
    // Si no viene por defecto el status
    const statusCode = status || 200;

    // Si no viene un mensaje por defecto
    const messageError = message || '';

    res.status(status).send({
        error: false,
        status: statusCode,
        body: messageError
    });
};


// Error message
exports.error = function (req, res, message, status) {
    // Si no viene por defecto el status
    const statusCode = status || 500;

    // Si no viene un mensaje por defecto
    const messageOk = message || 'Error interno del servidor';
    
    res.status(status).send({
        error: true,
        status: statusCode,
        body: messageOk
    });
};