const mag = require("./utils.js").mag
const addVec = require("./utils.js").addVec
const setMag = require("./utils.js").setMag
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
        this.maxspeed = 4
        this.drag = 0.1
        this.cannon = new Cannon(this.size*5,Math.PI/4,this)
        this.health = 100
        this.hitbox_size = 16 // need help from arkie with what this is
    }
    update() {
        //var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
        //newvel.setMag(3);
        //this.vel.lerp(newvel, 0.2);
        //this.pos.add(this.vel);

        // wasd acc movement version
        this.vel = {x:this.vel.x+this.xacc,y:this.vel.y+this.yacc}
        this.vel = setMag(this.vel, Math.min (Math.max(mag(this.vel.x,this.vel.y)-this.drag,0),this.maxspeed ) )
        this.pos = addVec(this.pos,this.vel)
        if (mag(this.vel.x,this.vel.y)>0.0001){
            this.dir = Math.atan2(this.vel.y,this.vel.x)
        }
        this.cannon.update()
    };

      //ensures the player doesn't go beyond the map
    constrain() {
        if ( this.pos.y >= 600) { this.pos.y = 600; }
        if ( this.pos.x >= 600) { this.pos.x = 600; }
        if ( this.pos.y <= 0) { this.pos.y = 0; }
        if ( this.pos.x <= 0) { this.pos.x = 0; }

    }
    fire(targetX,targetY){
        return this.cannon.fire(targetX, targetY)
    }
    convert2treasure(){

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
        //Math.atan2(targetY,targetX)
        if ( dist <= this.range && 1 ){
            startpos = {x:this.pos.x,y:this.pos.y}
            // move slightly off player's collision zone
            shift = setMag({x:targetX,y:targetY},this.player.size/2+5)
            shiftstart = addVec(startpos,shift)
            var data = {
                start:shiftstart,
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
                this.done = true
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
