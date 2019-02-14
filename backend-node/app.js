'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var cors = require('cors');

var config = require('./config/main');

var app = express();

var routes = require('./routes/api');

//bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//habilitamos el uso de cors
app.use(cors());

//añadimos algo de seguridad con helmet
app.use(helmet());
app.use(helmet.noCache());

//ruta base
app.use('/api', routes);

module.exports = app;