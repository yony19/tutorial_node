'use strict'

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "clave-secreta-para-generar-token-9999";
              
exports.authenticated = function (req, res, next) {
    // Comprobar si llega autorizacion
    if (!req.headers.authorization) {
        return res.status(403).send({
            message: 'La peticion no tiene la cabecera de authorization'
        });
    }
    // Limpiar el token y quietar comillas
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        // Decodificar
        var payload =  jwt.decode(token, secret);

        // Comprobar si token ha expirado
        if (payload.exp <= moment().unix()) {
            return res.status(404).send({
                message: 'El toke ha expirado'
            });
        }
    } catch (ex) {
        console.log(token);
        return res.status(404).send({
            message: 'El toke no es valido'
        });
    }

    //Adjuntar usuario identificado a request
    req.user = payload;

    //pasar la accion
    next();
}