const CONST = require('./Constants.js').CONST
const distance = require("./utils.js").distance
const Cannonball = require('./entities.js').Cannonball


class TurretList {

    constructor(gamemap) {

        var n = 0;

        // Generate turrets
        this.turret_array = [];
        for (let x = 0; x < gamemap.xlen; x++) {
            for (let y = 0; y < gamemap.ylen; y++) {
                if (gamemap.map[x][y] === 'T') {
                    this.turret_array.push(new Turret(n, {x:x,y:y}));
                    n++;
                }
            }
        }

        this.frame_counter = 1
    }



    fire_all(players) {

        var new_cannonballs = {}

        // Only fire every few frames
        if (this.frame_counter % CONST.TURRET_FRAME_FREQ == 0) {

            for (var i = 0; i < this.turret_array.length; i++) {
                // Find closest player
                var closest_coords = this.turret_array[i].nearest_player(players)
                // Fire if they are in range
                if (distance(this.turret_array[i].coords, closest_coords) < CONST.TILESIZE*CONST.TURRET_FIRING_RANGE) {
                    new_cannonballs[this.turret_array[i].tID] = new Cannonball(this.turret_array[i].coords, closest_coords, CONST.PLAYER_MAX_SPEED*CONST.CANNON_SPEED_FACTOR)
                }
            }

            this.frame_counter = 1
        } else {
            this.frame_counter++
        }

        return new_cannonballs
    }

}

class Turret {

    constructor(idno, map_coords) {
        this.coords = {
            x:(map_coords.x+0.5)*CONST.TILESIZE,
            y:(map_coords.y+0.5)*CONST.TILESIZE
        }
        this.tID = 't'+idno
    }



    nearest_player(players) {
        var closest_coords = {x:Infinity, y:Infinity}
        for (var i = 0; i < players.length; i++) {
            if (distance(this.coords, players[i].pos) < distance(this.coords, closest_coords)) {
                closest_coords = players[i].pos
            }
        }
        return closest_coords
    }

}

module.exports = {
    TurretList:TurretList,
    Turret:Turret
}
