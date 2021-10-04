var player;
var socket;
var players = [];
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
  player = new Player(usernameInput, 32, 32, 16);

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
function draw() {
  if (gameStarted == 1) {

    //Adjust the backgroun based on the players inputs
    background(0);
    translate(width / 2, height / 2);
    var newzoom = 64 / player.r;
    zoom = lerp(zoom, newzoom, 0.1);
    scale(zoom);
    translate(-player.pos.x, -player.pos.y);

    // Create game map background
    gamemap.display()

    //Displays every other ship other than the players boat
    for (var i = players.length - 1; i >= 0; i--) {
      var id = players[i].id;
      if (id !== socket.id) {
        fill(0,0,255);
        ellipse(players[i].x,players[i].y,players[i].dir*2,players[i].dir*2);
        fill(255);
        textAlign(CENTER);
        textSize(12);
        text(players[i].username, players[i].x, players[i].y + players[i].dir*1.5);
      }
    }
    
    
    player.show(); //displays the player
    player.update(gamemap); //updates the players position based on user input
    player.constrain(); //stops the user from going outside the map



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