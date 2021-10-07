var player;
var socket;
var players = [];
var projectiles = [];
var zoom = 1;
var gameStarted = 0;
var gamemap

//Runs when first connected to the webpage
function setup() {
  socket = io.connect('http://localhost:5000'  );// Change to if pushing to heroku 'https://hidden-reef-26635.herokuapp.com/' http://localhost:5000
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER)
  gamemap = new GameMap();
  gamemap.preload()
  // changed start angle to 0
  player = new Player("", 32, 32, 0);
  player.preload()
}


//Is called after the button on the homepage is pressed
//Generates a play
//Creates a variable containing the player data and sends it to the server
function startGame(usernameInput) {
  console.log(usernameInput);

  player.setUsername(usernameInput);

  var data = {
    username: usernameInput,
    x: player.pos.x,
    y: player.pos.y,
    dir: player.dir
  };
  console.log('--------------------------startgame ran')
  socket.emit('start',data);
  gameStarted = 1;
  //Updates player list when new information is sent to the server
  socket.on('heartbeat',
    function(data) {
      players = data.players;
      projectiles = data.projectiles;
      //console.log(data)
    }
  )
  socket.on("disconnect", (reason) => {
    if (reason === "io server disconnect") {
      // the disconnection was initiated by the server, you need to reconnect manually
      //socket.connect();
    }
    console.log(reason)
    // else the socket will automatically try to reconnect
  });
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

    //Adjust the backgroun based on the players inputs
    background(0);
    for (var i = players.length - 1; i >= 0; i--) {
      var id = players[i].id;
      if (id === socket.id) {
        player.pos = createVector(players[i].x,players[i].y) //{x: players[i].x,y:players[i].y}
        player.dir = players[i].dir
        player.health = players[i].health
        break;
      }
    }
    translate(width / 2, height / 2);
    translate(-player.pos.x, -player.pos.y);
    //camera(player.pos.x, player.pos.y, 1000, player.pos.x, player.pos.y, 0, 0, 1, 0);

    // Create game map background
    gamemap.display()

    //Displays every other ship other than the players boat
    for (var i = players.length - 1; i >= 0; i--) {
      var id = players[i].id;
      if (id !== socket.id) {
        showship(
          players[i].dir,
          players[i].x,players[i].y,
          player.img_boat,
          players[i].username,players[i].size,
          players[i].health,[]
        )
        //fill(0,0,255);
        //ellipse(players[i].x,players[i].y,64,64)// players[i].dir,players[i].dir);
        //fill(255);
        //textAlign(CENTER);
        //textSize(12);
        //text(players[i].username, players[i].x, players[i].y + players[i].dir*1.5);
        ////health bar
        //fill(100,63)
        ////base
        //rect(players[i].x-players[i].size/2, players[i].y-players[i].size/2-20,players[i].size,10);
        ////health
        //fill(0,220,0)
        //rect(players[i].x-players[i].size/2, players[i].y-players[i].size/2-20,players[i].size*abs(players[i].health)/100,10);
      }
      else{
        player.show()
      }
    }


    //player.show(); //displays the player
    //player.update(); //updates the players position based on user input
    //player.constrain(); //stops the user from going outside the map

    for (var i = 0;i<projectiles.length;i++){
      cannonballshow(projectiles[i].pos,projectiles[i].diameter)
    }
  }
}

function mouseClicked() {
  if(gameStarted){
    var data = {
      pressedkeycode:"mouse",
      targetX:mouseX - width / 2,
      targetY:mouseY - height / 2,
    }
    socket.emit('updatepressed',data)
  }
}
function keyPressed(){
  if(gameStarted){
    //if (keyCode === K_Space){
    if(keyIsDown(K_W) || keyIsDown(K_A) || keyIsDown(K_S) || keyIsDown(K_D)){
      data = {
        pressedkeycode: keyCode
      }
      socket.emit('updatepressed',data)
    }
  }
}
function keyReleased(){
  if (gameStarted){
    data = {releasedkeycode:keyCode}
    socket.emit('updatereleased',data)
  }
}
