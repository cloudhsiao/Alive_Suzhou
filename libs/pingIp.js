var ping = require('net-ping');
var options = {
  networkProtocol: ping.NetworkProtocol.IPv4,
  packetSize: 12,
  retries: 0,
  sessionId: (process.pid % 65535),
  timeout: 500,
  ttl: 128
};
var session = ping.createSession(options);
var pingSet = []; // where are all IPs that we need to ping.

var iniRead = require('./readIni.js')(
  function(iniData) {
    initIpArray(iniData.ipRange1.range, iniData.ipRange1.upper, iniData.ipRange1.lower, iniData.ipRange1.ignore);
    initIpArray(iniData.ipRange2.range, iniData.ipRange2.upper, iniData.ipRange2.lower, iniData.ipRange2.ignore);


    //setInterval(checkAlive, 7000);
    //setInterval(getAliveResult, 10000, iniData.errorTimes);

    setInterval(checkAlive, iniData.pingTime);
    setInterval(getAliveResult, iniData.checkTime, iniData.errorTimes);
  }
);

function initIpArray(ipRange, upper, lower, ignoreIPs) {
  for(var x = parseInt(lower); x <= parseInt(upper); x++ ) {
    pingSet[ipRange + x] = 0;
  }
  for(var x = 0; x < ignoreIPs.length; x++) {
    delete pingSet[ipRange + ignoreIPs[x]]
  }
}

function checkAlive() {
  console.log('checkAlive');
  for(var ip in pingSet) {
    setTimeout(pingHost(ip), 1000);
  }
}

function pingHost(host) {
  session.pingHost(host, function(err, ip) {
    if (err) {
      pingSet[ip] = 1;
    } else {
      pingSet[ip] = 0;
    }
  });

}

function getAliveResult(errorTimes) {
  var failedIp = [];
  for(var ip in pingSet) {
    if(pingSet[ip] >= errorTimes) {
      var data = {};
      data['IP'] = ip;
      // only return failed IPs.
      failedIp.push(data);
    }
  }
  process.send(failedIp);
}
