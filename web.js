var fs = require('fs');

var express = require('express');

var app = express.createServer(express.logger());

var data;

app.use(express.static(__dirname + '/res'));

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

var port = process.env.PORT || 8080;

app.listen(port, function() {

  console.log("Listening on " + port);

});
