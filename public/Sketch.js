var player;
var socket;
var players = [];
var zoom = 1;

function setup() {
  socket = io.connect('http://localhost:5000'  );// Change to if pushing to heroku 'https://hidden-reef-26635.herokuapp.com/' 
  createCanvas(600, 600);

  player = new Player(random(width), random(height), 64);
  var data = {
    x: player.pos.x,
    y: player.pos.y,
    dir: player.dir
  };
  socket.emit('start',data);


}

function draw() {
  background(0);

  translate(width / 2, height / 2);
  var newzoom = 64 / player.r;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-player.pos.x, -player.pos.y);

  for (var i = players.length - 1; i >= 0; i--) {
    var id = players[i].id;
    if (id !== socket.id) { //.substring(2, id.length)
      fill(0,0,255);
      ellipse(players[i].x,players[i].y,players[i].dir*2,players[i].dir*2);

      fill(255);
      textAlign(CENTER);
      textSize(12);
      text(players[i].id, players[i].x, players[i].y + players[i].dir*1.5);
    }
  }
  
  player.show();
  player.update();
  player.constrain();

  socket.on('heartbeat',
    function(data) {
        console.log(data);
        players = data;
    })

  var data = {
    x: player.pos.x,
    y: player.pos.y,
    dir: player.dir
  };
  socket.emit('update',data);
}