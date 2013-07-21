var fs = require('fs');

var express = require('express');

var app = express.createServer(express.logger());

var data;

app.get('/', function(request, response) {

   fs.readFile('./index.html', "utf8", function(err,data) {

	if (err) {
		console.log("failed ..");
		throw err;
	}

     	console.log(data);

	response.send(data);
  });


});

var port = process.env.PORT || 5000;

app.listen(port, function() {

  console.log("Listening on " + port);

});
