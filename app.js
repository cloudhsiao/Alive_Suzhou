var flow = require('nimble');
var child_process = require('child_process');

var readIp = require('./libs/readIp.js');
var dbStatus = require('./libs/dbStatus.js');
var pingIp = child_process.fork('./libs/pingIp.js');

var ipArray = []; // data from ipMapping.json
var pingResult; // data from pingIp.js


//function readIpMapping() {
//  readIp.read(__dirname + '/ipMapping.json', function(data){
//    ipArray = JSON.parse(data);
//  });
//}

flow.series([
  // 1. first of all, we read all ip from the file.
  function(callback) {
    readIp.read(__dirname + '/ipMapping.json', function(data){
      ipArray = JSON.parse(data);
      callback();
    });
  },
  // 2. get ping data.
  function(callback) {
    var idx; 
    pingIp.on('message', function(m) {
      for(idx = 0; idx < m.length; idx++) {
        console.log('>>>>>' + m[idx].IP + '>>>>>' + m[idx].ALIVE + '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        var data = ipArray.filter(function(obj) {
          return obj.IP === m[idx].IP;
        });
        if (data.length > 0) {
          ipArray[idx].ALIVE = 0;
          console.log('<<<<<' + ipArray[idx].IP + '<<<<<' + ipArray[idx].ALIVE);
        } else {
          ipArray[idx].ALIVE = 1;
          console.log('<<<<!' + ipArray[idx].IP + '<<<<<' + ipArray[idx].ALIVE);
        }
      }
/*
      for(idx = 0; idx < ipArray.length; idx++) {
        console.log('<<<<<' + ipArray[idx].IP + '<<<<<' + ipArray[idx]);
      }
*/
    });
    callback();
  },
  // 3. get machine status
  function(callback) {
    dbStatus.getStatus(function() {
      console.log(result);
    });
  }
]);
