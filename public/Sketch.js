var player
var socket
var zoom = 1
var gameStarted = 0
var dead = 0


var state
var render
let musicIcon
let soundFxIcon
var socket
var leaderBoard_update_counter = 100

function preload() {
  state = new State()
  render = new Render()
  musicIcon = loadImage('/assets/icon/gold.png');
  soundFxIcon = loadImage('/assets/icon/volume.png');
}


// Called to initialise all media
function setup() {

  frameRate(60)

  createCanvas(windowWidth, windowHeight)
  imageMode(CENTER)

  render.setup()
  showMainMenu()

  // Volume sliders
  music_slider = createSlider(0, 0.5, 0.1, 0.01)
  music_slider.position(10, 10)

  sfx_slider = createSlider(0, 1.0, 0.4, 0.01)
  sfx_slider.position(10, 50)

  // Start title theme
  render.soundrender.start_music_title()

  // URL associated with the app
  var addr = window.location.href
  socket = io.connect(addr,{reconnection: false} )

}


// Called after the button on the homepage is pressed
// Generates a player
// Sends client start signal to server
function startGame(usernameInput) {

  socket.emit('start', {
    username:usernameInput,
  })

  // On connection: receives map and state
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

      // Change music
      render.soundrender.stop_music_title()
      render.soundrender.start_music_main()
    }
  )


  // On heartbeat: updates state
  socket.on('heartbeat', function(data) {
    state.load(data)
  })
  
  // On disconnect: the socket will automatically try to reconnect
  socket.on("disconnect", (reason) => {  })

  // On death: death sequence
  socket.on("dead",
    function(data) {

      // Ending alive sequence
      dead = data.coords
      gameStarted = 0
      render.soundrender.stop_music_main()

      // Death sequence
      setTimeout(function(){
        render.soundrender.start_music_dead()
        showDeathMenu(data)
      }, 2200)
    }
  )

}


//If the game has started draws all players on the screen
let K_W = 87
let K_A = 65
let K_S = 83
let K_D = 68
let K_Space = 32

// Homepage
function showMainMenu(){

  // Import the values from the home page
  var Username = document.getElementById('username-input')
  var button = document.getElementById('play-button')
  var buttonTutorial = document.getElementById('tutorial-button')
  var backToMainMenu = document.getElementById('back-to-mainmenu-button')
  const playMenu = document.getElementById('home-page')
  const leaderboard = document.getElementById('leaderboard');
  const tutorial = document.getElementById('tutorial');
  playMenu.classList.remove('hidden')

  // Play main menu music
  render.soundrender.start_music_title()

  leaderboard.classList.add('hidden')

  // When the play button is clicked hide the homepage and generate the player with the given username
  buttonTutorial.onclick = function() {
    playMenu.classList.add('hidden')
    tutorial.classList.remove('hidden')
  }

  backToMainMenu.onclick = function() {
    playMenu.classList.remove('hidden')
    tutorial.classList.add('hidden')
  }

  button.onclick = function(){
      leaderboard.classList.remove('hidden')
      playMenu.classList.add('hidden')
      startGame(Username.value)
  }
}

// Contains statistics, charts, retry buttons
function showDeathMenu(data){

  var Username = document.getElementById('username-input')
  var retry = document.getElementById('retry-button')
  var mainmenu = document.getElementById('mainmenu-button')
  var creditReturn = document.getElementById('credit-return-button')
  var goToCredits = document.getElementById('credit-button')
  const leaderboard = document.getElementById('leaderboard');
  const deathMenu = document.getElementById('death-menu')
  const credits = document.getElementById('credits')
  leaderboard.classList.add('hidden')
  deathMenu.classList.remove('hidden')

  const deathstat = document.getElementById("death-stat-lead")
  const killstat = document.getElementById("death-stat-kill")
  const goldstat = document.getElementById("death-stat-gold")
  deathstat.innerHTML = ""

  var players = data.players

  players.sort(function (x, y) {
    return y.gold - x.gold
  })

  var goldlist = "<ol>"
  for (var i = 0; i<players.length;i++){
    if (players[i].id == socket.id){
      deathstat.innerHTML = "You came " + (i+1) +"/"+ players.length + " with "+ players[i].gold +" gold!"
    }
    goldlist += "<li>"+players[i].username.substring(0, 14)+": "+ players[i].gold +"</li>"
  }
  goldlist += "</ol>"
  deathstat.innerHTML += goldlist

  // Plotly charts
  doChart(
    "death-stat-gold",
    {
      x:data.goldstat.gold_time,
      y:data.goldstat.gold_amount,
    },
    "Cumulative Gold"
  )
  doChart(
    "death-stat-kill",
    {
      x:data.killstat.kill_time,
      y:data.killstat.kill_amount,
    },
    "Cumulative Kills"
  )

  goToCredits.onclick = function() {
    credits.classList.remove('hidden')
    deathMenu.classList.add('hidden')
  }
  creditReturn.onclick = function() {
    credits.classList.add('hidden')
    deathMenu.classList.remove('hidden')
  }

  retry.onclick = function(){
    // Clean up on 'retry'
    gameStarted = 0
    render.soundrender.stop_music_dead()

    // Swap menus
    leaderboard.classList.remove('hidden')

    deathMenu.classList.add('hidden')
    startGame(Username.value)
  }

  mainmenu.onclick = function(){
    // Clean up on 'main menu'
    gameStarted = 0
    dead = 0
    render.soundrender.stop_music_dead()

    // Swap menus
    deathMenu.classList.add('hidden')
    showMainMenu()
  }
}

// Takes input time statistics and produce a corresponding plotly graph
function doChart(chart_id,rawdata,chart_title){
  // Plot charts - gold
  var xArray = rawdata.x
  var yArray = rawdata.y
  // Define Data
  var data = [{
    x: xArray,
    y: yArray,
    mode:"lines"
  }];
  // Define Layout
  var layout = {
    xaxis: {showticklabels:false},
    title: chart_title
  };
  // Display using Plotly
  Plotly.newPlot(chart_id, data, layout);
}


function draw() {

  // Update volume
  render.soundrender.set_music_vol(music_slider.value())
  render.soundrender.set_sfx_vol(sfx_slider.value())

  if (gameStarted == 1 || dead) {

    // Game rendering
    render.render(state.get_state(), dead)

    // Leaderboard construction
    if (leaderBoard_update_counter >= 80) {
      leaderBoard_update_counter = 0
      const leaderboard_Display = document.getElementById("leaderboardDisplay")

        var players = state.get_state().playerlist
        players.sort(function (x, y) {
          return y.gold - x.gold
        })

        var table = ""
        for (var i = 0; i < players.length ; i++ ) {
          if (i >= 5) { break }
          table = table + "<tr><td>" + players[i].gold +"</td><td>" + " - "+ "</td><td>" + players[i].username.substring(0, 18) + "</td></tr>"
        }
        leaderboard_Display.innerHTML = table
      } else {
        leaderBoard_update_counter++;
      }
  }
}

// Emit fire on click
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

// Emit keypress
function keyPressed(){
  if(gameStarted){
    if(keyIsDown(K_W) || keyIsDown(K_A) || keyIsDown(K_S) || keyIsDown(K_D) || keyIsDown(K_Space)){
      data = {
        pressedkeycode: keyCode
      }
      socket.emit('updatepressed',data)
    }
  }
}

// Emit key release
function keyReleased(){
  if (gameStarted){
    data = {releasedkeycode:keyCode}
    socket.emit('updatereleased',data)
  }
}
