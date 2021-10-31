//Run using "node server.js" or heroku local web
//pirate server.


const entities = require('./entities.js')
const BotEntity = require('./Bot.js')
const CONST = require('./Constants.js').CONST
const Maps = require('./MapFiles.js').Maps
const HealthObserver = require('./HealthObserver.js').HealthObserver
const nameGenerator = require('./nameGenerator')
const Path = require('./ShortestPath.js')


let K_W = 87
let K_A = 65
let K_S = 83
let K_D = 68
let K_Space = 32

//process.env.PORT is used for heroku to connect when running locally use LocalHost:5000
var PORT = process.env.PORT || 5000

var express = require("express")
//import express from 'express'
var app = express()
var server = app.listen(PORT)
app.use(express.static('public'))

console.log("Server is running")
var socket = require('socket.io')
//import socket from 'socket.io'
var io = socket(server)
io.sockets.on('connection',newConnection)


//------------------------------ BACKEND SETUP -------------------------------//

// Initialize GameMap -- MAP SELECTION NOT IMPLEMENTED
const GameMap = require("./GameMap.js").GameMap
var gamemap = new GameMap(Maps.MapSquare)

let obj = Path.Generation(gamemap.map)

let paths = obj[0]
let costs = obj[1]
let tupleval = obj[2]
let index = obj[3]
let forbidden = obj[4]


// Initialize SoundManager
const SoundManager = require("./SoundManager.js").SoundManager
var soundmanager = new SoundManager()

// List of all players and bots connected to the server
var players = {}
var monitorstatistics = {'numships' : 0}
var projectiles = {}
var healthobserver = new HealthObserver(players, io, monitorstatistics)//io.sockets)

//------------------------------ JSON HELPER FUNCTIONS -------------------------------//

playerslocjson = function(){
    var l = []
    //for(var i = 0; i<players.length; i++){
    for (var i in players){

        l.push({
            username:players[i].username,
            id:players[i].id,
            pos:players[i].pos,
            dir:players[i].dir,
            health:players[i].health,
            hitbox_size:players[i].hitbox_size,
            size:players[i].size,
            vel:players[i].vel,//for movable range purpose, need to be direct to each player id separately to avoid hack bots
            gold:players[i].gold,
            OnTreasure:players[i].OnTreasure,
            SpaceCounter:players[i].SpaceCounter,
            treasure_fish_time:players[i].treasure_fish_time,
            SpacePressed:players[i].SpacePressed,
            invincible:players[i].invincible,
            cannon:players[i].cannon,
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
setInterval(heartbeat, CONST.HEARTBEAT_INTERVAL)

// RUNS EVERY SERVER-WIDE UPDATE
function heartbeat() {

    for (var i in players){
        // checks that players[i] is not removed from the object by previous damages
        if (players[i]){
            var player = players[i]
            players[i].updateTreasure(gamemap, soundmanager)
            players[i].update(players, soundmanager,paths,costs,tupleval,index,gamemap,forbidden,projectiles);
            if (player.health > 0){
                gamemap.player_move(player, soundmanager)
            }
        }
    }
    for (var key in projectiles) {
        if (projectiles.hasOwnProperty(key)) {
            projectiles[key].update()
            if (projectiles[key].done){
                //projectiles.splice(key,1)
                delete projectiles[key]
                continue
            }else{
                hit = projectiles[key].contactcheck(players, gamemap.turretlist.turret_array)
                if (projectiles[key].done){
                    //projectiles.splice(key,1)
                    delete projectiles[key]
                    console.log(hit.takeDamage(CONST.CANNONBALL_DAMAGE, soundmanager))
                    continue
                }
            }

        }
    }

    // Refresh treasure
    gamemap.try_add_treasure()

    // Turrets fire/repair
    var turret_cannonballs = gamemap.turretlist.fire_all(players)
    for (var tID in turret_cannonballs) {
        projectiles[tID+(new Date()).getTime()] =  turret_cannonballs[tID]
        soundmanager.add_sound("cannon_fire", turret_cannonballs[tID].pos)
    }

    let bot_cannonballs = {}
    gamemap.turretlist.repair()


    // Data we send to front end'
   
    io.sockets.emit('heartbeat', {
        t:Date.now(),
        players:playerslocjson(),
        projectiles:projectileslocjson(),
        treasurelist:gamemap.treasurelist,
        turretlist:gamemap.turretlist,
        eventlist:soundmanager.pop_events(),
    })

}

botIdx = 0
function InitialiseBot(gamemap) {
    console.log("A New Bot is being added")
    //What sort of data do the bots have?

    var position = gamemap.get_spawn()
    var newBot = new BotEntity.Bot(botIdx,nameGenerator.name(),position.x,position.y,1.75,healthobserver)

    //players.push(newBot)
    players[botIdx] = newBot
    botIdx += 1
    monitorstatistics['numships'] += 1
}


// This shit is never called cos HealthObserver does the work...
//
// function playerDeath(id){
//     // Emit death coords
//     console.log("players[id].pos  ", players[id].pos)
//     io.sockets.emit('dead', {coords : players[id].pos})
//     console.log("dead and emit")
// }


// RUNS WHEN A NEW CONNECTION JOINS
function newConnection(socket) {
    console.log("new connection " + socket.id)

    // Generate a new player and add them to the list of players when first connecting
    // Also send gamemap
    socket.on('start',
        function(data) {

            console.log(data)
            if (monitorstatistics['numships'] == 0) {
                InitialiseBot(gamemap)
                InitialiseBot(gamemap)
                InitialiseBot(gamemap)
                InitialiseBot(gamemap)
            }


            if (data.username == '') {
              data.username = nameGenerator.name()
            }

            var position = gamemap.get_spawn()
            var player = new entities.Player(socket.id, data.username, position.x, position.y, 0, healthobserver)
            //players.push(player)
            players[player.id] = player

            monitorstatistics['numships'] += 1
            //console.log("-----------start---------------")
            //console.log(players)

            // Send gamemap and player spawn on start
            io.sockets.emit('client_start', {
                gamemap:gamemap,
                t:Date.now(),
                players:playerslocjson(),
                projectiles:projectileslocjson(),
                treasurelist:gamemap.treasurelist,
                turretlist:gamemap.turretlist,
                eventlist:soundmanager.pop_events(),
            })
        }
    )

    //finds the player in the list of players and updates them based on new information sent from the client
    socket.on('updatepressed',
        function(data) {
            var player
            //console.log('-----------------updatepressed-----------------------')
            //console.log(data)
            //console.log(player)
            //console.log(players)
            //for (var i = 0; i < players.length; i++ ) {
            //    if (socket.id == players[i].id) {
            //        player = players[i]
            //    }
            //}
            player = players[socket.id]
            if (data.pressedkeycode ===K_W){
                player.yacc = -CONST.PLAYER_ACCELERATION
                //console.log(player.xacc)
            } else if (data.pressedkeycode ===K_A){
                player.xacc = -CONST.PLAYER_ACCELERATION
                player.updateSpacePressed(false)
                player.SpaceCounter = 0
            } else if (data.pressedkeycode ===K_S){
                player.yacc = CONST.PLAYER_ACCELERATION
                player.updateSpacePressed(false)
                player.SpaceCounter = 0
            } else if (data.pressedkeycode ===K_D){
                player.xacc = CONST.PLAYER_ACCELERATION
                player.updateSpacePressed(false)
                player.SpaceCounter = 0

            } else if (data.pressedkeycode ==="mouse"){
                cannonball = player.fire(data.targetX,data.targetY)
                soundmanager.add_sound("cannon_fire", player.pos)
                //console.log("----------------genball----------------\n",cannonball)
                if (cannonball){
                    // use playerid+current time stamp as id, might not safe from server attack with spamming io
                    projectiles[player.id+(new Date()).getTime()] = cannonball
                }
                player.SpaceCounter = 0
            } else if (data.pressedkeycode === K_Space) {
                player.updateSpacePressed(true)
            }
        }
    )

    socket.on('updatereleased',
        function(data){
            var player
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


    socket.on("disconnect", (reason) => {
        //console.log("--------------------reason-------------------")
        //console.log(reason)
        var id = socket.id
        delete players[id]
        //for (var i = 0; i < players.length; i++ ) {
        //  if (id == players[i].id) {
        //    players.splice(i,1)
        //    break
        //  }
        //}

      }
    )
}
