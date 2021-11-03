const CONST = require('./Constants.js').CONST
class WhirlList{
    constructor(gamemap,numwhirls = 1){
        this.whirl_array = this.genWhirlpool(numwhirls,gamemap)
    }
    genWhirlpool(numwhirls,gamemap){
        var list = []
        for (var i = 0; i<numwhirls; i++){
            var whirl = new Whirl(gamemap.generate_treasure_coords())
            list.push(whirl)
        }
        return list
    }
    update(gamemap){
        for (var i = 0; i<this.whirl_array.length;i++){
            this.trymove(this.whirl_array[i],gamemap)
        }
    }
    trymove(whirl,gamemap){
        if (whirl.lastmovetick>0){
            whirl.lastmovetick -= 1
        }
        else {
            var newloc = this.movepos(gamemap.gridAroundAvail(whirl.loc))
            if (newloc){
                whirl.loc = newloc
            }
            whirl.lastmovetick = CONST.WHIRLMOVETICK
        }
    }
    movepos(avail_pos){
        if (avail_pos.length>0){
            var idx = Math.floor(Math.random()*avail_pos.length)
            return avail_pos[idx]
        } 
    }
}
class Whirl{
    constructor(location){
        this.loc = location
        this.lastmovetick = CONST.WHIRLMOVETICK // milliseconds
    }
}
module.exports = {
    WhirlList : WhirlList
}