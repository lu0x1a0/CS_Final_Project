//Run using "node server.js" or heroku local web
//pirate server. 

const entities = require('./entities.js')
//import * as entities from './entities.js'
stub = new entities.Player(1,2,3,4)
console.log(stub)
let K_W = 87;
let K_A = 65;
let K_S = 83;
let K_D = 68;
let K_Space = 32;
//process.env.PORT is used for heroku to connect when running locally use LocalHost:5000
var PORT = process.env.PORT //|| 5000 

var express = require("express");
//import express from 'express'
var app = express();
var server = app.listen(PORT);
app.use(express.static('public'));

console.log("Server is running");
var socket = require('socket.io');
//import socket from 'socket.io'
var io = socket(server);
io.sockets.on('connection',newConnection);



//List of all players and bots connected to the server
var players = [];
playerlocjsons = function(){
    var l = []
    for(var i = 0; i<players.length;i++){
        l.push({
            username:players[i].username,
            id:players[i].id,
            x:players[i].pos.x,
            y:players[i].pos.y,
            dir:players[i].dir
        })
    }
    return l
}
//Player class to record players who are connected to the server
//function Player(id, username , x ,y ,dir) {
//    this.id = id;
//    this.username = username;
//    this.x = x;
//    this.y = y;
//    this.dir = dir;
//}

//Sends a new update out every 50 ms containing all player info
setInterval(heartbeat,50);
function heartbeat() {
    for (var i = 0; i < players.length; i++ ) {
        //console.log("LOOP ENTERED")
        players[i].update();
        players[i].constrain();
    }
    io.sockets.emit('heartbeat', playerlocjsons());
    //console.log(players.length);
}

//Runs after a new connection is established with a client
function newConnection(socket) {
    console.log("new connection " + socket.id)

    //Generate a new player and add them to the list of players when first connecting
    socket.on('start',
        function(data) {
            var player = new entities.Player(socket.id, data.username, data.x, data.y, data.dir);
            players.push(player);
            console.log("-----------start---------------")
            console.log(players)
        })

    //finds the player in the list of players and updates them based on new information sent from the client
    socket.on('updatepressed',
        function(data) {
            var player;
            console.log('-----------------updatepressed-----------------------')
            console.log(data)
            //console.log(player)
            //console.log(players)
            for (var i = 0; i < players.length; i++ ) {
                if (socket.id == players[i].id) {
                    player = players[i];
                }
            }
            if (data.pressedkeycode ===K_W){
                player.yacc = -0.5
                console.log(player.xacc)
            } else if (data.pressedkeycode ===K_A){
                player.xacc = -0.5
            } else if (data.pressedkeycode ===K_S){
                player.yacc = 0.5
            } else if (data.pressedkeycode ===K_D){
                player.xacc = 0.5  
            }
        })
    socket.on('updatereleased',
        function(data){
            var player
            for (var i = 0; i < players.length; i++ ) {
                if (socket.id == players[i].id) {
                    player = players[i];
                }
            }
            if (data.releasedkeycode === K_W || data.releasedkeycode === K_S){
                player.yacc = 0
            } else if (data.releasedkeycode === K_A || data.releasedkeycode === K_D){
                player.xacc = 0
            }
            console.log('-----------------updatereleased-----------------------')
            console.log(data)
        }
    )
    socket.on('fire',
        function(data){
            var player
        }
    )
}