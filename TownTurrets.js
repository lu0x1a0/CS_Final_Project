const CONST = require('./Constants.js').CONST
const distance = require("./utils.js").distance
const Cannonball = require('./Weapons/Cannon.js').Cannonball


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
                // Don't fire if dead
                if (!this.turret_array[i].alive) { continue }
                // Find closest player
                var closest_coords = this.turret_array[i].nearest_player(players)
                // Fire if they are in range
                if (distance(this.turret_array[i].coords, closest_coords) < CONST.TILESIZE*CONST.TURRET_FIRING_RANGE) {
                    new_cannonballs[this.turret_array[i].tID] = new Cannonball(this.turret_array[i].coords, closest_coords, CONST.PLAYER_MAX_SPEED*CONST.CANNON_SPEED_FACTOR, false)
                }
            }

            this.frame_counter = 1
        } else {
            this.frame_counter++
        }

        return new_cannonballs
    }

    repair() {
        for (let turret of this.turret_array) {
            if (!turret.alive) {
                turret.repair_time += 1
                if (turret.repair_time >= turret.max_repair_time) {
                    turret.alive = true
                    turret.health = CONST.TURRET_HEALTH
                }
            }
        }
    }

}

class Turret {

    constructor(idno, map_coords) {
        this.coords = {
            x:(map_coords.x+0.5)*CONST.TILESIZE,
            y:(map_coords.y+0.5)*CONST.TILESIZE
        }
        this.tID = 't'+idno
        this.health = CONST.TURRET_HEALTH
        this.max_health = CONST.TURRET_HEALTH
        this.size = CONST.TURRET_SIZE

        this.alive = true
        this.repair_time = 0
        this.max_repair_time = CONST.TURRET_REPAIR_TIME
    }

    takeDamage(amt, soundmanager) {
        this.health -= amt
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
    TurretList:TurretList,
    Turret:Turret
}
