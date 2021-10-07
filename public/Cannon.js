function Cannon(range,visionfield,player){
    this.pos = player.pos
    this.range = range    // max distance you can shoot out from ship
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
        var altangle = Math.sign(this.angle)*(-1) *(2*PI-abs(this.angle)) 
        var absdiff = abs(this.angle-this.player.dir)
        var absdiff2 = abs(altangle-this.player.dir)
        var field = this.visionfield // PI/3
        if ( (absdiff>field && absdiff<(PI-field)) || (absdiff2> field && absdiff2<(PI-field)) ){
            //*2 because it is the diameter of full circle
            // grey, transparency(63/255)
            fill(100,63);
            arc(this.pos.x,this.pos.y,this.range*2,this.range*2,
                this.angle-this.visionfield/2,this.angle+this.visionfield/2)
        }
        //if ((PI-abs(this.player.dir))<2*PI/3){
        //    //var bs = [this.player.dir+PI/3,this.player.dir-PI/3,this.player.dir+2*PI/3,this.player.dir-2*PI/3]//boundaries
        //    var altangle = Math.sign(this.angle)*(-1) *(2*PI-abs(this.angle)) 
        //}else{
        //    if (Math.abs(this.angle-this.player.dir)>PI/3 &&  Math.abs(this.angle-this.player.dir)<2*PI/3){
        //        //*2 because it is the diameter of full circle
        //        // grey, transparency(63/255)
        //        fill(100,63);
        //        arc(this.pos.x,this.pos.y,this.range*2,this.range*2,
        //            this.angle-this.visionfield/2,this.angle+this.visionfield/2)
        //    }
        //}

        
        
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
        var altangle = Math.sign(this.angle)*(-1) *(2*PI-abs(this.angle)) 
        var absdiff = abs(this.angle-this.player.dir)
        var absdiff2 = abs(altangle-this.player.dir)
        var field = this.visionfield // PI/3
        if (    (mag(mouseY - height / 2, mouseX - width / 2)< this.range) &&
                ((absdiff>field && absdiff<(PI-field)) || (absdiff2> field && absdiff2<(PI-field)))
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