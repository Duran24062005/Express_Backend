// Success message
exports.success = function (req, res, message = "", status = 200) {
    // Si no viene por defecto el status
    // const statusCode = status || 200;

    // Si no viene un mensaje por defecto
    // const messageOk = message || '';

    res.status(status).send({
        error: false,
        status: status,
        body: message
    });
};


// Error message
exports.error = function (req, res, message = "Error interno del servidor", status = 500) {
    // Si no viene por defecto el status
    // const statusCode = status || 500;

    // Si no viene un mensaje por defecto
    // const messageError = message || 'Error interno del servidor';

    res.status(status).send({
        error: true,
        status: status,
        body: message
    });
};