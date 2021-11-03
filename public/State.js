const RENDER_DELAY = 100

class State {

    constructor() {

        // this.game_start = 0
        // this.first_server_timestamp = 0

        this.state_list = []
        this.eventlist = []

    }

    set_first_timestamp(t) {
        this.first_server_timestamp = t
        this.game_start = Date.now()
    }

    load_gamemap(gamemap) {
        this.gamemap = gamemap
    }

    clear_state_list() {
      this.state_list = []
    }

    current_server_time() {
        return this.first_server_timestamp + (Date.now() - this.game_start) - RENDER_DELAY
    }

    get_base_update() {
        const server_time = this.current_server_time()

        // Make sure we only keep one state before current server time
        for (let i = this.state_list.length-1; i >=0; i--) {
            if (this.state_list[i].t <= server_time) { return i }
        }

        return -1
    }

    load(newstatedata) {

        // Add new state
        this.state_list.push({
            t : newstatedata.t,
            playerlist : newstatedata.players,
            projectilelist : newstatedata.projectiles,
            treasurelist : newstatedata.treasurelist,
            turretlist : newstatedata.turretlist,
            whirllist: newstatedata.whirllist
        })
        
        this.eventlist = this.eventlist.concat(newstatedata.eventlist)

        const base = this.get_base_update()
        if (base > 0) { this.state_list.splice(0, base) }

    }


    get_state() {

        const base = this.get_base_update()
        const server_time = this.current_server_time()
        // If base is most recent state, use it
        // Else interpolate
        if (base < 0) {
            this.state_list[this.state_list.length - 1].eventlist = this.pop_sounds()
            return this.state_list[this.state_list.length - 1]
        }

        else if (base === this.state_list.length - 1) {
            this.state_list[base].eventlist = this.pop_sounds()
            return this.state_list[base]
        }

        else {
            const base_update = this.state_list[base]
            const next = this.state_list[base+1]
            const r = (server_time - base_update.t) / (next.t - base_update.t)

            //print(base_update.eventlist)

            return {
                playerlist : interpolatePlayerList(base_update.playerlist, next.playerlist, r),
                projectilelist : interpolateProjectileList(base_update.projectilelist, next.projectilelist, r),
                treasurelist : base_update.treasurelist,
                turretlist : base_update.turretlist,
                whirllist : base_update.whirllist,
                eventlist : this.pop_sounds(),
            }
        }
    }

    pop_sounds() {
        var popped = this.eventlist
        this.eventlist = []
        return popped
    }



}

function interpolatePlayerList(pl1, pl2, ratio) {

    var new_pl = []

    for (let i = 0; i < pl1.length; i++) {
        for (let j = 0; j < pl2.length; j++) {
            if (pl1[i].id === pl2[j].id) {


                var interpolated = {}

                Object.keys(pl2[j]).forEach(key => { interpolated[key] = pl2[j][key] })

                interpolated.pos = {
                    x : pl1[i].pos.x + (pl2[j].pos.x - pl1[i].pos.x) * ratio,
                    y : pl1[i].pos.y + (pl2[j].pos.y - pl1[i].pos.y) * ratio
                }
                interpolated.dir = interpolateDirection(pl1[i].dir, pl2[j].dir, ratio)

                new_pl.push(interpolated)
                continue
            }
        }
    }

    return new_pl

}


function interpolateProjectileList(pl1, pl2, ratio) {

    var new_pl = []

    for (let i = 0; i < pl1.length; i++) {
        for (let j = 0; j < pl2.length; j++) {
            if (pl1[i].id === pl2[j].id) {

                // Interpolate pos
                var interpolated = {}

                Object.keys(pl2[j]).forEach(key => { interpolated[key] = pl2[j][key] })

                interpolated.pos = {
                    x : pl1[i].pos.x + (pl2[j].pos.x - pl1[i].pos.x) * ratio,
                    y : pl1[i].pos.y + (pl2[j].pos.y - pl1[i].pos.y) * ratio
                }

                new_pl.push(interpolated)
                continue
            }
        }
    }

    return new_pl

}

function interpolateObject(object1, object2, ratio) {
    if (!object2) {
        return object1;
    }

    const interpolated = {};
    Object.keys(object1).forEach(key => {
        if (key === 'dir') {
            interpolated[key] = interpolateDirection(object1[key], object2[key], ratio);
        } else {
            interpolated[key] = object1[key] + (object2[key] - object1[key]) * ratio;
        }
    });
    return interpolated;
}

function interpolateObjectArray(objects1, objects2, ratio) {
    return objects1.map(o => interpolateObject(o, objects2.find(o2 => o.id === o2.id), ratio));
}

// Determines the best way to rotate (cw or ccw) when interpolating a direction.
// For example, when rotating from -3 radians to +3 radians, we should really rotate from
// -3 radians to +3 - 2pi radians.
function interpolateDirection(d1, d2, ratio) {
    const absD = Math.abs(d2 - d1);
    if (absD >= Math.PI) {
        // The angle between the directions is large - we should rotate the other way
        if (d1 > d2) {
            return d1 + (d2 + 2 * Math.PI - d1) * ratio;
        } else {
            return d1 - (d2 - 2 * Math.PI - d1) * ratio;
        }
    } else {
        // Normal interp
        return d1 + (d2 - d1) * ratio;
    }
}
