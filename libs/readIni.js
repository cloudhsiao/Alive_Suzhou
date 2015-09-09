var ini = require('node-ini');

module.exports = function(callback){
  ini.parse('./libs/config.ini', function(err,data) {
    if(err) {
      console.log(err)
    } else {
      callback(data);
    }
  });
};
