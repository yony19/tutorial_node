'use strict'

// Require 
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar express
var app = express();
//Cargar archivos de rutas
var user_routes = require('./routes/userRoute');
//Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//CORS

//Reescribir Rutas
app.use('/api', user_routes);
//Ruta/metodo de prueba
/*
app.get('/prueba', (req, response) => {
    
    return response.status(200).send("<h1>Hola mundo</h1>");
});

app.post('/prueba', (req, response) => {
    return response.status(200).send({
        nombre: "Yony quispe ramos",
        message: "Hola mundo desde bakend con node"
    });
});*/

//Exportar modulo
module.exports = app;