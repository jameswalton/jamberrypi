var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
var fileLocation = '../temperature/w1_slave';

app.listen(8888);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    io.sockets.on('connection', function (socket) {
      fs.readFile(fileLocation, 'utf8', function(err, data) {
        if (err) throw err;
        matches = data.match(/t=([0-9]+)/);
        temperatureC = parseInt(matches[1]) / 1000;
        temperatureF = ((temperatureC * 1.8) + 32).toFixed(3);
        socket.emit('temperature', { celcius: temperatureC, fahrenheit: temperatureF });
      });
    });
    res.writeHead(200);
    res.end(data);
  });
}
io.sockets.on('connection', function (socket) {
  setInterval(function() {
    fs.readFile(fileLocation, 'utf8', function(err, data) {
      if (err) throw err;
      matches = data.match(/t=([0-9]+)/);
      temperatureC = parseInt(matches[1]) / 1000;
      temperatureF = ((temperatureC * 1.8) + 32).toFixed(3);
      socket.emit('temperature', { celcius: temperatureC, fahrenheit: temperatureF });
    });
  }, 5000);
});