
var express = require('express');

var app = express();
var server = app.listen(8000);

app.use(express.static('public'));

var socket = require('socket.io');
var io = socket(server);

var balons = [];
var count = 1;
var countforPlayer = 1;
var players = [];
var playerAdded = false;
var firstPlayer = true;
var hb;

function player(id, name, score){
  this.id = id;
  this.name = name;
  this.score = score;
}

for(let i=0; i<10; i++){
  var b= {
    x: getRandom(200, 600),
    y: getRandom(0, 500),
    r: getRandom(30, 40)
  };
  balons.push(b);
}

io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log('New connection ' + socket.id);

    for(let i=0; i<balons.length; i++){
      var bSend = {
        x: balons[i].x,
        y: balons[i].y,
        r: balons[i].r
      }
      io.to(socket.id).emit('welcome', bSend);

      socket.on('player',
        function(data){
          if(countforPlayer<9){
            countforPlayer++;
          }
          else{
            var p = new player(socket.id, data, 0);
            console.log(p);
          //  socket.emit('createP', "CreateP");
            players.push(p);
            //playerAdded = true;
            countforPlayer = 1;

          }
        }
      );

      socket.on('remove',
      function(data){
        if(count<=9)
          count++;
        else{
          io.sockets.emit('remove', data);
          balons.splice(data, 1);
          count = 1;
          //var currentp;
          for(let i=0; i<players.length; i++){
            if(socket.id == players[i].id)
              players[i].score++;
          }
          if(balons.length == 0)
            reset();
          }
        });

        socket.on('ready',
          function(data){
            //after 10 secs, it should return true
            if(firstPlayer){
              setTimeout(readySignal, 10000);
              firstPlayer = false;
            }
          });
        function readySignal(){
          io.sockets.emit('ready', true);
          sendBeat();
        }
        function sendBeat(){
          hb = setInterval(heartbeat, 1000);
          io.sockets.emit('createP', players.length );
          function heartbeat(){
            io.sockets.emit('greet', players);
          }
        }


      }

    function reset(){
      io.sockets.emit('leaderboard', players);
      players.splice(0, players.length);
      // for(let i=0; i<players.length; i++){
      //   players[i].score = 0;
      // }
      clearInterval();
      count = 1;
      countforPlayer = 1;
      playerAdded = false;
      firstPlayer = true;
      for(let i=0; i<10; i++){
        var b= {
          x: getRandom(200, 600),
          y: getRandom(20, 500),
          r: getRandom(30, 40)
        };
        balons.push(b);
      }
      io.sockets.emit('reset', "reset");
      for(let i=0; i<balons.length; i++){
        var bSendReset = {
          x: balons[i].x,
          y: balons[i].y,
          r: balons[i].r
        }
      io.sockets.emit('welcome', bSendReset);
      }
      console.log("reset");
    }

    }

console.log('Server is running');




function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
