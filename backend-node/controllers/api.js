'use strict'

var config = require("../config/main");
var respuesta = require('../helper/respuesta');
var asyncLoop = require('node-async-loop');


var Error = require("../models").error
var Client = require("../models").client
var Billing = require("../models").billing

async function loadcsv(req, res) {
    var csvtojson = require("csvtojson")
    let csv = await csvtojson().fromFile('uploads/' + req.params.csvfile)

    let e
    for(var i = 0; i < csv.length; i++){

        e = csv[i]

        console.log(".", e.nif, e.id_billing)

        let cli = await Client.findOne({nif: e.nif})
        if(!cli){
            var newClient = new Client({name: e.name, surname: e.surname, nif: e.nif})
            newClient.save(async function (error, client) {
                if (error) {
                    respuesta(req, res, 401, null, 'Something was wrong creating client', 1);
                }
                else{
                    cli = client
                }
            })
        }

        let bil = await Billing.findOne({id_billing: e.id_billing})
        if(!bil){
            var newBilling = new Billing({id_billing: e.id_billing, id_client: cli._id, CUPS: e.cups, kws: e.kws, amount: e.amount, paid: e.paid, issued_at: e.issued_at})
            newBilling.save(async function (error, billing) {
                if (error) {
                    respuesta(req, res, 401, null, 'Something was wrong creating client', 1);
                }
            })
        }
    }

    respuesta(req, res, 200, null, 'success', 0);
}

function postClient(req, res) {

    if (!req.body['json']) {
        respuesta(req, res, 401, null, 'No data received', 1);
    }
    else {
        var json = req.body['json'];
        json = JSON.parse(json);

        var data = {
            name: json.name,
            surname: json.surname,
            nif: json.nif,
            created_at: new Date(),
            active: 1
        }

        if (!data.nif || !data.name || !data.surname) {
            respuesta(req, res, 401, null, 'Please enter all parameters', 1);
        }
        else {
            Client.findOne({nif: data.nif}, function(error, client) {
                if (error) {
                    respuesta(req, res, 500, null, 'Something was wrong finding client', 1);
                }
                else {
                    if (client) {
                        respuesta(req, res, 205, client, 'Client exists already', 1);
                    }
                    else {
                        var newClient = new Client(data)
                        newClient.save(function (error, client) {
                            if (error) {
                                respuesta(req, res, 500, null, 'Something was wrong creating client', 1);
                            }
                            else {
                                respuesta(req, res, 200, client, 'Created new client', 0);
                            }
                        })
                    }
                }
            })
        }
    }
}

function getClient(req, res) {
    Client.findOne({nif: req.params.nif}, function(error, client) {
        if (error) {
            respuesta(req, res, 500, null, 'Something was wrong finding client', 1);
        }
        else {
            if (!client) {
                respuesta(req, res, 205, null, 'Client does not exists', 1);
            }
            else {
                respuesta(req, res, 200, client, 'Client recovered', 0);
            }
        }
    })
}

function putClient(req, res) {
    if (!req.body['json']) {
        respuesta(req, res, 401, null, 'No data received', 1);
    }
    else {
        var json = req.body['json'];
        json = JSON.parse(json);

        var data = {
            name: json.name,
            surname: json.surname,
            active: 1
        }

        if (!data.nif || !data.name || !data.surname) {
            respuesta(req, res, 401, null, 'Please enter all parameters', 1);
        }
        else {
            Client.findOne({nif: data.nif}, function(error, client) {
                if (error) {
                    respuesta(req, res, 500, null, 'Something was wrong finding client', 1);
                }
                else {
                    if (!client) {
                        respuesta(req, res, 205, client, 'Client does not exists', 1);
                    }
                    else {
                        client.set(data)
                        client.save(function (error, clientupd) {
                            if (error) {
                                respuesta(req, res, 500, null, 'Something was wrong creating client', 1);
                            }
                            else {
                                respuesta(req, res, 200, clientupd, 'Updated client', 0);
                            }
                        })
                    }
                }
            })
        }
    }
}

function deleteClient(req, res) {
    Client.findOne({nif: req.params.nif}, function(error, client) {
        if (error) {
            respuesta(req, res, 500, null, 'Something was wrong finding client', 1);
        }
        else {
            if (!client) {
                respuesta(req, res, 205, client, 'Client does not exists', 1);
            }
            else {
                client.set({active: 0})
                client.save(function (error, clientupd) {
                    if (error) {
                        respuesta(req, res, 500, null, 'Something was wrong creating client', 1);
                    }
                    else {
                        respuesta(req, res, 200, null, 'Deleted client', 0);
                    }
                })
            }
        }
    })
}

//BILLING

function postBilling(req, res) {

    if (!req.body['json']) {
        respuesta(req, res, 401, null, 'No data received', 1);
    }
    else {
        var json = req.body['json'];
        json = JSON.parse(json);

        var data = {
            id_billing: json.id_billing,
            id_client: json.id_client,
            CUPS: json.CUPS,
            kws: json.kws,
            amount: json.amount,
            paid: json.paid,
            issued_at: json.issued_at,
            paid_at: json.paid_at,
            created_at: new Date(),
            active: 1
        }

        if (!data.id_billing || !data.id_client || !data.CUPS || !data.kws || !data.amount || typeof data.paid == "undefined") {
            console.log(data)
            respuesta(req, res, 401, null, 'Please enter all parameters', 1);
        }
        else {
            Billing.findOne({id_billing: data.id_billing}, function(error, billing) {
                if (error) {
                    respuesta(req, res, 500, null, 'Something was wrong finding billing', 1);
                }
                else {
                    if (billing) {
                        respuesta(req, res, 205, billing, 'Billing exists already', 1);
                    }
                    else {
                        var newBilling = new Billing(data)
                        newBilling.save(function (error, billing) {
                            if (error) {
                                respuesta(req, res, 500, null, 'Something was wrong creating billing', 1);
                            }
                            else {
                                respuesta(req, res, 200, billing, 'Created new billing', 0);
                            }
                        })
                    }
                }
            })
        }
    }
}

function getBilling(req, res) {
    Billing.findOne({id_billing: req.params.id_billing}, function(error, billing) {
        if (error) {
            respuesta(req, res, 500, null, 'Something was wrong finding billing', 1);
        }
        else {
            if (!billing) {
                respuesta(req, res, 205, null, 'Billing does not exists', 1);
            }
            else {
                respuesta(req, res, 200, billing, 'Billing recovered', 0);
            }
        }
    })
}

function getBillings(req, res) {
    Billing.find({}).exec(function(error, billings) {
        if (error) {
            respuesta(req, res, 500, null, 'Something was wrong finding billing', 1);
        }
        else {
            if (!billings) {
                respuesta(req, res, 205, null, 'Billing does not exists', 1);
            }
            else {
                respuesta(req, res, 200, billings, 'Billing recovered', 0);
            }
        }
    })
}

function putBilling(req, res) {
    if (!req.body['json']) {
        respuesta(req, res, 401, null, 'No data received', 1);
    }
    else {
        var json = req.body['json'];
        json = JSON.parse(json);

        var data = {
            id_client: json.id_client,
            CUPS: json.CUPS,
            kws: json.kws,
            amount: json.amount,
            paid: json.paid,
            issued_at: json.issued_at,
            paid_at: json.paid_at,
            active: 1
        }

        if (!data.id_client || !data.CUPS || !data.kws || !data.amount || !data.paid) {
            respuesta(req, res, 401, null, 'Please enter all parameters', 1);
        }
        else {
            Billing.findOne({id_billing: req.params.id_billing}, function(error, billing) {
                if (error) {
                    respuesta(req, res, 500, null, 'Something was wrong finding billing', 1);
                }
                else {
                    if (!billing) {
                        respuesta(req, res, 205, billing, 'Billing does not exists', 1);
                    }
                    else {
                        billing.set(data)
                        billing.save(function (error, billingupd) {
                            if (error) {
                                respuesta(req, res, 500, null, 'Something was wrong creating billing', 1);
                            }
                            else {
                                respuesta(req, res, 200, billingupd, 'Billing client', 0);
                            }
                        })
                    }
                }
            })
        }
    }
}

function deleteBilling(req, res) {
    Billing.findOne({id_billing: req.params.id_billing}, function(error, billing) {
        if (error) {
            respuesta(req, res, 500, null, 'Something was wrong finding client', 1);
        }
        else {
            if (!billing) {
                respuesta(req, res, 205, billing, 'Billing does not exists', 1);
            }
            else {
                billing.set({active: 0})
                billing.save(function (error, billingupd) {
                    if (error) {
                        respuesta(req, res, 500, null, 'Something was wrong creating billing', 1);
                    }
                    else {
                        respuesta(req, res, 200, null, 'Deleted billing', 0);
                    }
                })
            }
        }
    })
}

module.exports = {
    postClient, getClient, putClient, deleteClient,
    postBilling, getBilling, getBillings, putBilling, deleteBilling,
    loadcsv
}