// implement the observer pattern for players health
class HealthObserver{
    constructor(playerlist,server, monstat){
        this.playerlist = playerlist
        this.treasurehandler = 0
        this.server = server
        this.monitorstatistics = monstat
    }
    playerDied(playerid){
        console.log('playerdied: ',playerid)
        //var treasure = this.playerlist[playerid].dropTreasure()
        // this.treasurehandler.addtreasure(treasure)
        var deathpos = this.playerlist[playerid].pos
        delete this.playerlist[playerid]
        this.server.to(playerid).emit('dead', {coords : deathpos})
        
        // re-added disconnect to that player pressing key doesnt trigger server update,
        // bcos player already removed from json
       // this.server.to(playerid).disconnectSockets(true)

        this.monitorstatistics['numships'] -= 1
    }

}

module.exports = {
    HealthObserver:HealthObserver
}
