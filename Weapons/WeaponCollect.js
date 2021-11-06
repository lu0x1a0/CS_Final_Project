const {CONST} = require("../Constants.js")

class TimedEffect{
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

function LargeBall(player){
    return new TimedEffect(player.cannon.setCalibreMultiplier,10,
            player.cannon.resetCalibreMultiplier, CONST.WEAPON_EFFECT_PERIOD
    )
}
Weapons = [LargeBall]
module.exports = {
    Weapons : Weapons
}