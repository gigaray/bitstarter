#!/usr/bin/env node

/*

Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var rest = require('restler');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";


// assertURLexists verifies if the URL existss
// if it does exist return the stringified URL
var assertURLExists = function(inURL) {

    var inURLstr = inURL.toString();

//    console.log ('trying to get %s ...', inURLstr);

    rest.get(inURLstr).on('complete', function(result) {
	if (result instanceof Error) {
	      console.log(' error:  ' + result.message);
	      this.retry(8000);           
	}
    });

//   console.log('... success !!');

    return inURLstr;
}

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var checkURLPath = function(urlContents, checksfile) {
    $ = cheerio.load(urlContents);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for (var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;

}

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <URL>', 'URL Path', clone(assertURLExists))
        .parse(process.argv);

    var checkJson;
    var outJson;

//    console.log('routed via ' + (program.url ? "URL" : "HTML" ));

    if (program.url) {

	rest.get(program.url).on('complete', function(result) {

	      fs.writeFileSync('hw3Temp.buf', result);

//	      var checkJSON = checkURLPath(program.url, program.checks);
//		checkURLPath does not seem to work, hence download the data to a
//		local temp file and then check that file using the provided func

	      var checkJSON = checkHtmlFile('hw3Temp.buf', program.checks);

	      var outJSON = JSON.stringify(checkJSON, null, 4);

//	      console.log(' -->  %s  <-- ', outJSON);

	      console.log('%s', outJSON);

	      fs.unlinkSync('hw3Temp.buf');
	});

	
    }
    else {

    	var checkJson = checkHtmlFile(program.file, program.checks);

	var outJson = JSON.stringify(checkJson, null, 4);

   	console.log(' -++-> %s <-++- ', outJson);
    }
 
   
} else {

    exports.checkHtmlFile = checkHtmlFile;

}
