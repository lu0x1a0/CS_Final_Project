function Cannon(range,visionfield,player){
    this.pos = player.pos
    this.range = range
    this.visionfield = visionfield
    this.angle = 0
    this.player = player
    this.speed = player.maxspeed*1.5
    //this.update = function(){
    //  this.pos = this.player.pos
    //  this.angle = atan2(mouseY - height / 2, mouseX - width / 2);
    //}
    this.showRange = function (){
        this.pos = this.player.pos
        this.angle = atan2(mouseY - height / 2, mouseX - width / 2);
        var perp = [(this.player.dir+PI),(this.player.dir-PI) ]
        // angle goes from -pi to pi
        //if (  (this.angle>perp[0]-PI/6 && this.angle<perp[0]+PI/6)     ){ 
            //*2 because it is the diameter of full circle
            // grey, transparency(63/255)
            fill(100,63);
            arc(this.pos.x,this.pos.y,this.range*2,this.range*2,
                this.angle-this.visionfield/2,this.angle+this.visionfield/2)
        //}
        
    }
    this.convertraddomain = function (angle){
        if (angle>PI){
            remain = Math.floor(angle/(2*PI))
        } else if (angle<PI) {

        }else{
            return angle
        }

    }
    this.checkclickinrange = function(){
        if ( mag(mouseY - height / 2, mouseX - width / 2)< this.range ){
            return true
        }
        else {
            return false
        }
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

    this.show = function(){
        if (this.done === false){
            fill(255);
            circle(this.pos.x,this.pos.y,this.diameter)
        }
    }
}
function cannonballshow(pos,size){
    fill(255);
    circle(pos.x,pos.y,size)
}