var player;
var socket;
var zoom = 1;
var gameStarted = 0;

// DATA VARIABLES
var players = [];
var projectiles = [];
var treasures = [];

// RENDER OBJECT VARIABLES
var gamemaprender;
var treasurerender;

//Runs when first connected to the webpage
function setup() {
  socket = io.connect('http://localhost:5000'  );// Change to if pushing to heroku 'https://hidden-reef-26635.herokuapp.com/' http://localhost:5000
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER)


  // changed start angle to 0
  player = new PlayerRender();
  player.preload()

  gamemaprender = new GameMapRender();
  gamemaprender.preload();

  treasurerender = new TreasureRender();
  treasurerender.preload();

  // Volume sliders
  music_slider = createSlider(0, 0.5, 0.1, 0.01)
  music_slider.position(10, 10);

  sfx_slider = createSlider(0, 0.5, 0.1, 0.01)
  sfx_slider.position(10, 30);

}


//Is called after the button on the homepage is pressed
//Generates a play
//Creates a variable containing the player data and sends it to the server
function startGame(usernameInput) {
  console.log(usernameInput);

  player.setUsername(usernameInput);

  console.log('--------------------------startgame ran')
  socket.emit('start', {
    username:usernameInput,
  });

  // Must receive map before beginning game
  socket.once('client_start',
    function(data) {
      player.load_player(data.player);
      gamemaprender.load_map(data.gamemap);
      treasurerender.first_load(data.gamemap);
      gameStarted = 1;

      // Begin music
      player.music.loop();
    }
  )


  //Updates player list when new information is sent to the server
  socket.on('heartbeat',
    function(data) {
      players = data.players;
      projectiles = data.projectiles;
      treasurerender.load_treasure(data.treasurelist);
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
        player.gold = players[i].gold
        player.OnTreasure = players[i].OnTreasure
        player.SpaceCounter = players[i].SpaceCounter
        player.SpacePressed = players[i].SpacePressed
        break;
      }
    }
    translate(width / 2, height / 2);
    translate(-player.pos.x, -player.pos.y);
    //camera(player.pos.x, player.pos.y, 1000, player.pos.x, player.pos.y, 0, 0, 1, 0);

    // RENDERING
    gamemaprender.display()
    treasurerender.display()

    // VOLUME UPDATING
    player.music_vol(music_slider.value())
    player.sfx_vol(sfx_slider.value())

    //Displays every other ship other than the players boat
    for (var i = players.length - 1; i >= 0; i--) {
      var id = players[i].id;
      if (id !== socket.id) {
        showship(
          players[i].dir,
          players[i].x,
          players[i].y,
          player.img_boat,
          players[i].username,
          players[i].size,
          players[i].health,[],
          players[i].gold,
          players[i].OnTreasure, 
          players[i].SpaceCounter, 
          players[i].SpacePressed
        )
      }
      else{
        player.show()
      }
    }


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
    player.tryfire()
  }
}
function keyPressed(){
  if(gameStarted){
    //if (keyCode === K_Space){
    if(keyIsDown(K_W) || keyIsDown(K_A) || keyIsDown(K_S) || keyIsDown(K_D) || keyIsDown(K_Space)){
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
