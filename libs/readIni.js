module.exports = function(callback){
  var ini = require('node-ini');
  ini.parse(__dirname + '/config.ini', function(err,data) {
    if(err) {
      console.log(err)
    } else {
      //console.log(data)
      callback(data);
    }
  });
};
