var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var child_process = require('child_process');s
var email = require('emailjs');
var app = require('app.js');

var errorRate = 0.0;
var errerAlert = 0.30;
var mailServer = email.server.connect({
  user: "freeman@zhenhai.com.tw",
  password: "aaaa9881#",
  host: "www.zhenhai.com.tw",
  ssl: false
});


console.log("Alive server start.");

app.use(express.static(__dirname + '/javascript'));
app.use(express.static(__dirname + '/images'));


app.get('/pic', function(req, res) {
  res.sendFile(__dirname + 'boxStatusPic.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');

/*
  socket.on('errorRate', function(msg) {
    errorRate = msg;
    console.log("errorRate: " + errorRate);
  });
*/

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(9999, function() {
  console.log('listening on 9999');
});

app.start(function(ipArray, dailySum) {
  console.log('!!!!!!!!!!!!!!!!!!' + ipArray);
  console.log('!!!!!!!!!!!!!!!!!!' + dailySum);
});

function sendMail(msg) {
  mailServer.send(
    {
      text:msg,
      from: "ZhenHai 機台存活率檢查 <freeman@zhenhai.com.tw>",
      to: "z_h_e_n_h_a_i@mailinator.com",
      subject: "台容 謝崗廠 機台存活率過低"
    },
    function(err, msg) {
      console.log("err: " + err || msg);
    }
  );
}

function checkErrorRate() {
  if (errorRate > errerAlert) {
    sendMail("出錯機台 " + (errorRate* 100) + " %");
  }
}

//setInterval(checkErrorRate, 300000);
