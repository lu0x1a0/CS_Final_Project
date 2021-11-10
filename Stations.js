const CONST = require('./Constants.js').CONST
const distance = require("./utils.js").distance
const Cannonball = require('./Weapons/Cannon.js').Cannonball


class StationList {

    constructor(gamemap) {

        var n = 0;

        // Generate stations
        this.station_array = [];
        for (let x = 0; x < gamemap.xlen; x++) {
            for (let y = 0; y < gamemap.ylen; y++) {
                if (gamemap.map[x][y] === 'H') {
                    this.station_array.push(new Station(n, {x:x,y:y}));
                    n++;
                }
            }
        }

        this.frame_counter = 1
    }



    fire_all(players) {

        var new_cannonballs = {}

        // Only fire every few frames
        if (this.frame_counter % CONST.STATION_FRAME_FREQ == 0) {

            for (var i = 0; i < this.station_array.length; i++) {
                // Don't fire if dead
                if (!this.station_array[i].alive) { continue }
                // Find closest player
                var closest_coords = this.station_array[i].nearest_player(players)
                // Fire if they are in range
                if (distance(this.station_array[i].coords, closest_coords) < CONST.TILESIZE*CONST.STATION_FIRING_RANGE) {
                    new_cannonballs[this.station_array[i].hID] = new Cannonball(this.station_array[i].coords, closest_coords, CONST.PLAYER_MAX_SPEED*CONST.STATION_HEAL_SPEED_FACTOR, false,CONST.STATION_HEAL_DIAMETER)
                }
            }

            this.frame_counter = 1
        } else {
            this.frame_counter++
        }

        return new_cannonballs
    }

    repair() {
        for (let station of this.station_array) {
            station.hit = false
            if (!station.alive) {
                station.repair_time += 1
                if (station.repair_time >= station.max_repair_time) {
                    station.alive = true
                    station.health = CONST.STATION_HEALTH
                }
            }
        }
    }

}

class Station {

    constructor(idno, map_coords) {
        this.coords = {
            x:(map_coords.x+0.5)*CONST.TILESIZE,
            y:(map_coords.y+0.5)*CONST.TILESIZE
        }
        this.hID = 'h'+idno
        this.health = CONST.STATION_HEALTH
        this.hit = false
        this.max_health = CONST.STATION_HEALTH
        this.size = CONST.STATION_SIZE

        this.alive = true
        this.repair_time = 0
        this.max_repair_time = CONST.STATION_REPAIR_TIME
    }

    takeDamage(amt, soundmanager) {
        this.health -= amt
        this.hit = true
        soundmanager.add_sound("damage", this.coords)
        if (this.health <= 0) {
            this.alive = false
            this.repair_time = 0
        }
    }



    nearest_player(players) {
        var closest_coords = {x:Infinity, y:Infinity}
        for (var i in players) {
            if (distance(this.coords, players[i].pos) < distance(this.coords, closest_coords)) {
                closest_coords = players[i].pos
            }
        }
        return closest_coords
    }

}

module.exports = {
    StationList:StationList,
    Station:Station
}
