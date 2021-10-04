//Run using "node server.js" or heroku local web
//pirate server. 

//process.env.PORT is used for heroku to connect when running locally use LocalHost:5000
var PORT = process.env.PORT || 5000 

var express = require("express");
var app = express();
var server = app.listen(PORT);
app.use(express.static('public'));

console.log("Server is running");
var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection',newConnection);



//Sends a new update out every 50 ms containing all player info
setInterval(heartbeat,50);
function heartbeat() {
    io.sockets.emit('heartbeat', players);
    console.log(players.length);
}

//List of all players and bots connected to the server
var players = [];

//Player class to record players who are connected to the server
function Player(id, username , x ,y ,dir) {
    this.id = id;
    this.username = username;
    this.x = x;
    this.y = y;
    this.dir = dir;
}


//Runs after a new connection is established with a client
function newConnection(socket) {
    console.log("new connection " + socket.id)

    //Generate a new player and add them to the list of players when first connecting
    socket.on('start',
        function(data) {
            var player = new Player(socket.id, data.username, data.x, data.y, data.r);
            players.push(player);
        })

    //finds the player in the list of players and updates them based on new information sent from the client
    socket.on('update',
        function(data) {
            var player;
            for (var i = 0; i < players.length; i++ ) {
                if (socket.id == players[i].id) {
                    player = players[i];
                }
            }
            
            player.x = data.x;
            player.y = data.y;
            player.dir = data.dir;

        })
    socket.on('fire',
        function(data){
            var player
        }
    )
}