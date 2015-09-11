var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var objectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/zhenhai';

var dataStatus = [];

exports.getStatus = function (callback) {
  var now = new Date();
  var time = ( new Date( now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate() ) ).getTime() / 1000;

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    var collection = db.collection('machineStatus');

    var result = [];
    var stream = collection.find({'lastUpdateTime': { '$gte': time}}).stream();
    stream.on("data", function(doc) {
      var item = {};
      item["ID"] = doc.machineID;
      item["STATUS"] = doc.status;
      result.push(item);
    });

    stream.on("end", function() {
      db.close();
      callback(result);
    });
  });
};
