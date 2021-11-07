const sin = Math.sin
const cos = Math.cos
const sqrt = Math.sqrt
const {mag,setMag,addVec} = require("../utils.js")
const {CONST} = require("../Constants.js")
class Cannon{
    constructor(rangestat,visionfield,player){
        this.speedmult = 1
        this.rangemult = 1
        this.calibremult = 1

        this.pos = player.pos
        this.visionfield = visionfield
        this.angle = 0
        this.player = player
        
        this.basecalibre = CONST.CANNONBALL_DIAMETER
        console.log("INIT CANNON")
        console.log(this.basecalibre)
        this.calibre = this.basecalibre*this.calibremult

        this.basespeed = player.maxspeed*CONST.CANNON_SPEED_FACTOR 
        this.speed = this.basespeed*this.speedmult
        
        this.baserange = rangestat.b*rangestat.framelife*this.speed // b is redundant because its set to 1
        this.range = this.baserange*this.rangemult
        
        this.ellipsestat = {
            a :rangestat.a*rangestat.framelife*this.speed,
            b :rangestat.b*rangestat.framelife*this.speed
        }
        this.ellipsestat['x0'] = this.ellipsestat.a-this.ellipsestat.b
        this.ellipsestat['y0'] = 0    
    }
    
    ellipserange(theta) {
        //theta is wrt the bow/front of the ship
        var a  = this.ellipsestat.a*this.rangemult
        var b  = this.ellipsestat.b*this.rangemult
        var x0 = this.ellipsestat.x0
        var y0 = this.ellipsestat.y0
        // solve quadratic
        var aa = (b*cos(theta))**2+(a*sin(theta))**2
        var bb = -2* ( b**2*x0*cos(theta)+a**2*y0*sin(theta)  )
        var cc = (b*x0)**2+(a*y0)**2-(a*b)**2
        var r1 = (-bb + sqrt(bb**2-4*aa*cc) )/(2*aa)
        //r2 = (-bb - sqrt(bb**2-4*aa*cc) )/(2*aa)
        return r1
    }
    update(){
      this.pos = this.player.pos
      //if (!this.basecalibre){
      //    console.log("what the heck:",this.player.id)
      //    console.log(this.basecalibre)
      //}
    }

    fire(targetX,targetY){
        var move = {x:targetX,y:targetY}
        if (mag(move)!==0){
            this.angle = Math.atan2(targetY,targetX)
            var startpos = {x:this.pos.x,y:this.pos.y}
            // move slightly off player's collision zone so the ball doesn't hit the player
            var shift = setMag({x:targetX,y:targetY},this.player.size/2+this.calibre)
            var shiftstart = addVec(startpos,shift)

            // adj speed according to player velocity
            var x = this.speed*Math.cos(this.angle)
            var y = this.speed*Math.sin(this.angle)
            var adjspeed = mag(x+this.player.vel.x,y+this.player.vel.y)
            var move = setMag(move,this.ellipserange(this.angle-this.player.dir))//,this.range)

            var data = {
                start:shiftstart,
                end:{x:startpos.x+move.x, y:startpos.y+move.y},
                speed: adjspeed//this.speed
            }
            
            //if this is not a bot
            if (!this.player.EscapeRadius){
                var temp = "YES"
                var stub = new Cannonball(data.start,data.end,data.speed,true,this.calibre,temp)
                console.log("Player ",this.player.id," fired: ",this.calibre,stub.diameter)
            }
            else{
                var stub = new Cannonball(data.start,data.end,data.speed,true,this.calibre)
            }            
            return stub//CONST.CANNONBALL_DIAMETER)
        }
    }

    toJSON() {
        return {
            range : this.range,
            visionfield : this.visionfield,
            ellipsestat : this.ellipsestat
        }
    }
}

class Cannonball{
    constructor(start,end,speed, shotByPlayer=true,calibre,temp){
        this.pos = {x:start.x,y:start.y};
        this.start = start;
        this.end = end;
        this.speed = speed; // dist per heartbeat
        this.delta = this.calcDelta()
        this.done = false;
        this.diameter = calibre ;
        this.shotByPlayer = shotByPlayer
        if (temp == "YES"){
            console.log("YES:", this.diameter)
        }
    }
    //checks whether the ball's euclidian distance from a player is less than the two radius combined.
    contactcheck(players, turret_array){
        //for(var i = 0; i < players.length;i++){
        for (var i in players){
            //if the distance between two points are less than two collision circle - contact.
            if (mag(players[i].pos.x-this.pos.x,players[i].pos.y-this.pos.y)<(players[i].size/2+this.diameter) ){
                this.done = true
                return players[i]
            }
        }

        // Also check for turret hits
        if (this.shotByPlayer) {
            for (var i in turret_array){
                var turret_coords = turret_array[i].coords
                //if the distance between two points are less than two collision circle - contact.
                if (mag(turret_coords.x-this.pos.x,turret_coords.y-this.pos.y)<(CONST.TURRET_SIZE/2+this.diameter) ){
                    this.done = true
                    return turret_array[i]
                }
            }
        }
    }

    //calculates the distace the ball travels per heartbeat
    calcDelta(){
        var d = {x:(this.end.x-this.start.x),y:(this.end.y-this.start.y) }
        var oldmag = mag(d.x,d.y)
        var delta = {x:d.x/oldmag*this.speed,y:d.y/oldmag*this.speed}
        return delta
    }
    //update the position of the ball each heartbeat and if it now travels further from the target, removes it.
    update(){
        //delta = end.sub(this.start).setMag(this.speed);
        this.pos = addVec(this.pos,this.delta);
        if ( (mag(this.pos.x-this.start.x,this.pos.y-this.start.y)>=mag(this.end.x-this.start.x,this.end.y-this.start.y))
            ){
            this.done = true;
            //console.log("done");
        }
    }
}
module.exports = {
    Cannon: Cannon,
    Cannonball: Cannonball
}