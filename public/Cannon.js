function Cannon(range,visionfield,player){
    this.pos = player.pos
    this.range = range    // max distance you can shoot out from ship
    this.visionfield = visionfield
    this.angle = 0
    this.player = player
    this.speed = player.maxspeed*1.5
    this.showRange = function (){
        this.pos = this.player.pos
        this.angle = atan2(mouseY - height / 2, mouseX - width / 2);
        // angle goes from -pi to pi
        var altangle = Math.sign(this.angle)*(-1) *(2*PI-abs(this.angle)) 
        var absdiff = abs(this.angle-this.player.dir)
        var absdiff2 = abs(altangle-this.player.dir)
        var field = PI/4 //this.visionfield // PI/3
        //if ( (absdiff>field && absdiff<(PI-field)) || (absdiff2> field && absdiff2<(PI-field)) ){
        if ( (absdiff<(PI-field)) || (absdiff2<(PI-field)) ){
            // grey, transparency(63/255)
            push()
            fill(100,63);
            //*2 because it is the diameter of full circle
            arc(this.pos.x,this.pos.y,this.range*2,this.range*2,
                this.angle-this.visionfield/2,this.angle+this.visionfield/2)
            pop()
        }
        
    }
    this.convertraddomain = function (angle){
        if (angle>PI){
            remain = angle%(2*PI)
            if (remain>PI){
                return -(PI-remain%PI)
            }
        } else if (angle<PI) {
            remain = angle%(2*PI)
            if (remain<-PI){
                return (PI+remain%PI)
            }
        }else{
            return angle
        }

    }
    this.checkclickinrange = function(){
        // checks 
        // 1. whether the mouse is within this.range pixels of the ship,
        // 2. the difference between the mouse angle and the ship's steering angle (where the front points to) 
        //    is between the field size and PI-field. i.e. valid firing angle is from either side of the ship 
        //    with allowed variability to left or right of (PI-2*field)/2 radian.  
        var altangle = Math.sign(this.angle)*(-1) *(2*PI-abs(this.angle)) 
        var absdiff = abs(this.angle-this.player.dir)
        var absdiff2 = abs(altangle-this.player.dir)
        var field = this.visionfield // PI/3
        if (    (mag(mouseY - height / 2, mouseX - width / 2)< this.range) &&
                //((absdiff>field && absdiff<(PI-field)) || (absdiff2> field && absdiff2<(PI-field)))
                ((absdiff<(PI-field)) || (absdiff2<(PI-field)))
            ){
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