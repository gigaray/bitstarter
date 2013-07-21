var fs = require('fs');

var express = require('express');

var app = express.createServer(); 

app.use(express.logger());

var buf = new Buffer();

app.get('/', function(request, response) {

   response.send(readFileSync("./index.html","utf8").toString());

  });

var port = process.env.PORT || 5000;

app.listen(port, function() {

  console.log("Listening on " + port);

});
