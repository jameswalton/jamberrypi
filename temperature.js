var http = require('http');
var fs = require('fs');
var url = require('url');
var fileLocation = '/sys/bus/w1/devices/28-000003b74282/w1_slave';

http.createServer(function (req, res) {
  var request_url = url.parse(req.url).pathname;
	
  if (request_url == '/temperature') {
    fs.readFile(fileLocation, 'utf8', function(err, data) {
      if (err) throw err;
      matches = data.match(/t=([0-9]+)/);
      temperature = parseInt(matches[1]) / 1000;
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(temperature + 'c' + '\n');
    });
  } else if (request_url == '/temperature.json') {
    fs.readFile(fileLocation, 'utf8', function(err, data) {
      if (err) throw err;
      matches = data.match(/t=([0-9]+)/);
      temperatureC = parseInt(matches[1]) / 1000;
      temperatureF = ((temperatureC * 1.8) + 32).toFixed(3);
      output = '{ "temperature": { "celcius": '+ temperatureC +', "fahrenheit": '+ temperatureF +' } }';
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(output);
    });
  } else {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('No route');
  }
}).listen(8124, "192.168.0.12");

console.log('Server running on port 8124');