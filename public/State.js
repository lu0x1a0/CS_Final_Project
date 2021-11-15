const RENDER_DELAY = 100

class State {

    constructor() {

        this.state_list = []
        this.soundlist = []
        this.animationlist = []

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

    tick_animationlist() {

        // Advances the frame count for animation list
        for (let i = this.animationlist.length-1; i >= 0; i--) {
            this.animationlist[i].frame++
            if (this.animationlist[i].frame > 200) { this.animationlist.splice(i,1) }
        }
        return this.animationlist
    }

    // Return the most recent state from before 100ms ago
    get_base_update() {
        const server_time = this.current_server_time()

        // Make sure we only keep one state before current server time
        for (let i = this.state_list.length-1; i >=0; i--) {
            if (this.state_list[i].t <= server_time) { return i }
        }

        return -1
    }

    // We add a new state to the state list
    // If we now have more than one state from before 100ms ago, we only keep the recent one
    load(newstatedata) {

        // Add new state
        this.state_list.push({
            t : newstatedata.t,
            playerlist : newstatedata.players,
            projectilelist : newstatedata.projectiles,
            treasurelist : newstatedata.treasurelist,
            turretlist : newstatedata.turretlist,
            stationlist : newstatedata.stationlist,
            whirllist: newstatedata.whirllist
        })
        
        this.soundlist = this.soundlist.concat(newstatedata.soundlist)
        this.animationlist = this.animationlist.concat(newstatedata.animationlist)

        // Only keep the most recent state from before 100ms ago
        const base = this.get_base_update()
        if (base > 0) { this.state_list.splice(0, base) }

    }


    // Return a state from state list
    // We interpolate if we have multiple states and it is appropriate to do so
    get_state() {

        const base = this.get_base_update()
        const server_time = this.current_server_time()

        // If base is most recent state, use it
        if (base < 0) {
            this.state_list[this.state_list.length - 1].soundlist = this.pop_sounds()
            this.state_list[this.state_list.length - 1].animationlist = this.tick_animationlist()
            return this.state_list[this.state_list.length - 1]
        }

        // If we only have one state, use it
        else if (base === this.state_list.length - 1) {
            this.state_list[base].soundlist = this.pop_sounds()
            this.state_list[base].animationlist = this.tick_animationlist()
            return this.state_list[base]
        }

        // Else interpolate
        else {
            const base_update = this.state_list[base]
            const next = this.state_list[base+1]
            const r = (server_time - base_update.t) / (next.t - base_update.t)

            return {
                playerlist : interpolatePlayerList(base_update.playerlist, next.playerlist, r),
                projectilelist : interpolateProjectileList(base_update.projectilelist, next.projectilelist, r),
                treasurelist : base_update.treasurelist,
                turretlist : base_update.turretlist,
                stationlist : base_update.stationlist,
                whirllist : base_update.whirllist,
                soundlist : this.pop_sounds(),
                animationlist : this.tick_animationlist(),
            }
        }
    }

    // We cannot interpolate sounds, so we simply pop them from a stored list
    pop_sounds() {
        var popped = this.soundlist
        this.soundlist = []
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

                // Position
                interpolated.pos = {
                    x : pl1[i].pos.x + (pl2[j].pos.x - pl1[i].pos.x) * ratio,
                    y : pl1[i].pos.y + (pl2[j].pos.y - pl1[i].pos.y) * ratio
                }
                // Direction
                interpolated.dir = interpolateDirection(pl1[i].dir, pl2[j].dir, ratio)
                // Health
                interpolated.health = pl1[i].health + (pl2[j].health - pl1[i].health) * ratio
                // Space counter
                interpolated.SpaceCounter = pl1[i].SpaceCounter + (pl2[j].SpaceCounter - pl1[i].SpaceCounter) * ratio

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

                // Interpolate position
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


// Used to interpolate the angle at which each ship faces
function interpolateDirection(d1, d2, ratio) {
    const absD = Math.abs(d2 - d1);
    if (absD >= Math.PI) {
        // If the angle between the directions is large, we should rotate the other way
        if (d1 > d2) {
            return d1 + (d2 + 2 * Math.PI - d1) * ratio;
        } else {
            return d1 - (d2 - 2 * Math.PI - d1) * ratio;
        }
    } else {
        // Normal interpolation
        return d1 + (d2 - d1) * ratio;
    }
}
