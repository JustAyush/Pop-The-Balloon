
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

function player(id, name, score){
  this.id = id;
  this.name = name;
  this.score = score;
}

for(let i=0; i<5; i++){
  var b= {
    x: getRandom(0, 500),
    y: getRandom(0, 500),
    r: 20
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
          if(countforPlayer<4){
            countforPlayer++;
          }
          else{
            var p = new player(socket.id, data, 0);
            console.log(p);
            socket.emit('createP', "CreateP");
            players.push(p);
            playerAdded = true;
            countforPlayer = 1;
          }
        }
      );

      socket.on('remove',
      function(data){
        if(count<=4)
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
          //currentp.score++;
          //io.to(socket.id).emit('YourScore', currentp.score);
          }
        });
    }
}

console.log('Server is running');

setInterval(heartbeat, 1000);
function heartbeat(){
  io.sockets.emit('greet', players);
  if(playerAdded){
      io.sockets.emit('createP', "CreateP");
  }
  playerAdded = false;
}


function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
