var ini = require('node-ini');

module.exports = function(callback){
  ini.parse(__dirname + '/config.ini', function(err,data) {
    if(err) {
      console.log(err)
    } else {
      callback(data);
    }
  });
};
