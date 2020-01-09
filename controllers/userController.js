'use strict'

var validator = require('validator');
var bcrypt = require('bcrypt');
var User = require('../models/user');
var jwt = require('../services/jwt');

var controller = {
    probando: function (req, resp) {
        return resp.status(200).send({
            message: "Soy el metodo probando"
        });
    },
    testeando: function (req, resp) {
        return resp.status(200).send({
            message: "Soy el metodo testeando"
        });
    },
    save: function (req, resp) {
        //recoger los parametros de la petición
        var params = req.body;
        try {
            var validate_name = !validator.isEmpty(params.name)
            var validate_surname = !validator.isEmpty(params.surname)
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email)
            var validate_password = !validator.isEmpty(params.password)
        } catch (err) {
            return res.status(200).send({
                message:"Faltan datos por enviar"
            });
        }
        //Validar los datos
        if (validate_name && validate_surname && validate_email && validate_password) {//validateParams(params)
            //Crear objeto de usuario
            var user = new User();
            //Asignar valores al usuarios
            user.name = params.name;
            user.surname = params.surname;
            user.email = params.email.toLowerCase();
            user.role = 'ROLE_USER';
            user.image = null;
            
            //Comprobar si el usuario existe
            User.findOne({email: user.email}, (error, issetUser) => {
                if (error) {
                    return resp.status(500).send({
                        message: "Error al comprobar duplicidad de usuario"
                    });
                }
                //Si no existe, 
                if (!issetUser) {
                    //cifrar la contraseña
                    bcrypt.hash(params.password, 10, (err, hash) => {
                        user.password = hash;
                        //y guardar usuario
                        user.save((error, userStored) => {
                            if (error) {
                                return resp.status(500).send({
                                    message: "Error al guardar el usuario"
                                });
                            }

                            if (!userStored) {
                                return resp.status(400).send({
                                    message: "El usuario no se ha guardado"
                                });
                            }
                            //Devolver respuesta
                            return resp.status(200).send({
                                status: 'success',
                                user: userStored
                            });
                        });//close save
                    });//close decrypt
                } else {
                    return resp.status(500).send({
                        message: "El usuario ya esta registrado"
                    });
                }
            });
        } else {
            return resp.status(500).send({
                message: "La validacion de los datos del usuario incorrecta, intentarlo de nuevo",
            });
        }
    },
    login: function (req, res) {
        //Recorer parametros
        var params = req.body;
        //validar
        try {
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (err) {
            return res.status(200).send({
                message:"Faltan datos por enviar"
            });
        }
        if (!validate_email || !validate_password) {
            return res.status(200).send({
                message:"Los datos son incorrectos"
            });
        }

        //Buscar usuario con email
        User.findOne({email: params.email.toLowerCase()}, (error, user) => {
            if (error) {
                return res.status(500).send({
                    message:"Error al intentar identificarse"
                });
            }

            if (!user) {
                return res.status(500).send({
                    message:"El usuario no existe",
                });
            }
            //si lo encuentra
            //comprobar contrseña y email bycript
            bcrypt.compare(params.password, user.password, (err, check) => {
                //Correcto
                if (check) {
                    //generar token jwt y devolverlo
                    if (params.gettoken) {
                        //devolver datos
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        // Limpiar filtrar objeto
                        user.password = undefined;
                        //devolver datos
                        return res.status(200).send({
                            status: 'success',
                            user
                        });
                    }
                } else {
                    return res.status(200).send({
                        message:"Las Credenciales no son correctos",
                    });
                }
            });
        })
    },
    update: function (req, res) {
        //recoger datos
        var params = req.body;

        //Validar datos
        try {
            var validate_name = !validator.isEmpty(params.name)
            var validate_surname = !validator.isEmpty(params.surname)
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email)
        } catch (err) {
            return res.status(200).send({
                message:"Faltan datos por enviar"
            });
        }
        //eliminar propiedades innesesarias
        delete params.password;

        //comprobar si el email es unico
        if (req.user.email != params.email) {
            //Buscar usuario con email
            User.findOne({email: params.email.toLowerCase()}, (error, user) => {
                if (error) {
                    return res.status(500).send({
                        message:"Error al intentar identificarse"
                    });
                }

                if (user && user.email == params.email) {
                    return res.status(500).send({
                        message:"El email no puede ser modificado",
                    });
                }

            });
        } else {
            //buscar y actuañlizar
            var userId = req.user.sub;
            User.findByIdAndUpdate({_id: userId}, params, {new: true}, (err, userUpdated) => {
                //devolver erespuesta
                if (err) {
                    return res.status(200).send({
                        status: 'error',
                        message: "Error al actualizar usuario"
                    });
                }

                if (!userUpdated) {
                    return res.status(200).send({
                        status: 'error',
                        message: "No se actualizo el usuario"
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    user: userUpdated
                });
            })
        }
    },
    uploadAvatar: function (req, res) {
        //configurar modulo mulparty (md) route/user.js

        //recoger fichero de la peticion
        var fileName = 'Avatar no subido...';

        if (req.files) {
            
        }
        //conseguir el nombre y la extencion del archivo

        //comprobar extencion (solo imagenes), si no es valida borrar fichero subido

        return res.status(200).send({
            status: 'success',
            message: "Upload avatar"
        });
    }
};

module.exports = controller;