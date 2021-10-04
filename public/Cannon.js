function Cannon(range,visionfield,player){
    this.pos = player.pos
    this.range = range
    this.visionfield = visionfield
    this.angle = 0
    this.player = player
    this.speed = player.maxspeed*1.5
    this.update = function(){
      this.pos = this.player.pos
      this.angle = atan2(mouseY - height / 2, mouseX - width / 2);
    }
    this.showRange = function (){
        // grey, transparency(63/255)
        fill(100,63);
        arc(this.pos.x,this.pos.y,this.range,this.range,
            this.angle-this.visionfield/2,this.angle+this.visionfield/2)
    }

    this.checkclickinrange = function(){
        if ( mag(mouseY - height / 2, mouseX - width / 2)< this.range ){
            return true
        }
        else {
            return false
        }
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
    this.update = function(){
        //delta = end.sub(this.start).setMag(this.speed);
        this.pos = this.pos.add(this.delta);
        if (mag(this.pos.x-this.start.x,this.pos.y-this.start.y)>=mag(this.end.x-this.start.x,this.end.y-this.start.y)){
            this.done = true;
            //console.log("done");
        }
    }
    this.show = function(){
        if (this.done === false){
            fill(255);
            circle(this.pos.x,this.pos.y,16)
        }
    }
}