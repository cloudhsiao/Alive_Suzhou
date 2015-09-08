var fs = require('fs');

exports.read = function(file, callback) {
  fs.readFile(file, 'utf8', function(err, data) {
    if(err) {
      console.log('ReadIpFile err: ' + err);
      throw err;
    }
    callback(data);
  });
}
