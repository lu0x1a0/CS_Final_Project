// implement the observer pattern for players health
const CONST = require('./Constants.js').CONST
const {Weapons} = require('./Weapons/WeaponCollect.js')
const {playerslocjson} = require("./utils.js")
class HealthObserver{
    constructor(playerlist,server, monstat,gamemap){
        this.playerlist = playerlist
        this.treasurehandler = 0
        this.server = server
        this.monitorstatistics = monstat
        this.gamemap = gamemap
    }
    playerDied(playerid,idfrom){
        console.log('playerdied: ',playerid)
        //var treasure = this.playerlist[playerid].dropTreasure()
        // this.treasurehandler.addtreasure(treasure)
        var deathpos = this.playerlist[playerid].pos
        var deathdir = this.playerlist[playerid].dir
        
        this.gamemap.treasurelist.add_death_treasure(
            deathpos,
            Math.floor(this.playerlist[playerid].gold*CONST.GOLD_PERCENT_DROP),
        )
        if (this.playerlist.hasOwnProperty(idfrom)){    
            //this.playerlist[idfrom].gamestat['kill'] += 1;
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

        // // Emit death coords/pos to all
        // this.server.sockets.emit('playerdeath', {
        //     pos : deathpos,
        //     dir : deathdir        
        // })
        

        // re-added disconnect to that player pressing key doesnt trigger server update,
        // bcos player already removed from json
       // this.server.to(playerid).disconnectSockets(true)

        this.monitorstatistics['numships'] -= 1
    }

}

module.exports = {
    HealthObserver:HealthObserver
}
