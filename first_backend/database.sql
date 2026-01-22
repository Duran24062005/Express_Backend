CREATE DATABASE IF NOT EXISTS first_backend_express;

use first_backend_express;

CREATE TABLE IF NOT EXISTS clientes (
    id INT PRIMARY KEY AUTO_INCREMENT not NULL,
    nombre VARCHAR(50),
    edad INTEGER(2),
    profesion VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT not NULL,
    nombre VARCHAR(50),
    usuario VARCHAR(20),
    activo INT(1)
);

CREATE TABLE IF NOT EXISTS auth (
    id INT(10),
    usuario VARCHAR(20),
    password VARCHAR(50)
);

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'Alexi Duran',
        20,
        'Desarrollador de Software'
    );

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'Mariana López',
        25,
        'Diseñadora Gráfica'
    );

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'Carlos Ramírez',
        32,
        'Ingeniero Civil'
    );

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES ('Laura Gómez', 29, 'Doctora');

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'Andrés Torres',
        21,
        'Estudiante'
    );

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'Sofía Martínez',
        27,
        'Arquitecta'
    );

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'Julián Herrera',
        35,
        'Abogado'
    );

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'Valentina Ruiz',
        22,
        'Community Manager'
    );

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'Miguel Pérez',
        40,
        'Profesor'
    );

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'Natalia Castro',
        31,
        'Contadora'
    );

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES ('Camilo Rojas', 28, 'Chef');

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'Daniela Vargas',
        23,
        'Fotógrafa'
    );

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'Sebastián Muñoz',
        26,
        'Mecánico'
    );

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'Ana Fernández',
        34,
        'Psicóloga'
    );

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'Felipe Gómez',
        30,
        'Marketing Digital'
    );

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'Isabella Ortiz',
        19,
        'Estudiante'
    );

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'David Morales',
        33,
        'Empresario'
    );

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'Paula Jiménez',
        24,
        'Enfermera'
    );

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'Luis Rodríguez',
        45,
        'Taxista'
    );

INSERT INTO
    clientes (nombre, edad, profesion)
VALUES (
        'Carolina Sánchez',
        38,
        'Periodista'
    );

SELECT * FROM clientes;