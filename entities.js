const mag = require("./utils.js").mag
const addVec = require("./utils.js").addVec
class Player{
    constructor(id,Username, x, y, dir){
        this.pos = {x:x, y:y};
        this.dir = dir;
        this.size = 64
        this.vel = {x:0, y:0};
        this.id = id;
        this.username = Username;
        //this.health = health;
        this.xacc = 0 
        this.yacc = 0
        this.maxspeed = 10
        this.drag = 0.2
        this.cannon = new Cannon(this.size*5,Math.PI/4,this)
    }
    update() {
        //var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
        //newvel.setMag(3);
        //this.vel.lerp(newvel, 0.2);
        //this.pos.add(this.vel);
        
        // wasd acc movement version
        //console.log("------------------------------")
        //console.log("velocity (old)              : ",this.vel)
        this.vel = {x:this.vel.x+this.xacc,y:this.vel.y+this.yacc}
        //console.log("velocity (adde acceleration): ",this.vel)
        this.vel = this.setMag(this.vel, Math.min (Math.max(mag(this.vel.x,this.vel.y)-this.drag,0),this.maxspeed ) ) 
        //console.log("velocity (mag capped)       : ",this.vel)
        //console.log(this.username,this.pos)
        this.pos = addVec(this.pos,this.vel)
        //console.log(this.username,this.pos)
        this.cannon.update()
        //if (this.xacc != 0){
        //  console.log("--------------------------------------")
        //  console.log(mouseX,mouseY)
        //  console.log(mouseX - width / 2, mouseY - height / 2)
        //  console.log(this.xacc,this.yacc)  
        //}
      };
  
      //ensures the player doesn't go beyond the map
    constrain() {
        if ( this.pos.y >= 600) { this.pos.y = 600; }
        if ( this.pos.x >= 600) { this.pos.x = 600; }
        if ( this.pos.y <= 0) { this.pos.y = 0; }
        if ( this.pos.x <= 0) { this.pos.x = 0; }
        
    }
    setMag(vel,newmag){
        var oldmag = Math.sqrt(vel.x**2+vel.y**2)
        if (oldmag){
            var newvel = {x:vel.x/oldmag*newmag, y:vel.y/oldmag*newmag}
            return newvel
        }
        else{
            return vel
        }
    }
    fire(targetX,targetY){
        return this.cannon.fire(targetX, targetY)
    }
}
function Cannon(range,visionfield,player){
    this.pos = player.pos
    this.range = range
    this.visionfield = visionfield
    this.angle = 0
    this.player = player
    this.speed = player.maxspeed*1.5
    this.update = function(x,y){
      this.pos = this.player.pos
      //this.angle = Math.atan2(mouseY - height / 2, mouseX - width / 2);
      this.angle = Math.atan2(x,y);
    }

    this.fire = function (targetX,targetY){
        //input validity checking
        var dist = mag(targetX,targetY) 
        if ( dist <= this.range ){
            startpos = {x:this.pos.x,y:this.pos.y}
            var data = {
                start:startpos,
                end:{x:startpos.x+targetX, y:startpos.y+targetY}, 
                speed: this.speed 
            }
            console.log('-----------fired-----------')
            console.log(data.start)
            console.log(data.end)
            //return data
            return new Cannonball(data.start,data.end,data.speed)
        } 

    }
}
class Cannonball{
    constructor(start,end,speed){
        this.pos = {x:start.x,y:start.y};
        this.start = start;
        this.end = end;
        this.speed = speed;
        this.delta = this.calcDelta()
        this.done = false;
        this.diameter = 8    
    }
    contactcheck(players){
        for(var i = 0; i < players.length;i++){
            //if the distance between two points are less than two collision circle - contact.
            if (mag(players[i].pos.x-this.pos.x,players[i].pos.y-this.pos.y)<(players[i].size/2+this.diameter) ){
                return players[i]
            }
        }
    }
    calcDelta(){
        var d = {x:(this.end.x-this.start.x),y:(this.end.y-this.start.y) }
        var oldmag = mag(d.x,d.y)
        var delta = {x:d.x/oldmag*this.speed,y:d.y/oldmag*this.speed}
        return delta
    }
    update(){
        //delta = end.sub(this.start).setMag(this.speed);
        this.pos = addVec(this.pos,this.delta);
        if (mag(this.pos.x-this.start.x,this.pos.y-this.start.y)>=mag(this.end.x-this.start.x,this.end.y-this.start.y)){
            this.done = true;
            //console.log("done");
        }
        else {
            var touched = 0 //this.contactcheck(Players)
            if (touched){
                //touched.takedamage()
                this.done = true
            }
        }
    }
    //this.show = function(){
    //    if (this.done === false){
    //        fill(255);
    //        circle(this.pos.x,this.pos.y,this.diameter)
    //    }
    //}
}

module.exports = {
    Player: Player
}