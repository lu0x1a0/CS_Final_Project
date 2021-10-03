function Cannon(range,visionfield,player){
    this.pos = player.pos
    this.range = range
    this.visionfield = visionfield
    this.angle = 0
    this.player = player
    this.shoot = function(){

    }
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
}