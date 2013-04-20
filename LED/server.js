var http = require('http');
var fs = require('fs');
var exec = require("child_process").exec;
var url = require('url');
var gpioDir = '/sys/class/gpio/';
var outputPin = '18';

child = exec('echo "18" > /sys/class/gpio/export',
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});