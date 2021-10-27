var player
var socket
var zoom = 1
var gameStarted = 0


var state
var render

var leaderBoard_update_counter = 1000

//Runs when first connected to the webpage

var div


function setup() {

  frameRate(60)

  createCanvas(windowWidth, windowHeight)
  imageMode(CENTER)


  state = new State()
  render = new Render()

  // Volume sliders
  music_slider = createSlider(0, 0.5, 0.1, 0.01)
  music_slider.position(10, 10)

  sfx_slider = createSlider(0, 1.0, 0.4, 0.01)
  sfx_slider.position(10, 30)

}


//Is called after the button on the homepage is pressed
//Generates a play
//Creates a variable containing the player data and sends it to the server
function startGame(usernameInput) {
  console.log(usernameInput)

  socket = io.connect('http://localhost:5000',{reconnection: false} )// Change to if pushing to heroku 'https://hidden-reef-26635.herokuapp.com/' http://localhost:5000

  // https://pirategametestthingy.herokuapp.com/
  
//  player.setUsername(usernameInput)
  

  socket.emit('start', {
    username:usernameInput,
  })

  // Must receive map before beginning game
  socket.once('client_start',
    function(newstatedata) {

      render.set_id(socket.id)
      render.load_gamemap(newstatedata.gamemap)
      state.load_gamemap(newstatedata.gamemap)
      state.load(newstatedata)
      state.set_first_timestamp(newstatedata.t)
      
      gameStarted = 1

      div = createDiv('Leaderboard')
      div.style('font-size', '25px')
      div.style('color','black')
      div.style('height',' 25%')
      div.style('width','15%')
      div.style('opacity',' 0.5')
      div.style('background-color','powderblue')
      div.position(10, 500)

      // Begin music
      render.soundrender.music_main.loop()
    }
  )


  //Updates player list when new information is sent to the server
  socket.on('heartbeat', function(data) {
    
    // Load state
    state.load(data)
    
  })
  socket.on("disconnect", (reason) => {
    if (reason === "io server disconnect") {
      // the disconnection was initiated by the server, you need to reconnect manually
      //socket.connect()
    }
    gameStarted = 0
    div.remove()
    showMenu()

    console.log(reason)
    // else the socket will automatically try to reconnect
  })

  socket.on("dead",
    function(){
      console.log("dead")
    }
  )

}


//If the game has started draws all players on the screen
//
let K_W = 87
let K_A = 65
let K_S = 83
let K_D = 68
let K_Space = 32

// micro version of homepage because of loop referencing
function showMenu(){
  //import the values from the home page
  var Username = document.getElementById('username-input')
  var button = document.getElementById('play-button')
  const playMenu = document.getElementById('home-page')
  playMenu.classList.remove('hidden')

  //When the play button is clicked hide the homepage and generate the player with the given username
  button.onclick = function(){

      playMenu.classList.add('hidden')
      startGame(Username.value)
  }
}

function draw() {
  if (gameStarted == 1) {

    render.render(state.get_state())

    // Update volume
    render.soundrender.set_music_vol(music_slider.value())
    render.soundrender.set_sfx_vol(sfx_slider.value())

    // leaderBoard_update_counter = leaderBoard_update_counter + 1
    // if (leaderBoard_update_counter >= 40){
    //   players.sort(function (x, y) {
    //       return y.gold - x.gold
    //   })
    //   leaderBoard_update_counter = 0
    //   var table = ""
    //   for (var i = 0; i < players.length; i++ ) {
    //     if (i >= 3 ) {break}
    //     table = table + "<tr><td>" + players[i].gold + "</td><td>" + players[i].username + "</td></tr>"
    //   }
    //   div.html("<style>th, td {padding: 10pxtext-align: left}</style><h1>Gold pirated</h1><body><table>" + table + "</table></body>")

    // }

  }
  else if (gameStarted == 0){
    background(255)
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
    //player.tryfire()
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
