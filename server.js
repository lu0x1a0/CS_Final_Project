var PORT = process.env.PORT || 5000 

var express = require("express");
var app = express();
var server = app.listen(PORT);
app.use(express.static('public'));

console.log("Server is running");
var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection',newConnection);

setInterval(heartbeat,50);
function heartbeat() {
    io.sockets.emit('heartbeat', players);
    console.log(players.length);
}


var players = [];

function Player(id , x ,y ,dir) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.dir = dir;
}

function newConnection(socket) {
    console.log("new connection " + socket.id)

    socket.on('start',
        function(data) {
            //console.log("Recieved data " + socket.id + " " + data.x + " " +data.y + " " + data.r);
            var player = new Player(socket.id, data.x, data.y, data.r);
            players.push(player);
        
        })
    socket.on('update',
        function(data) {
            //console.log("Recieved data " + socket.id + " "  + data.x + " " +data.y + " " + data.r);
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
}