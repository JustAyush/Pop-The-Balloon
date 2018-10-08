
var socket;
var balloons = [];
var b;
var canvas;
var welcome = false;
var scoreDisplay = [];

function setup(){
  canvas = createCanvas(0.72*windowWidth, windowHeight);
  canvas.position(windowWidth/7, 0);
  background(0);

  // scoreDisplay = createP(' ');
  // scoreDisplay.position(10, 10);

  socket = io.connect('http://localhost:8000');
  socket.on('greet', function(data){
    for(let i=0; i<data.length; i++){
      //console.log(data[i].name + " " + data[i].score);
      if(scoreDisplay.length > 0)
        scoreDisplay[i].html(data[i].name + " " + data[i].score);
      }
  });

  socket.on('welcome', function(data){
    b = new Balloon(data.x, data.y, data.r);
    balloons.push(b);
  //  balloons[0].show();
    welcome = true;
  });


  socket.on('remove',
    function(data){
        balloons.splice(data, 1);
  });

  // socket.on('YourScore',
  //   function(data){
  //     scoreDisplay.html(data);
  //   }
  // );

  socket.on('createP',
    function(data){
      for(let i=0; i<data; i++){
        var s = createP(' ');
        scoreDisplay.push(s);
      }
    });

  socket.on('ready',
    function(data){
      if(data)
        toggleModal();
        play = true;
    }
  );

  socket.on('reset',
  function(data){
    console.log("Reset");
    for(let i=0; i<scoreDisplay.length; i++)
      scoreDisplay[i].remove();
    scoreDisplay.splice(0, scoreDisplay.length);
    resetGame();
  });


}

function draw(){
  background(0);
  // for(let i=0; i<5; i++){
  //   noStroke();
  //   fill(255);
  //   ellipse(balloons[i].x, balloons[i].y, 2*balloons[i].r);
  // }
  if(play){
  if(welcome){
    for(let i=0; i<balloons.length; i++){
      balloons[i].show();
    }
  }
  }
}

// function fillBalloons(){
//   for(let i=0; i<totalBalloons; i++){
//     var balloon = {
//       x : random(30,(width-30)),
//       y : random(30,(height-30)),
//       r : random(20, 35)
//     };
//
//     var overlapping = false;
//     for(let j=0; j<b.length; j++){
//       var other = b[j];
//       var d = dist(balloon.x, balloon.y, other.x, other.y);
//       if(d < balloon.r + other.r){
//         overlapping = true;
//         totalBalloons++;
//         break;
//       }
//     }
//
//     if(!overlapping){
//       b.push(balloon);
//     }
//   }
//   for(let i=0; i<b.length; i++){
//     balloons[i] = new Balloon(b[i].x, b[i].y, b[i].r);
//   }
// }

function mousePressed(){
  for(let i=(balloons.length-1); i>=0; i--){
  if(balloons[i].clicked(mouseX, mouseY)){
    socket.emit('remove', i);
    }

  }

}

// function starting(){
//   socket.emit('drawBackground', 'Clear the bkd');
//   for(let i=0; i<balloons.length; i++){
//     var data = {
//       x: balloons[i].x,
//       y: balloons[i].y,
//       r: balloons[i].r
//     };
//     socket.emit('balloonArray', data);
//   }
// }

  // var data = {
  //   x: mouseX,
  //   y: mouseY
  // };
  // socket.emit('mouse', data);
  // noStroke();
  // fill(255);
  // ellipse(mouseX, mouseY, 60, 60);



  // socket.on('drawBackground',
  //   function(data){
  //     background(0);
  // });
  //
  // socket.on('balloonArray',
  //   function(data){
  //     noStroke();
  //     fill(255);
  //     ellipse(data.x, data.y, data.r);
  //   }
  // );
  //
  // socket.on('splice',
  //   function(data){
  //     console.log(data);
  //   });
