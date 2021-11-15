// implement the observer pattern for players health
const CONST = require('./Constants.js').CONST
const {Weapons} = require('./Weapons/WeaponCollect.js')
const {playerslocjson} = require("./utils.js")
/**
 *
 *
 * @class HealthObserver
 * monitors death events of players and when notified, boot them
 * from the game and send them statistics.
 */
class HealthObserver{
    constructor(playerlist,server, monstat,gamemap){
        this.playerlist = playerlist
        this.treasurehandler = 0
        this.server = server
        this.monitorstatistics = monstat
        this.gamemap = gamemap
    }
    /**
     *
     * called by player inside entities when that player died.
     * - tallies kill statistics for players[idfrom]
     * - add treasure onto the map
     * - remove playerid from the game
     * - send dead statistic.
     * @memberof HealthObserver
     */
    playerDied(playerid,idfrom){
        var deathpos = this.playerlist[playerid].pos
        var deathdir = this.playerlist[playerid].dir

        this.gamemap.treasurelist.add_death_treasure(
            deathpos,
            Math.floor(this.playerlist[playerid].gold*CONST.GOLD_PERCENT_DROP),
        )
        if (this.playerlist.hasOwnProperty(idfrom)){
            this.playerlist[idfrom].addkillstat()
        }
        this.server.to(playerid).emit('dead', {
            coords : deathpos,
            dir : deathdir,
            players : playerslocjson(this.playerlist),
            goldstat: this.playerlist[playerid].gamestat.goldstat,
            killstat: this.playerlist[playerid].gamestat.killstat,
        })
        delete this.playerlist[playerid]

        this.monitorstatistics['numships'] -= 1
    }

}

module.exports = {
    HealthObserver:HealthObserver
}
