'use strict'

var express = require('express');
var config = require('../config/main');

var api = require('../controllers/api.js');

//create API group routes
var apiRoutes = express.Router();

apiRoutes.post('/loadcsv/:csvfile', api.loadcsv);

apiRoutes.post('/client', api.postClient);
apiRoutes.get('/client/:nif', api.getClient);
apiRoutes.put('/client/:nif', api.putClient);
apiRoutes.delete('/client/:nif', api.deleteClient);

apiRoutes.post('/billing', api.postBilling);
apiRoutes.get('/billing/:id_billing', api.getBilling);
apiRoutes.get('/billings', api.getBillings);
apiRoutes.put('/billing/:id_billing', api.putBilling);
apiRoutes.delete('/billing/:id_billing', api.deleteBilling);

module.exports = apiRoutes;
