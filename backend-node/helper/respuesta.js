module.exports = function respuesta(req, res, code, data, message, error){

    var Error = require("../models").error

    var url = req.path.split('/')[1];
    var method = req.method;
    //console.log(method + ' ' + url + ' ->  code: ' + code + ', data: ' + data + ', message: ' + message);

    switch (error) {
        case 1: {
            var error = new Error({code: code, method: method, url: url, message: message, error: data, date: new Date()});
            error.save(function (err, entity) {
                if (err) return console.error(err);
                console.log(entity)
            });
            break
        }

        default: {
        }
    }

    res.json({code: code, data: data, message: message});

};