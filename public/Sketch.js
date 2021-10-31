var player
var socket
var zoom = 1
var gameStarted = 0
var dead = 0


var state
var render

var socket

var leaderboard

//Runs when first connected to the webpage

var div


function setup() {

  frameRate(60)

  createCanvas(windowWidth, windowHeight)
  imageMode(CENTER)


  state = new State()
  render = new Render()

  // Volume sliders
  music_slider = createSlider(0, 0.5, 0.0, 0.01)
  music_slider.position(10, 10)

  sfx_slider = createSlider(0, 1.0, 0.4, 0.01)
  sfx_slider.position(10, 30)

  socket = io.connect('http://localhost:5000/',{reconnection: false} )// Change to if pushing to heroku 'https://hidden-reef-26635.herokuapp.com/' http://localhost:5000


}


//Is called after the button on the homepage is pressed
//Generates a play
//Creates a variable containing the player data and sends it to the server
function startGame(usernameInput) {
  console.log(usernameInput)


  // https://pirategametestthingy.herokuapp.com/
  // http://localhost:5000


  socket.emit('start', {
    username:usernameInput,
  })

  // Must receive map before beginning game
  socket.once('client_start',
    function(newstatedata) {

      state.clear_state_list()
      render.set_id(socket.id)
      render.load_gamemap(newstatedata.gamemap)
      state.load_gamemap(newstatedata.gamemap)

      state.load(newstatedata)


      state.set_first_timestamp(newstatedata.t)

      gameStarted = 1
      dead = 0

      leaderboard = new Leaderboard()

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

    console.log(reason)
    // else the socket will automatically try to reconnect
  })


  socket.on("dead",
    function(data) {
      console.log("dead")

      // Ending alive sequence
      dead = data.coords
      gameStarted = 0
      render.soundrender.music_main.stop()

      // Death sequence
      setTimeout(function(){
        render.soundrender.music_dead.loop()
        showDeathMenu()
      }, 2200)
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
function showMainMenu(){
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


function showDeathMenu(){

  var Username = document.getElementById('username-input')
  var retry = document.getElementById('retry-button')
  var mainmenu = document.getElementById('mainmenu-button')
  const deathMenu = document.getElementById('death-menu')
  deathMenu.classList.remove('hidden')

  retry.onclick = function(){

    // Clean up
    leaderboard.delete()
    gameStarted = 0
    render.soundrender.music_dead.stop()

    // Swap menus
    deathMenu.classList.add('hidden')
    startGame(Username.value)
  }
  mainmenu.onclick = function(){

    // Clean up
    leaderboard.delete()
    gameStarted = 0
    dead = 0
    render.soundrender.music_dead.stop()

    // Swap menus
    deathMenu.classList.add('hidden')
    showMainMenu()
  }
}

function draw() {

  if (gameStarted == 1 || dead) {
    render.render(state.get_state(), dead)

    // Update volume
    render.soundrender.set_music_vol(music_slider.value())
    render.soundrender.set_sfx_vol(sfx_slider.value())

    leaderboard.update(state.get_state())

  }
  else {
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
