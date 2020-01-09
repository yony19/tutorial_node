'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

exports.createToken = function (user) {
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),//fecha de creacion
        exp: moment().add(30, 'days').unix()//tiempo de exipracion
    };

    return jwt.encode(payload, 'clave-secreta-para-generar-token-9999');
};