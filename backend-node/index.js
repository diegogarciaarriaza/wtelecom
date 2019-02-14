'use strict'

var app = require('./app');
var port = 5001;

app.listen(port, function(){
    console.log("Backend running at port " + port)
});
