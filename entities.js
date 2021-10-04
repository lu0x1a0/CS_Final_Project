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
        this.cannon = new Cannon(this.size*10,Math.PI/4,this)
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
        this.vel = this.setMag(this.vel, Math.min (Math.max(this.calcMag(this.vel.x,this.vel.y)-this.drag,0),this.maxspeed ) ) 
        //console.log("velocity (mag capped)       : ",this.vel)
        //console.log(this.username,this.pos)
        this.pos = this.addVec(this.pos,this.vel)
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
    addVec(v1,v2){
        return {x:v1.x+v2.x,y:v1.y+v2.y}
    }
    calcMag(x,y){
        return Math.sqrt(x**2+y**2)
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

    this.fireData = function (){
        startpos = createVector(this.pos.x,this.pos.y)
        var data = {
            start:startpos,
            end:createVector(startpos.x+mouseX-width/2, startpos.y+mouseY - height / 2), //startpos.add(createVector(mouseY - height / 2, mouseX - width / 2)),
            speed: this.speed 
        }
        console.log('----------------------')
        console.log(data.start)
        console.log(data.end)
        //return data
        return new Cannonball(data.start,data.end,data.speed)
    }
}
function Cannonball(start,end,speed){
    this.pos = createVector(start.x,start.y);
    this.start = start;
    this.end = end;
    this.speed = speed;
    this.delta = createVector(end.x-start.x,end.y-start.y).setMag(this.speed)
    this.done = false;
    this.diameter = 8
    this.contactcheck = function(players){
        for(var i = 0; i < players.length;i++){
            //if the distance between two points are less than two collision circle - contact.
            if (mag(players[i].pos.x-this.pos.x,players[i].pos.y-this.pos.y)<(players[i].size/2+this.diameter) ){
                return players[i]
            }
        }
    }
    this.update = function(){
        //delta = end.sub(this.start).setMag(this.speed);
        this.pos = this.pos.add(this.delta);
        if (mag(this.pos.x-this.start.x,this.pos.y-this.start.y)>=mag(this.end.x-this.start.x,this.end.y-this.start.y)){
            this.done = true;
            //console.log("done");
        }
        else {
            touched = 0 //this.contactcheck(Players)
            if (touched){
                //touched.takedamage()
                this.done = true
            }
        }
    }
    this.show = function(){
        if (this.done === false){
            fill(255);
            circle(this.pos.x,this.pos.y,this.diameter)
        }
    }
}

module.exports = {
    Player: Player
}