//Run using "node server.js" or heroku local web
//pirate server.


const entities = require('./entities.js')
const CONST = require('./Constants.js').CONST
const Maps = require('./MapFiles.js').Maps
const HealthObserver = require('./HealthObserver.js').HealthObserver


let K_W = 87;
let K_A = 65;
let K_S = 83;
let K_D = 68;
let K_Space = 32;

//process.env.PORT is used for heroku to connect when running locally use LocalHost:5000
var PORT = process.env.PORT || 5000

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


//------------------------------ BACKEND SETUP -------------------------------//

// initialize gamemap -- MAP SELECTION NOT IMPLEMENTED
const GameMap = require("./GameMap.js").GameMap
var gamemap = new GameMap(Maps.MapSquare)

//List of all players and bots connected to the server
var players = {};
var monitorstatistics = {'numships' : 0}
var projectiles = {};
var healthobserver = new HealthObserver(players, io, monitorstatistics)//io.sockets)

//------------------------------ JSON HELPER FUNCTIONS -------------------------------//

playerslocjson = function(){
    var l = []
    //for(var i = 0; i<players.length;i++){
    
    for (var i in players){ 
        //console.log(players[i])
        //console.log("----------------------------")
        //console.log(players[i].pos.x)
        l.push({
            username:players[i].username,
            id:players[i].id,
            x:players[i].pos.x,
            y:players[i].pos.y,
            dir:players[i].dir,
            health:players[i].health,
            size:players[i].size,
            vel:players[i].vel,//for debugging
            gold:players[i].gold,
            OnTreasure:players[i].OnTreasure,
            SpaceCounter:players[i].SpaceCounter,
            SpacePressed:players[i].SpacePressed
        })
    }
    return l
}
projectileslocjson = function(){
    var l = []
    for (var key in projectiles) {
        if (projectiles.hasOwnProperty(key)) {
            l.push({
                id:key,
                pos:projectiles[key].pos,
                diameter:projectiles[key].diameter
            })
        }
    }
    return l
}

//------------------------------ SERVER EVENTS -------------------------------//

// Update every 50 ms
setInterval(heartbeat,10);

// RUNS EVERY SERVER-WIDE UPDATE
function heartbeat() {
    //for (var i = 0; i < players.length; i++ ) {
    for (var i in players){
        // checks that players[i] is not removed from the object by previous damages
        if (players[i]){
            var player = players[i]
            players[i].updateTreasure(gamemap);
            players[i].update(players);
            //players[i].constrain();pl
            if (player.health > 0){
                newpos = gamemap.player_move(player.pos, players[i].vel, players[i].hitbox_size)
                player.pos = newpos
            }

        }
    }
    for (var key in projectiles) {
        if (projectiles.hasOwnProperty(key)) {
            projectiles[key].update()
            if (projectiles[key].done){
                //projectiles.splice(key,1)
                delete projectiles[key]
                continue;
            }else{
                hit = projectiles[key].contactcheck(players)
                if (projectiles[key].done){
                    //projectiles.splice(key,1)
                    delete projectiles[key]
                    hit.takeDamage(CONST.CANNONBALL_DAMAGE);
                    continue;
                }
            }

        }
    }

    // Refresh treasure
    gamemap.try_add_treasure()
    
    // Data we send to front end
    //console.log(players)
    //console.log("-----------------------------------------------")
    //console.log("-----------------------------------------------")
    io.sockets.emit('heartbeat', {
        players:playerslocjson(),
        projectiles:projectileslocjson(),
        treasurelist:gamemap.treasurelist,
    });
}
botIdx = 0
function InitialiseBot() {
    console.log("A New Bot is being added");
    //What sort of data do the bots have?
    var newBot = new entities.Player(botIdx,"Pirate",800,300,1.75, healthobserver);
    newBot.isBot = true;
    //players.push(newBot);
    players[botIdx] = newBot
    botIdx += 1
    monitorstatistics['numships'] += 1
}

// RUNS WHEN A NEW CONNECTION JOINS
function newConnection(socket) {
    console.log("new connection " + socket.id)

    // Generate a new player and add them to the list of players when first connecting
    // Also send gamemap
    socket.on('start',
        function(data) {
            if (monitorstatistics['numships'] == 0) {
                InitialiseBot();
            }

            var position = gamemap.get_spawn();
            var player = new entities.Player(socket.id, data.username, position.x, position.y, 0, healthobserver);
            //players.push(player);
            players[player.id] = player
            monitorstatistics['numships'] += 1
            //console.log("-----------start---------------")
            //console.log(players)

            // Send gamemap and player spawn on start
            io.sockets.emit('client_start', {
                player:player.toJSON(),
                gamemap:gamemap,
            });
        }
    )

    //finds the player in the list of players and updates them based on new information sent from the client
    socket.on('updatepressed',
        function(data) {
            var player;
            //console.log('-----------------updatepressed-----------------------')
            //console.log(data)
            //console.log(player)
            //console.log(players)
            //for (var i = 0; i < players.length; i++ ) {
            //    if (socket.id == players[i].id) {
            //        player = players[i];
            //    }
            //}
            player = players[socket.id]
            if (data.pressedkeycode ===K_W){
                player.yacc = -CONST.PLAYER_ACCELERATION
                //console.log(player.xacc)
            } else if (data.pressedkeycode ===K_A){
                player.xacc = -CONST.PLAYER_ACCELERATION
                player.updateOnTreasure(false)
                player.SpaceCounter = 0
            } else if (data.pressedkeycode ===K_S){
                player.yacc = CONST.PLAYER_ACCELERATION
                player.updateOnTreasure(false)
                player.SpaceCounter = 0
            } else if (data.pressedkeycode ===K_D){
                player.xacc = CONST.PLAYER_ACCELERATION
                player.updateOnTreasure(false)
                player.SpaceCounter = 0

            } else if (data.pressedkeycode ==="mouse"){
                cannonball = player.fire(data.targetX,data.targetY)
                //console.log("----------------genball----------------\n",cannonball)
                if (cannonball){
                    // use playerid+current time stamp as id, might not safe from server attack with spamming io
                    projectiles[player.id+(new Date()).getTime()] = cannonball
                }
                player.SpaceCounter = 0
            } else if (data.pressedkeycode === K_Space) {
                //Check if player is on the same location as the treasure.
                
                if (!player.onTreasure) {
                    for (let i = 0; i < gamemap.treasurelist.treasure_array.length; ++i) {
                        let encap = {x: Math.floor(player.pos.x/gamemap.tilesize), y: Math.floor(player.pos.y/gamemap.tilesize)};
                        if (encap.x === gamemap.treasurelist.treasure_array[i].x 
                            && encap.y === gamemap.treasurelist.treasure_array[i].y) {
                            player.updateOnTreasure(true) 
                            player.updateSpacePressed(true)
                            break
                        }
                    } 
                } 
            }
        }
    )

    socket.on('updatereleased',
        function(data){
            var player;
            //for (var i = 0; i < players.length; i++ ) {
            //    if (socket.id == players[i].id) {
            //        player = players[i]
            //    }
            //}
            player = players[socket.id]
            if ((data.releasedkeycode === K_W && player.yacc<0) || 
                (data.releasedkeycode === K_S && player.yacc>0)) {
                player.yacc = 0
            } else if ( (data.releasedkeycode === K_A && player.xacc<0) || 
                        (data.releasedkeycode === K_D && player.xacc>0)){
                player.xacc = 0
            } else if (data.releasedkeycode === K_Space) {
                player.updateSpacePressed(false)
                player.SpaceCounter = 0
            }
            //console.log('-----------------updatereleased-----------------------')
            //console.log(data)
        }
    )
    socket.on('fire',
        function(data){
            var player
        }
    )

    socket.on("disconnect", (reason) => {
        //console.log("--------------------reason-------------------")
        //console.log(reason)
        var id = socket.id;
        delete players[id]
        //for (var i = 0; i < players.length; i++ ) {
        //  if (id == players[i].id) {
        //    players.splice(i,1)
        //    break
        //  }
        //}

      }
    );
}
