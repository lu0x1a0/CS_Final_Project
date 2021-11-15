//Run using "node server.js" or heroku local web
//pirate server.


const entities = require('./Player.js')
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



const args = process.argv;
var PORT = 8080
if (args[2]) {
    PORT = args[2]
}

//process.env.PORT is used for heroku to connect when running locally use LocalHost:5000
//8080 for google

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
function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
}

function PathParse(data) {
    let data1 = JSON.parse(data)
    let path = JSON.parse(data1.path)
    return path
}

function CostParse(data) {
    let data1 = JSON.parse(data)
    let cost = JSON.parse(data1.cost)
    return cost
}

function OtherParse(data) {
    function* entries(obj) {
        for (let key in obj)
            yield [key, obj[key]];
    }
    let data1 = JSON.parse(data)

    let tupleVal = JSON.parse(data1.tupleVal)
    let tupleValx= new Path.ArrayKeyedMap(Object.entries(tupleVal))

    let index = JSON.parse(data1.index, reviver)

    let ForbiddenVals = JSON.parse(data1.ForbiddenVals)
    let ForbiddenValsx = new Path.ArrayKeyedMap(entries(ForbiddenVals))

    return [tupleValx, index, ForbiddenValsx]
}

function Parse(data) {
    function* entries(obj) {
        for (let key in obj)
            yield [key, obj[key]];
    }
    let data1 = JSON.parse(data)
    let path = JSON.parse(data1.path)
    let cost = JSON.parse(data1.cost)

    let tupleVal = JSON.parse(data1.tupleVal)
    let tupleValx= new Path.ArrayKeyedMap(Object.entries(tupleVal))

    let index = JSON.parse(data1.index, reviver)

    let ForbiddenVals = JSON.parse(data1.ForbiddenVals)
    let ForbiddenValsx = new Path.ArrayKeyedMap(entries(ForbiddenVals))

    return [path, cost, tupleValx, index, ForbiddenValsx]
}

const GameMap = require("./GameMap.js").GameMap

function Initialise() {
    let gamemap1 = new GameMap(Maps.MapSquare)
    let gamemap2 = new GameMap(Maps.MapRocky)
    let gamemap3 = new GameMap(Maps.MapPiers)
    let gamemap4 = new GameMap(Maps.MapHuge)

    Path.Generation(gamemap1.map, "MapSquare")
    Path.Generation(gamemap2.map, "MapRocky")
    Path.Generation(gamemap3.map, "MapPiers")
    Path.Generation(gamemap4.map, "MapHuge")
}

//Initialise()

let pathstr = "path.json"
let coststr = "cost.json"
let otherstr = "other.json"

let fs = require('fs')
let MapFiles = 'MapHuge'
if (args[3]) {
  if ((args[3] == 'MapHuge') || (args[3] == 'MapSquare') || (args[3] == 'MapPiers') || (args[3] == 'MapRocky')) {
    MapFiles = args[3]
  } else {
    MapFiles = 'MapHuge'
  }
}
 //Just have to change this now

if (MapFiles == 'MapHuge') {
    var gamemap = new GameMap(Maps.MapHuge)
} else if (MapFiles == 'MapSquare') {
    var gamemap = new GameMap(Maps.MapSquare)
} else if (MapFiles == 'MapPiers') {
    var gamemap = new GameMap(Maps.MapPiers)
} else if (MapFiles == 'MapRocky') {
    var gamemap = new GameMap(Maps.MapRocky)
}

let paths;
let costs;
let tupleval;
let index;
let forbidden;

if (MapFiles == 'MapHuge') {
    let str = "./JSON/" + MapFiles + pathstr
    let str1 = "./JSON/" + MapFiles + coststr
    let str2 = "./JSON/" + MapFiles + otherstr

    let data = fs.readFileSync(str, "utf8")
    let data1 = fs.readFileSync(str1, "utf8")
    let data2 = fs.readFileSync(str2, "utf8")

    let obj = PathParse(data)
    let obj1 = CostParse(data1)
    let obj2 = OtherParse(data2)

    paths = obj
    costs = obj1
    tupleval = obj2[0]
    index = obj2[1]
    forbidden = obj2[2]

} else {
    //MapFiles = "MapHuge"
    let str = "./JSON/" + MapFiles + ".json";
    let data = fs.readFileSync(str, "utf8")
    let obj = Parse(data)
    paths = obj[0]
    costs = obj[1]
    tupleval = obj[2]
    index = obj[3]
    forbidden = obj[4]
}

// Initialize EventManager
const EventManager = require("./EventManager.js").EventManager
var eventmanager = new EventManager()

// List of all players and bots connected to the server
var players = {}
var monitorstatistics = {'numships' : 0}
var projectiles = {}
var healthobserver = new HealthObserver(players, io, monitorstatistics,gamemap)//io.sockets)

//------------------------------ JSON HELPER FUNCTIONS -------------------------------//
const {playerslocjson,projectileslocjson} = require("./utils.js")


//------------------------------ SERVER EVENTS -------------------------------//

function UpdateProjectiles(id,cannonball) {
    projectiles[id+(new Date()).getTime()] = cannonball
}

// Update every 50 ms
setInterval(heartbeat, CONST.HEARTBEAT_INTERVAL)

// RUNS EVERY SERVER-WIDE UPDATE
function heartbeat() {

    // Update whirlpool position
    gamemap.whirllist.update(gamemap)

    // Turrets fire/repair
    var turret_cannonballs = gamemap.turretlist.fire_all(players)
    for (var tID in turret_cannonballs) {
        projectiles[tID+(new Date()).getTime()] =  turret_cannonballs[tID]
        eventmanager.add_sound("cannon_fire", turret_cannonballs[tID].pos)
    }
    gamemap.turretlist.repair()

    // Stations fire/repair
    var station_bullets = gamemap.stationlist.fire_all(players)
    for (var hID in station_bullets) {
        projectiles[hID+(new Date()).getTime()] =  station_bullets[hID]
        eventmanager.add_sound("cannon_fire", station_bullets[hID].pos)
    }
    gamemap.stationlist.repair()

    // loop through players and update their velocity, position and fishing status
    for (var i in players){
        // checks that players[i] is not removed from the object by previous damages
        if (players[i]){
            var player = players[i]
            players[i].updateTreasure(gamemap, eventmanager)
            players[i].update(players, eventmanager,paths,costs,tupleval,index,gamemap,forbidden);
            if (player.health > 0){
                gamemap.player_move(player, eventmanager)
            }
        }
    }

    // populate the map when number of players are low.
    while (monitorstatistics['numships'] < gamemap.min_players) {
        InitialiseBot(gamemap)
    }

    // parse projectile movements and deal the correspond damage when necessary
    for (var key in projectiles) {
        if (projectiles.hasOwnProperty(key)) {
            projectiles[key].update()
            if (projectiles[key].done){
                //projectiles.splice(key,1)
                delete projectiles[key]
                continue
            }else{
                hit = projectiles[key].contactcheck(players, gamemap.turretlist.turret_array, gamemap.stationlist.station_array)
                if (projectiles[key].done){
                    //projectiles.splice(key,1)
                    if (key[0] == 'h') {
                        hit.heal(CONST.STATION_HEAL, eventmanager)
                    } else {
                        hit.takeDamage(CONST.CANNONBALL_DAMAGE, eventmanager,projectiles[key].playerid)
                    }
                    delete projectiles[key]
                    continue
                }
            }
        }
    }

    // Refresh treasure
    gamemap.try_add_treasure()

    let BotCannonBalls = BotEntity.Bot.getCannonBalls()
    for (let id in BotCannonBalls) {
        projectiles[id+(new Date()).getTime()] = BotCannonBalls[id]
        eventmanager.add_sound("cannon_fire", BotCannonBalls[id].pos)
    }

    BotEntity.Bot.ResetCannonBalls()

    // Data we send to front end

    io.sockets.emit('heartbeat', {
        t:Date.now(),
        players:playerslocjson(players),
        projectiles:projectileslocjson(projectiles),
        treasurelist:gamemap.treasurelist,
        turretlist:gamemap.turretlist,
        stationlist:gamemap.stationlist,
        whirllist:gamemap.whirllist,
        soundlist:eventmanager.pop_sounds(),
        animationlist:eventmanager.pop_animations(),
    })

}

// add bot ship to the game
botIdx = 0
function InitialiseBot(gamemap) {
    //What sort of data do the bots have?

    var position = gamemap.get_spawn()
    var newBot = new BotEntity.Bot(botIdx,nameGenerator.name(),position.x,position.y,1.75,healthobserver)

    //players.push(newBot)
    players[botIdx] = newBot
    botIdx += 1
    monitorstatistics['numships'] += 1
}



// RUNS WHEN A NEW CONNECTION/webpage JOINS
function newConnection(socket) {

    // Generate a new player and add them to the list of players when first connecting
    // Also send gamemap
    socket.on('start',
        function(data) {

            if (data.username == '') {
              data.username = nameGenerator.name()
            }

            var position = gamemap.get_spawn()
            var player = new entities.Player(socket.id, data.username, position.x, position.y, 0, healthobserver)
            //players.push(player)
            players[player.id] = player

            monitorstatistics['numships'] += 1

            // Send gamemap and player spawn on start
            io.sockets.emit('client_start', {
                gamemap:gamemap,
                t:Date.now(),
                players:playerslocjson(players),
                projectiles:projectileslocjson(projectiles),
                treasurelist:gamemap.treasurelist,
                turretlist:gamemap.turretlist,
                stationlist:gamemap.stationlist,
                whirllist:gamemap.whirllist,
                soundlist:eventmanager.pop_sounds(),
                animationlist:eventmanager.pop_animations(),
            })
        }
    )

    //finds the player in the list of players and updates them based on new information sent from the client
    socket.on('updatepressed',
        function(data) {
            var player


            player = players[socket.id]
            if (player) {
                if (data.pressedkeycode ===K_W){
                    player.yacc = -CONST.PLAYER_ACCELERATION
                    player.updateSpacePressed(false)
                    player.SpaceCounter = 0
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
                    eventmanager.add_sound("cannon_fire", player.pos)
                    if (cannonball){
                        // use playerid+current time stamp as id, might not safe from server attack with spamming io
                        projectiles['p'+player.id+(new Date()).getTime()] = cannonball
                    }
                    player.SpaceCounter = 0
                } else if (data.pressedkeycode === K_Space) {
                    player.updateSpacePressed(true)
                }
            }
        }
    )
    // change acceleration to zero when the player released wasd if they
    //  arnt already accelerating in opposite direction
    socket.on('updatereleased',
        function(data){
            var player
            //for (var i = 0; i < players.length; i++ ) {
            //    if (socket.id == players[i].id) {
            //        player = players[i]
            //    }
            //}
            player = players[socket.id]
            if (player){
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
            }
        }
    )

    // called when clientside initiated disconnect
    socket.on("disconnect", (reason) => {
        var id = socket.id
        delete players[id]

        monitorstatistics['numships'] -= 1
      }
    )
}
