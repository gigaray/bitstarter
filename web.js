var fs = require('fs');

var express = require('express');

var app = express.createServer(express.logger());

var buf;

app.get('/', function(request, response) {

   fs.readFile('./index.html', function(err,data) {

	if (err) {
		throw err;
	}

	buf = data;

     	console.log(buf);
  });

  response.send(buf.toString());

});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
