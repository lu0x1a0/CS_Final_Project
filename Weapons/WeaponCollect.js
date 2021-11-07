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
    constructor(obj,attr,original_val, new_val ,period){
        this.obj = obj
        this.attr = attr

        this.original_val = original_val
        this.new_val = new_val
        this.period = period
        this.startEffect()
    }
    startEffect(){
        if (this.attr instanceof Array){
            for (var i = 0; i<this.attr.length;i++) {
                this.obj[this.attr[i]] = this.new_val[i]
            }
        } else{
            this.obj[this.attr] = this.new_val;
        }
    }
    countdown(){
        if (this.period <= 0){
            if (this.attr instanceof Array){
                for (var i = 0; i<this.attr.length;i++) {
                    this.obj[this.attr[i]] = this.original_val[i]
                }
            } else{
                this.obj[this.attr] = this.original_val
            }
            return 1
        }else{
            this.period -= 1
            //console.log("COUNTDOWN",this.period, this.attr,this.obj[this.attr],this.obj)

        }
    }
}

function LargeBall(player){
    return new TimedAmplifiedEffect(
        player.cannon,"calibre",player.cannon.basecalibre,
        5*player.cannon.basecalibre,CONST.WEAPON_EFFECT_PERIOD
    )
}

function FastSpeed(player){
    return new TimedAmplifiedEffect(
        player,
        "maxspeed",
        CONST.PLAYER_MAX_SPEED,
        CONST.PLAYER_MAX_SPEED*2,
        CONST.WEAPON_EFFECT_PERIOD
    )
}

function LargeRange(player){
    return new TimedAmplifiedEffect(
        player.cannon, 
        ["ellipsestat","range"],
        [player.cannon['baseellipsestat'],player.cannon.baserange],
        [   
            {
                a:player.cannon['baseellipsestat'].a*1.5,
                b:player.cannon['baseellipsestat'].b*1.5,
                x0:player.cannon['baseellipsestat'].x0*1.5,
                y0:player.cannon['baseellipsestat'].y0*1.5
            },
            player.cannon.baserange*1.5
        ], 
        CONST.WEAPON_EFFECT_PERIOD
    )
}

//function InvinceArmor(){}


module.exports = {
    Weapons : {
        LargeBall:LargeBall,
        LargeRange:LargeRange,
        FastSpeed:FastSpeed
    }
}