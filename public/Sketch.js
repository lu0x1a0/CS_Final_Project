var player
var socket
var zoom = 1
var gameStarted = 0
var dead = 0


var state
var render
var socket
var leaderboard
var div

function preload() {
  state = new State()
  render = new Render()
}


function setup() {

  frameRate(60)

  createCanvas(windowWidth, windowHeight)
  imageMode(CENTER)

  render.setup()

  // Volume sliders
  music_slider = createSlider(0, 0.5, 0.0, 0.01)
  music_slider.position(10, 10)

  sfx_slider = createSlider(0, 1.0, 0.4, 0.01)
  sfx_slider.position(10, 30)

  // Start title theme
  render.soundrender.start_music_title()

  // https://pirategametestthingy.herokuapp.com/
  // http://localhost:5000
  var addr = window.location.href
  socket = io.connect(addr,{reconnection: false} )

}


//Is called after the button on the homepage is pressed
//Generates a play
//Creates a variable containing the player data and sends it to the server
function startGame(usernameInput) {

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

      // Change music
      render.soundrender.stop_music_title()
      render.soundrender.start_music_main()
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
    // else the socket will automatically try to reconnect
  })


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

  socket.on("playerdeath",
    function(data) {
      state.add_death(data.pos, data.dir)
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
  const effects_table = document.getElementById('effects_table');
  playMenu.classList.remove('hidden')

  // Play main menu music
  render.soundrender.start_music_title()

  effects_table.classList.add('hidden')

  //When the play button is clicked hide the homepage and generate the player with the given username
  button.onclick = function(){
      effects_table.classList.remove('hidden')
      playMenu.classList.add('hidden')
      startGame(Username.value)
  }
}


function showDeathMenu(data){

  var Username = document.getElementById('username-input')
  var retry = document.getElementById('retry-button')
  var mainmenu = document.getElementById('mainmenu-button')
  const effects_table = document.getElementById('effects_table');
  const deathMenu = document.getElementById('death-menu')
  effects_table.classList.add('hidden')
  deathMenu.classList.remove('hidden')
  
  const deathstat = document.getElementById("death-stat-lead")
  const killstat = document.getElementById("death-stat-kill")
  const goldstat = document.getElementById("death-stat-gold")
  deathstat.innerHTML = ""

  var players = data.players
  console.log(players)

  players.sort(function (x, y) {
    return y.gold - x.gold
  })
  
  var goldlist = "<ol>"
  for (var i = 0; i<players.length;i++){
    if (players[i].id == socket.id){
      deathstat.innerHTML = "You came " + (i+1) +"/"+ players.length + " with "+ players[i].gold +" gold!"
      //break;
    }
    goldlist += "<li>"+players[i].username+": "+ players[i].gold +"</li>"
  }
  goldlist += "</ol>"
  deathstat.innerHTML += goldlist
  
  //do charts
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

  retry.onclick = function(){

    // Clean up
    leaderboard.delete()
    gameStarted = 0
    render.soundrender.stop_music_dead()

    // Swap menus
    effects_table.classList.remove('hidden')

    deathMenu.classList.add('hidden')
    startGame(Username.value)
  }
  mainmenu.onclick = function(){

    // Clean up
    leaderboard.delete()
    gameStarted = 0
    dead = 0
    render.soundrender.stop_music_dead()

    // Swap menus
    deathMenu.classList.add('hidden')
    showMainMenu()
  }
}

function doChart(chart_id,rawdata,chart_title){
    // plot the charts - gold
  var xArray = rawdata.x//[50,60,70,80,90,100,110,120,130,140,150];
  var yArray = rawdata.y//[7,8,8,9,9,9,10,11,14,14,15];
  // Define Data
  var data = [{
    x: xArray,
    y: yArray,
    mode:"lines"
  }];
  // Define Layout
  var layout = {
    //xaxis: {range: [40, 160], title: ""},
    //yaxis: {range: [5, 16], title: ""},  
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
    render.render(state.get_state(), dead)

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
