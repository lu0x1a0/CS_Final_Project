
class State {

    constructor() {

        this.eventlist = []

    }

    load_gamemap(gamemap) {
        this.gamemap = gamemap
    }

    load(newstatedata) {
        this.playerlist = newstatedata.players
        this.projectilelist = newstatedata.projectiles
        this.treasurelist = newstatedata.treasurelist
        this.turretlist = newstatedata.turretlist
        this.eventlist = this.eventlist.concat(newstatedata.eventlist)
    }

    get_state() {
        return {
            gamemap:this.gamemap,
            playerlist:this.playerlist,
            projectilelist:this.projectilelist,
            treasurelist:this.treasurelist,
            turretlist:this.turretlist,
            eventlist:this.pop_sounds(),
        }
    }

    pop_sounds() {
        var popped = this.eventlist
        this.eventlist = []
        return popped
    }



}