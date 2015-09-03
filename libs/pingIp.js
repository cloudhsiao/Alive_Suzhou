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
var pingSet = [];

var iniRead = require('./readIni.js')(
  function(iniData) {
    initIpArray(iniData.ipRange1.range, iniData.ipRange1.upper, iniData.ipRange1.lower, iniData.ipRange1.ignore);
    initIpArray(iniData.ipRange2.range, iniData.ipRange2.upper, iniData.ipRange2.lower, iniData.ipRange2.ignore); 
  }
);

function initIpArray(ipRange, upper, lower, ignoreIPs) {
  for(var x = parseInt(lower); x <= parseInt(upper); x++ ) {
    pingSet[ipRange + x] = 0;
  }
  for(var x = 0; x < ignoreIPs.length; x++) {
    delete pintSet[ipRange + ignoreIPs[x]]
  }
}
