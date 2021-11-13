const {CONST} = require("../Constants.js")
/**
 *
 * toggler of a/set of properties of an object between two values that are 
 * dependent on current game state given an expiry period
 * @class TimedEffect
 */
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
            // signal to end the effect
            return 1
        }else{
            this.period -= 1
        }
    }
}
/**
 *  toggler of a/set of properties of an object between two fixed values 
 *  given an expiry period
 * @class TimedAmplifiedEffect
 */
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
            // signal to end the effect
            return 1
        }else{
            this.period -= 1
            

        }
    }
}
/**
 * return an effect to append to a player that 
 * changes the size of the cannonball fired by that player
 *
 * @param {*} player
 * @return {*} 
 */
function LargeBall(player){
    return new TimedAmplifiedEffect(
        player.cannon,"calibre",player.cannon.basecalibre,
        5*player.cannon.basecalibre,CONST.WEAPON_EFFECT_PERIOD
    )
}
/**
 * return an effect to append to a player that 
 * increases its maximum travelling speed
 *
 * @param {*} player
 * @return {*} 
 */
function FastSpeed(player){
    return new TimedAmplifiedEffect(
        player,
        "maxspeed",
        CONST.PLAYER_MAX_SPEED,
        CONST.PLAYER_MAX_SPEED*2,
        CONST.WEAPON_EFFECT_PERIOD
    )
}
/**
 * return an effect to append to a player that increases the maximum 
 * range a projectile fired by that player can travel
 * @param {*} player
 * @return {*} 
 */
function LargeRange(player){
    return new TimedAmplifiedEffect(
        player.cannon, 
        ["ellipsestat","range"],
        [   
            {
                a:player.cannon['baseellipsestat'].a,
                b:player.cannon['baseellipsestat'].b,
                x0:player.cannon['baseellipsestat'].x0,
                y0:player.cannon['baseellipsestat'].y0
            },
            player.cannon.baserange
        ],
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
/**
 * return an effect to append to a player that prevents the player from 
 * taking damage within a fixed interval
 * @param {*} player
 * @return {*} 
 */
function InvinceArmor(player,period = CONST.WEAPON_EFFECT_PERIOD){
    return new TimedAmplifiedEffect(
        player, 
        "invincible",
        false,
        true, 
        period
    )
}


module.exports = {
    Weapons : {
        LargeBall:LargeBall,
        LargeRange:LargeRange,
        FastSpeed:FastSpeed,
        InvinceArmor:InvinceArmor
    }
}