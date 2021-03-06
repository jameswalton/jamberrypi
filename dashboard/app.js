var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
var fileLocation = '/sys/bus/w1/devices/28-000003b74282/w1_slave';

app.listen(8124);

function getTemperature() {
  fs.readFile(fileLocation, 'utf8', function(err, data) {
    if (err) throw err;
    matches = data.match(/t=([0-9]+)/);
    temperatureC = parseInt(matches[1]) / 1000;
    temperatureF = ((temperatureC * 1.8) + 32).toFixed(3);
    socket.emit('temperature', { celcius: temperatureC, fahrenheit: temperatureF });
  });
};

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    io.sockets.on('connection', function (socket) {
      getTemperature();
    });
    res.writeHead(200);
    res.end(data);
  });
}
io.sockets.on('connection', function (socket) {
  setInterval(function() {
    getTemperature();
  }, 5000);
});
