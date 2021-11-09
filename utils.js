effects2json = function(effects){
    var ef = {}
    for (var key in effects){
        ef[key] = effects[key].period
    }
    return ef
}
playerslocjson = function(players){
    var l = []
    //for(var i = 0; i<players.length; i++){
    for (var i in players){

        l.push({
            username:players[i].username,
            id:players[i].id,
            pos:players[i].pos,
            dir:players[i].dir,
            health:players[i].health,
            hitbox_size:players[i].hitbox_size,
            size:players[i].size,
            vel:players[i].vel,//for movable range purpose, need to be direct to each player id separately to avoid hack bots
            gold:players[i].gold,
            OnTreasure:players[i].OnTreasure,
            SpaceCounter:players[i].SpaceCounter,
            treasure_fish_time:players[i].treasure_fish_time,
            SpacePressed:players[i].SpacePressed,
            invincible:players[i].invincible,
            hit:players[i].hit,
            cannon:players[i].cannon,
            effects:effects2json(players[i].effects)
        })
    }

    return l
}
projectileslocjson = function(projectiles){
    var l = []
    for (var key in projectiles) {
        if (projectiles.hasOwnProperty(key)) {
            l.push({
                id:key,
                pos:projectiles[key].pos,
                diameter:projectiles[key].diameter
            })
        }
    }
    return l
}
module.exports = {
    mag: function (x,y){
        return Math.sqrt(x**2+y**2)
    },
    addVec: function (v1,v2){
        return {x:v1.x+v2.x,y:v1.y+v2.y}
    },
    setMag: function(vel,newmag){        
        var oldmag = Math.sqrt(vel.x**2+vel.y**2)
        if (oldmag){
            var newvel = {x:vel.x/oldmag*newmag, y:vel.y/oldmag*newmag}
            return newvel
        }
        else{
            return vel
        }
    },
    distance: function(coords1, coords2) {
        return Math.sqrt(Math.pow(coords1.x-coords2.x, 2) + Math.pow(coords1.y-coords2.y, 2))
    },
    playerslocjson:playerslocjson,
    projectileslocjson: projectileslocjson,
};