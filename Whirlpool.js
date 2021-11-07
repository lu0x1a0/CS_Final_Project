const CONST = require('./Constants.js').CONST
class WhirlList{
    constructor(gamemap,numwhirls = 1){
        this.whirl_coord_map = {}
        this.whirl_array = this.genWhirlpool(numwhirls,gamemap)
        //console.log("----CONSTRUCT----")
        //console.log(this.whirl_coord_map)
    }
    genWhirlpool(numwhirls,gamemap){
        var list = []
        this.whirl_coord_map = {}
        for (var i = 0; i<numwhirls; i++){
            var whirl = new Whirl(gamemap.generate_treasure_coords())
            list.push(whirl)
            var key = whirl.loc.x.toString()+'-'+whirl.loc.y.toString()
            if (key in this.whirl_coord_map){
                this.whirl_coord_map[key].push[whirl]
            }
            else {
                this.whirl_coord_map[key] = [whirl]
            }
        }
        return list
    }
    update(gamemap){
        this.whirl_coord_map = {}
        for (var i = 0; i<this.whirl_array.length;i++){
            this.trymove(this.whirl_array[i],gamemap)
            var key = this.whirl_array[i].loc.x.toString()+'-'+this.whirl_array[i].loc.y.toString()
            if (key in this.whirl_coord_map){
                this.whirl_coord_map[key].push[this.whirl_array[i]]
            }
            else {
                this.whirl_coord_map[key] = [this.whirl_array[i]]
            }
        }
        //console.log('---update---')
        //console.log(this.whirl_coord_map)
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
            return 1 //moved
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