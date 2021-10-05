var player;
var socket;
var players = [];
var projectiles = [];
var zoom = 1;
var gameStarted = 0;


//Runs when first connected to the webpage
function setup() {
  socket = io.connect('http://localhost:5000'  );// Change to if pushing to heroku 'https://hidden-reef-26635.herokuapp.com/' 
  createCanvas(600, 600);
  gamemap = new GameMap();
  gamemap.preload()
}


//Is called after the button on the homepage is pressed
//Generates a play
//Creates a variable containing the player data and sends it to the server
function startGame(usernameInput) {
  console.log(usernameInput);
  player = new Player(usernameInput, 64, 64, 16);

  var data = {
    username: usernameInput,
    x: player.pos.x,
    y: player.pos.y,
    dir: player.dir
  };
  socket.emit('start',data);
  gameStarted = 1;
}


//If the game has started draws all players on the screen
//
let K_W = 87;
let K_A = 65;
let K_S = 83;
let K_D = 68;
let K_Space = 32;
function draw() {
  if (gameStarted == 1) {

    if (keyIsDown(K_W)){
      player.yacc = -0.5
      console.log(player.xacc)
    } else if (keyIsDown(K_A)){
      player.xacc = -0.5
    } else if (keyIsDown(K_S)){
      player.yacc = 0.5
    } else if (keyIsDown(K_D)){
      player.xacc = 0.5  
    }

    //Adjust the backgroun based on the players inputs
    background(0);
    translate(width / 2, height / 2);
    //var newzoom = 64 / player.r;
    //zoom = lerp(zoom, newzoom, 0.1);
    //scale(zoom);
    translate(-player.pos.x, -player.pos.y);
    
    //camera(player.pos.x, player.pos.y, 1000, player.pos.x, player.pos.y, 0, 0, 1, 0);

    // Create game map background
    gamemap.display()

    //Displays every other ship other than the players boat
    for (var i = players.length - 1; i >= 0; i--) {
      var id = players[i].id;
      if (id !== socket.id) {
        fill(0,0,255);
        ellipse(players[i].x,players[i].y,players[i].dir,players[i].dir);
        fill(255);
        textAlign(CENTER);
        textSize(12);
        text(players[i].username, players[i].x, players[i].y + players[i].dir*1.5);
      }
    }
    
    player.show(debug=true); //displays the player
    player.update(gamemap); //updates the players position based on user input
    //player.constrain(); //stops the user from going outside the map


    for (var i = 0;i<projectiles.length;i++){
      // to be moved to serverside
      this.projectiles[i].update()
      // keep
      this.projectiles[i].show()
    }

    //Updates player list when new information is sent to the server
    socket.on('heartbeat',
      function(data) {
          players = data;
      })

    //packages new player data then sends to the server
    var data = {
      x: player.pos.x,
      y: player.pos.y,
      dir: player.dir
    };
    socket.emit('update',data); 
  }
}

function keyPressed(){
  if (keyCode === K_Space){
    //console.log("FIRE")
    cannonball = player.tryfire()
    projectiles.push(cannonball)
  }
}
function keyReleased(){
  //console.log('---------------------------\n  RELEASED \n -----------------------------------')
  if (keyCode === K_W || keyCode === K_S){
    player.yacc = 0
  } else if (keyCode === K_A || keyCode === K_D){
    player.xacc = 0
  }
}