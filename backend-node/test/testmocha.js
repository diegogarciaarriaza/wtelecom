var assert = require("assert")
var expect = require('chai').expect;
var request = require('request')
var config = require('./config.js')
var llamadasAsterisk = require("../controllers/llamadasAsterisk")

var token = "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo1MDEsImlkX3BlcmZpbCI6MywibG9naW4iOiJvcG1lY2QiLCJub21icmUiOiJPcGVyYWRvciBNRUNEIiwiYXZhdGFyIjoiIiwicGFzc3dkIjoiJDJhJDEwJDhSTy5ZWWxOVnR2bmtsdzl3MDdsME9lMEhzbTguZmo4MUh6SWJ6VGVnb0dyN3pXU2JKVzZLIiwiYmxvcXVlYWRvIjowLCJmZWNoYV9hbHRhIjoiMjAxOC0wMS0yOVQwOToxNjozMC4wMDBaIiwiZmVjaGFfdWx0X2Jsb3F1ZW8iOm51bGwsIm51bV9sb2dlb3MiOjAsInVsdF9sb2dlbyI6bnVsbCwiaWRfdXN1YXJpbyI6bnVsbCwiaWRfdGlwb191c3VhcmlvX2VtcHJlc2EiOjF9LCJpYXQiOjE1NDg2OTQxMDIsImV4cCI6MTU0ODczNzMwMn0.UH7v_CtQFh805FvXfbxuCUo23Xb9V6WxX21HoBR4M0g"

var ipAuth = config.testInterno ? config.ipAuth : config.ipExterna;
var ipEncolado = config.testInterno ? config.ipEncolado : config.ipExterna;
var ipAsterisk = config.testInterno ? config.ipAsterisk : config.ipExterna;

function llamadaHTTP(token, method, uri, body) {

    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
    }

    return new Promise(function (success, reject) {
        request({
                method: method,
                uri: uri,
                headers: headers,
                body: body
            },
            function (err, response, body) {
                if (!err) {
                    body = JSON.parse(body)
                    success(body)
                }
                else {
                    reject(err)
                }
            })
    })
}

describe('Obvious', function () {

    describe("Obvious", function () {

        it('1 should be always 1', function (done) {
            assert.equal(1, 1)
            done()
        })
    })
})

describe('Preparación del sistema.', function () {

    describe("Borrado de datos " + config.testEmpresa, function () {

        it('Borrado de Encolado', function (done) {
            var Encolado = require('../app/models')[config.testNEmpresa].mod.encolado;
            var sequelize = require('../app/models')[config.testNEmpresa].seq;
            Encolado.destroy({where: {idUsuario: config.testIdUsuario}})
                .then(async () => {
                    assert.equal(1, 1)
                    done()
                })
                .catch(err => {
                    assert.equal(0, 1)
                    done()
                })
            this.timeout(30000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })

        it('Borrado de Op_Eventos', function (done) {
            var Eventos = require('../app/models')[config.testNEmpresa].mod.op_eventos;
            var sequelize = require('../app/models')[config.testNEmpresa].seq;

            Eventos.destroy({where: {idUsuario: config.testIdUsuario}})
                .then(async () => {
                    assert.equal(1, 1)
                    done()
                })
                .catch(err => {
                    assert.equal(0, 1)
                    done()
                })
            this.timeout(30000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })

        it('Borrado de Op_Tiempos', function (done) {
            var Tiempos = require('../app/models')[config.testNEmpresa].mod.op_tiempos;
            var sequelize = require('../app/models')[config.testNEmpresa].seq;

            Tiempos
                .destroy({where: {idUsuario: config.testIdUsuario}})
                .then(async () => {
                    assert.equal(1, 1)
                    done()
                })
                .catch(err => {
                    assert.equal(0, 1)
                    done()
                })
            this.timeout(30000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })

        it('Deslogue de Asterisk', function (done) {
            llamadasAsterisk.logoutSpecificMembers(config.testEmpresa, config.testExtension)
                .then(() => {
                    assert(true)
                    done()
                })
                .catch(() => {
                    assert(false)
                    done()
                })
            this.timeout(30000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })
    })

}) //FIN describe('Preparación del sistema')

describe('Encolado Microservice. Tests Unitarios', function () {

    describe("Authentication", function () {

        it("Authentication OK", function (done) {
            llamadaHTTP(null, 'POST', 'http://' + ipAuth + ':3702/api/authenticate', 'json=' + JSON.stringify({
                "login": config.testLogin,
                "passwd": config.testPassword
            }))
                .then(body => {
                    expect(body.code).to.equal(200)
                    token = body.data
                    console.log("Authenticated")
                    done()
                })
                .catch(err => {
                    console.log("ERROR", err)
                    assert(false)
                    done()
                })
            this.timeout(30000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })
    })

    describe("API calls. POSTS", function () {

        it("POST '/encolado'", function () {
            //En principio este endpoint está en desuso. Ahora utilizamos post insertarEncolado
            assert.equal(1, 1)
        })

        it("POST '/insertarEncolado'", function (done) {
            llamadaHTTP(token, 'POST', 'http://' + ipEncolado + ':3720/api/insertarEncolado',
                'json=' + JSON.stringify({
                    "idUsuario": config.testIdUsuario,
                    "nombreCola": "MECD-BECAS",
                    "fecha": new Date(),
                    "ext": config.testExtension,
                    "nombreTemplate": "-"
                }))
                .then(body => {
                    expect(body.code).to.equal(200)
                    console.log("Encolado insertado")
                    done()
                })
                .catch(err => {
                    console.log("ERROR", err)
                    assert(false)
                    done()
                })
            this.timeout(30000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })
    })

    describe("API calls. PUTS", function () {

        it("PUT '/moverEncolado'", function (done) {
            var Encolado = require('../app/models')[config.testNEmpresa].mod.encolado;
            var sequelize = require('../app/models')[config.testNEmpresa].seq;

            Encolado
                .findOne({
                    where: {idUsuario: config.testIdUsuario},
                    order: sequelize.literal('idEncolado DESC')
                })
                .then(enc => {
                    llamadaHTTP(token, 'PUT', 'http://' + ipEncolado + ':3720/api/moverEncolado',
                        'json=' + JSON.stringify({
                            'idUsuario': config.testIdUsuario,
                            'nombreCola': 'MECD-CONVALIDACIONES',
                            'ext': config.testExtension,
                            'fecha': new Date(),
                            'nombreTemplate': '-',
                            'idEncoladoBorrar': enc.idEncolado,
                            'empresa': config.testEmpresa
                        }))
                        .then(body => {
                            expect(body.code).to.equal(200)
                            console.log("Encolado movido")
                            done()
                        })
                        .catch(err => {
                            console.log("ERROR", err)
                            assert(false)
                            done()
                        })
                })
            this.timeout(30000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })

        /*
        it("PUT '/procesaAsterisk'", function (done) {
            llamadaHTTP(token, 'PUT', 'http://' + ipEncolado + ':3720/api/procesaAsterisk',
                'json=' + JSON.stringify({
                    "idUsuario": config.testIdUsuario,
                    "evento": "LOGIN",
                    "ext": config.testExtension,
                    "estado": "0",
                    "gpev": "LOGIN"
                }))
                .then(body => {
                    console.log(body)
                    //expect(body.code).to.equal(200)
                    done()
                })
                .catch(err => {
                    console.log("ERROR", err)
                    assert(false)
                    done()
                })
            this.timeout(30000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })
        */

        it("PUT '/accionOperador'", function (done) {
            llamadaHTTP(token, 'PUT', 'http://' + ipEncolado + ':3720/api/accionOperador',
                'json=' + JSON.stringify({
                    "idUsuario": config.testIdUsuario,
                    "evento": "LOGIN"
                }))
                .then(body => {
                    expect(body.code).to.equal(200)
                    console.log("Usuario logado")
                    done()
                })
                .catch(err => {
                    console.log("ERROR", err)
                    assert(false)
                    done()
                })
            this.timeout(30000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })

        /*
        it("PUT '/accionAdministrador'", function (done) {
            llamadaHTTP('PUT', 'http://' + ipEncolado + ':3720/api/accionAdministrador', headers,
                'json=' + JSON.stringify({
                    "idUsuario": 631,
                    "evento": "LOGIN"
                }))
                .then(body => {
                    expect(body.code).to.equal(200)
                    done()
                })
                .catch(err => {
                    console.log("ERROR", err)
                    assert(false)
                    done()
                })
            this.timeout(5000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })
        */
    })

    describe("API calls. GETTERS", function () {

        it("GET '/encolados/:empresa/:fecha?'. Example of usage of local Empresas", function (done) {
            llamadaHTTP(token, 'GET', 'http://' + ipEncolado + ':3720/api/encolados/'+config.testEmpresa, null)
                .then(body => {
                    expect(body.code).to.equal(200)
                    done()
                })
                .catch(err => {
                    console.log("ERROR", err)
                    assert(false)
                    done()
                })
        })

        it("GET '/paramEventos/:evento/:empresa'.", function (done) {
            llamadaHTTP(token, 'GET', 'http://' + ipEncolado + ':3720/api/paramEventos/LOGIN/'+config.testEmpresa, null)
                .then(body => {
                    expect(body.code).to.equal(200)
                    done()
                })
                .catch(err => {
                    console.log("ERROR", err)
                    assert(false)
                    done()
                })
        })

        it("GET '/groupParamEventos/:grupo/:empresa'", function (done) {
            llamadaHTTP(token, 'GET', 'http://' + ipEncolado + ':3720/api/groupParamEventos/LOGIN/'+config.testEmpresa, null)
                .then(body => {
                    expect(body.code).to.equal(200)
                    done()
                })
                .catch(err => {
                    console.log("ERROR", err)
                    assert(false)
                    done()
                })
        })

        it("GET '/encoladoUsuario/:idUsuario?/:empresa?'", function (done) {
            llamadaHTTP(token, 'GET', 'http://' + ipEncolado + ':3720/api/encoladoUsuario/'+config.testIdUsuario+'/'+config.testEmpresa, null)
                .then(body => {
                    expect(body.code).to.equal(200)
                    done()
                })
                .catch(err => {
                    console.log("ERROR", err)
                    assert(false)
                    done()
                })
        })

        it("GET '/encoladoExtension/:ext/:empresa'", function (done) {
            llamadaHTTP(token, 'GET', 'http://' + ipEncolado + ':3720/api/encoladoExtension/'+config.testExtension+'/'+config.testEmpresa, null)
                .then(body => {
                    expect(body.code).to.equal(200)
                    done()
                })
                .catch(err => {
                    console.log("ERROR", err)
                    assert(false)
                    done()
                })
        })

        it("GET '/paramEventosAll'", function (done) {
            llamadaHTTP(token, 'GET', 'http://' + ipEncolado + ':3720/api/paramEventosAll', null)
                .then(body => {
                    expect(body.code).to.equal(200)
                    done()
                })
                .catch(err => {
                    console.log("ERROR", err)
                    assert(false)
                    done()
                })
        })

        it("GET '/inactivosEncolado/:empresa'", function (done) {
            llamadaHTTP(token, 'GET', 'http://' + ipEncolado + ':3720/api/inactivosEncolado/'+config.testEmpresa, null)
                .then(body => {
                    expect(body.code).to.be.within(200, 205)
                    done()
                })
                .catch(err => {
                    console.log("ERROR", err)
                    assert(false)
                    done()
                })
        })

        it("GET '/inactivosEncoladoUser/:usuario/:empresa'", function (done) {
            llamadaHTTP(token, 'GET', 'http://' + ipEncolado + ':3720/api/inactivosEncoladoUser/'+config.testIdUsuario+'/'+config.testEmpresa, null)
                .then(body => {
                    expect(body.code).to.be.within(200, 205)
                    done()
                })
                .catch(err => {
                    console.log("ERROR", err)
                    assert(false)
                    done()
                })
        })

        it("GET '/encoladoId/:idEncolado/:empresa'", function (done) {
            var Encolado = require('../app/models')[config.testNEmpresa].mod.encolado;
            var sequelize = require('../app/models')[config.testNEmpresa].seq;

            Encolado
                .findOne({
                    where: {idUsuario: config.testIdUsuario},
                    order: sequelize.literal('idEncolado DESC')
                })
                .then(enc => {
                    console.log("OBTENER", enc.idEncolado)
                    llamadaHTTP(token, 'GET', 'http://' + ipEncolado + ':3720/api/encolado/' + enc.idEncolado + '/' + config.testEmpresa, null)
                        .then(body => {
                            expect(body.code).to.equal(200)
                            done()
                        })
                        .catch(err => {
                            console.log("ERROR", err)
                            assert(false)
                            done()
                        })
                })
            this.timeout(30000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })
    })

    describe("API calls. DELETES", function () {

        it("DELETE '/encolado/:idEncolado/:idEmpresa'", function (done) {
            //En principio este endpoint está en desuso. Ahora utilizamos delete BorrarEncolado
            assert.equal(1, 1)
            done()
        })

        it("DELETE '/borrarEncolado/:idEncolado/:empresa'", function (done) {
            var Encolado = require('../app/models')[config.testNEmpresa].mod.encolado;
            var sequelize = require('../app/models')[config.testNEmpresa].seq;

            Encolado
                .findOne({
                    where: {idUsuario: config.testIdUsuario},
                    order: sequelize.literal('idEncolado DESC')
                })
                .then(enc => {
                    llamadaHTTP(token, 'DELETE', 'http://' + ipEncolado + ':3720/api/borrarEncolado/' + enc.idEncolado + '/' + config.testEmpresa, null)
                        .then(body => {
                            expect(body.code).to.equal(200)
                            done()
                        })
                        .catch(err => {
                            console.log("ERROR", err)
                            assert(false)
                            done()
                        })
                })
            this.timeout(30000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })
    })


}) //FIN describe('Encolado Microservice. Tests Unitarios')
/*
describe('Encolado Microservice. Tests Funcionales', function () {

    describe("LOGOUT", function (){

        it("PUT '/accionOperador'", function (done) {
            llamadaHTTP(token, 'PUT', 'http://' + ipEncolado + ':3720/api/accionOperador',
                'json=' + JSON.stringify({
                    "idUsuario": config.testIdUsuario,
                    "evento": "LOGOUT"
                }))
                .then(body => {
                    expect(body.code).to.equal(200)
                    console.log("Usuario DES-logado")
                    done()
                })
                .catch(err => {
                    console.log("ERROR", err)
                    assert(false)
                    done()
                })
            this.timeout(30000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })

    })

    describe("MECD-BECAS - LOGIN", function () {

        it("Encolado MECD-BECAS", function (done) {
            llamadaHTTP(token, 'POST', 'http://' + ipEncolado + ':3720/api/encolado',
                'json=' + JSON.stringify({
                    "idUsuario": config.testIdUsuario,
                    "nombreCola": "MECD-BECAS",
                    "fecha": new Date(),
                    "ext": config.testExtension
                }))

                .then(body => {
                    if (body.code != 200) {
                        assert(false)
                        done()
                    }
                    else {
                        llamadaHTTP(token, 'PUT', 'http://' + ipEncolado + ':3720/api/accionOperador',
                            'json=' + JSON.stringify({
                                "idUsuario": config.testIdUsuario,
                                "evento": "LOGIN"
                            }))

                            .then(body => {
                                expect(body.code).to.equal(200)
                                done()
                            })
                            .catch(err => {
                                assert(false)
                                done()
                            })
                    }
                })
                .catch(err => {
                    assert(false)
                    done()
                })
            this.timeout(30000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })
    })

    //Requiere de que ya esté en AYUNTAMIENTO.
    describe("ENTRANTES - DESCANSO - SALIENTES - REANUDA", function () {

        it("Enviamos al operador a DESCANSO", function (done) {
            llamadaHTTP(token, 'PUT', 'http://' + ipEncolado + ':3720/api/accionOperador',
                'json=' + JSON.stringify({
                    "idUsuario": config.testIdUsuario,
                    "evento": "DESCANSO"
                }))

                .then(body => {
                    expect(body.code).to.equal(200)
                    done()
                })
                .catch(err => {
                    assert(false)
                    done()
                })
            this.timeout(30000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })

        it("Movemos a MARCADOR (SALIENTES)", function (done) {
            var Encolado = require('../app/models')[config.testNEmpresa].mod.encolado;
            var sequelize = require('../app/models')[config.testNEmpresa].seq;

            Encolado
                .findOne({
                    where: {idUsuario: config.testIdUsuario, cola: "MECD-BECAS"},
                    order: sequelize.literal('idEncolado DESC')
                })
                .then(enc => {
                    llamadaHTTP(token, 'PUT', 'http://' + ipEncolado + ':3720/api/moverEncolado',
                        'json=' + JSON.stringify({
                            "idUsuario": config.testIdUsuario,
                            "empresa": config.testEmpresa,
                            "nombreCola": "MARCADOR",
                            "fecha": new Date(),
                            "ext": config.testExtension,
                            "idEncoladoBorrar": enc.idEncolado,
                        }))

                        .then(body => {
                            expect(body.code).to.equal(200)
                            done()
                        })
                        .catch(err => {
                            assert(false)
                            done()
                        })
                })
            this.timeout(30000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })

        it("REANUDAMOS al operador", function (done) {
            llamadaHTTP(token, 'PUT', 'http://' + ipEncolado + ':3720/api/accionOperador',
                'json=' + JSON.stringify({
                    "idUsuario": config.testIdUsuario,
                    "evento": "REANUDAR"
                }))

                .then(body => {
                    expect(body.code).to.equal(200)
                    done()
                })
                .catch(err => {
                    assert(false)
                    done()
                })
            this.timeout(30000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })

        it("Comprobamos que no esté en PAUSA en Asterisk", function (done) {
            llamadaHTTP(token, 'GET', 'http://' + ipAsterisk + ':3708/api/verColas/'+config.testEmpresa, null)

                .then(body => {
                    var found = false
                    for (var i = 0; i < body.data.length; i++) {
                        for (var j = 0; j < body.data[i].miembros.length; j++) {
                            if (body.data[i].miembros[j].miembro == config.testExtension) {
                                found = true
                            }
                        }
                    }
                    console.log("Aparece la ext del operador en las colas de asterisk?")
                    expect(found).to.equal(false)
                    done()
                })
                .catch(err => {
                    assert(false)
                    done()
                })
            this.timeout(30000); //subimos el timeout porque el 2000 por defecto se queda corto a veces.
        })

    })

}) //FIN describe('Encolado Microservice. Tests Funcionales’)
*/