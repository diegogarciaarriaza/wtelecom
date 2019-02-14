var config = require('../config/main');
var mongoose = require('mongoose').Mongoose;

var connection = config.databaseMongo;
var models = {}

var instance = new mongoose()
instance.connect('mongodb://' + connection.host + ':' + connection.port + '/' + connection.database);

var db = instance.connection;

db.on('error', function () {
    console.log("Error de conectividad a mongodb")
});
db.once('open', function () {
    console.log("Conectado correctamente a mongodb");
});


//Carga de modelos de base de datos mongodb
var errorSchema = instance.Schema(require('./error'))
var clientSchema = instance.Schema(require('./client'))
var billingSchema = instance.Schema(require('./billing'))

//Asignacion de modelos a tablas
var error = instance.model('errores', errorSchema);
var client = instance.model('clients', clientSchema);
var billing = instance.model('billings', billingSchema);

models = {
    "error": error,
    "client": client,
    "billing": billing
}

module.exports = models
