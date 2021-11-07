const {CONST} = require("../Constants.js")

class TimedEffect{
    // would come to use if it deals with function.
    constructor(setattrfunc,modifier,resetattrfunc,period){
        this.setattrfunc = setattrfunc
        this.modifier = modifier
        this.resetattrfunc = resetattrfunc
        this.period = period
        this.startEffect()
    }
    startEffect(){
        this.setattrfunc(this.modifier)
    }
    countdown(){
        if (this.period <= 0){
            this.resetattrfunc()
            return 1
        }else{
            this.period -= 1
        }
    }
}
class TimedAmplifiedEffect{
    // deals with attributes only
    constructor(obj,attr,multiplier,period){
        this.obj = obj
        this.attr = attr

        this.original_val = obj[this.attr]
        this.multiplier = multiplier
        this.period = period
        this.startEffect()
    }
    startEffect(){
        this.obj[this.attr] = this.original_val*this.multiplier;
    }
    countdown(){
        if (this.period <= 0){
            this.obj[this.attr] = this.original_val
            return 1
        }else{
            this.period -= 1
            //console.log("COUNTDOWN",this.period, this.attr,this.obj[this.attr],this.obj)

        }
    }
}

function LargeBall(player){
    return new TimedAmplifiedEffect(
        player.cannon,"calibre",
        10,CONST.WEAPON_EFFECT_PERIOD
    )
}

module.exports = {
    Weapons : {
        LargeBall:LargeBall,
    }
}