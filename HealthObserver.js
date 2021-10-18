// implement the observer pattern for players health
class HealthObserver{
    constructor(playerlist,server, monstat){
        this.playerlist = playerlist
        this.treasurehandler = 0
        this.server = server
        this.monitorstatistics = monstat
    }
    playerDied(playerid){
        //for(var i = 0; i< this.playerlist.length; i++){
        
            // need to support bot id
            //if (this.playerlist[i].id === playerid){
        console.log('playerdied: ',playerid)
        var treasure = this.playerlist[playerid].dropTreasure()
        
        // this.treasurehandler.addtreasure(treasure)
        delete this.playerlist[playerid]
        //this.playerlist.splice(i,1)
        //console.log(this.playerlist)
            //    break;
            //}
        //}
        //this.server.to(playerid).emit('dead')
        this.server.to(playerid).disconnectSockets(true);
        this.monitorstatistics['numships'] -= 1
    }

}

module.exports = {
    HealthObserver:HealthObserver
}