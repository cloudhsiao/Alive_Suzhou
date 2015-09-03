var flow = require('nimble');
var readIp = require('./libs/readIp.js');

var ipArray = [];
var pingSet = [];

function readIpMapping() {
  readIp.read(__dirname + '/ipMapping.json', function(data){
    ipArray = JSON.parse(data);
  });
}

flow.series([
  // 1. first of all, we read all ip from the file.
  function(callback) {
    readIp.read(__dirname + '/ipMapping.json', function(data){
      ipArray = JSON.parse(data);
      callback();
    });
  },
  function(callback) {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    callback();
  }
]);
