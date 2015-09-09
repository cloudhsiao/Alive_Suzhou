var flow = require('nimble');
var child_process = require('child_process');

var readIni = require('./libs/readIni.js');
var readIp = require('./libs/readIp.js');
var pingIp = child_process.fork('./libs/pingIp.js');
var dbStatus = require('./libs/dbStatus.js');
var dbQty = require('./libs/dbQty.js');

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
    console.log('111111111111111111111111111111111111111111111111111111111111');
    readIp.read(__dirname + '/ipMapping.json', function(data){
      ipArray = JSON.parse(data);
      callback();
    });
  },
  //function(callback) {
  //  readIni(function(data) {
  //    console.log(data);
  //  });
  //},
  // 2. get ping data.
  function(callback) {
    console.log('222222222222222222222222222222222222222222222222222222222222');
    pingIp.on('message', function(m) {
      var idx;
      for(idx = 0; idx < ipArray.length; idx++) {
        //console.log('>>>>>' + m[idx].IP + '>>>>>' + m[idx].ALIVE + '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        var data = m.filter(function(obj) {
          return obj.IP === ipArray[idx].IP;
        });
        if (data.length > 0) { // if have data! it must be NOT alive -> 0 (false)
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
    console.log('333333333333333333333333333333333333333333333333333333333333');
    dbStatus.getStatus(function(result) {
      //console.log(result);
      var idx;
      for(idx = 0; idx < ipArray.length; idx++) {
        var data = result.filter(function(obj) {
          return obj.ID === ipArray[idx].ID;
        });
        if(data.length > 0) {
          ipArray[idx].STATUS = data[0].STATUS;
          console.log('STATUS: ' + ipArray[idx].ID + '-->' + ipArray[idx].STATUS);
        }
      }
      callback();
    });
  },
  // 4. get machine qty (for good product count)
  function(callback) {
    console.log('444444444444444444444444444444444444444444444444444444444444');
    dbQty.getQty(function(result) {
      //console.log(result.length);
      var idx;
      for(idx = 0; idx < ipArray.length; idx++) {
        var data = result.filter(function(obj) {
          return obj.ID === ipArray[idx].ID;
        });
        if(data.length > 0) {
          ipArray[idx].QTY = data[0].QTY;
          console.log('QTY: ' + ipArray[idx].ID + '-->' + ipArray[idx].QTY);
        }
      }
      callback();
    });
  }
]);
