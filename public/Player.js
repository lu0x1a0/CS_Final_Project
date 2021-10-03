function Player(Username, x, y, dir ) {
    this.pos = createVector(x, y);
    this.dir = dir;
    this.vel = createVector(0, 0);
    this.Username = Username
    //this.health = health;
    this.xacc = 0 
    this.yacc = 0
    this.maxspeed = 10
    this.drag = 0.2

    this.cannon = new Cannon(range = this.dir*2, visionfield = PI/4,player = this)
    //updates the player position based on mouse position
    this.update = function() {
      //var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
      //newvel.setMag(3);
      //this.vel.lerp(newvel, 0.2);
      //this.pos.add(this.vel);
      
      // wasd acc movement version
      this.vel = createVector(this.vel.x+this.xacc,this.vel.y+this.yacc)
      this.vel.setMag( min (max(mag(this.vel.x,this.vel.y)-this.drag,0),this.maxspeed ) ) 
      this.pos.add(this.vel)
      this.cannon.update()
      //if (this.xacc != 0){
      //  console.log("--------------------------------------")
      //  console.log(mouseX,mouseY)
      //  console.log(mouseX - width / 2, mouseY - height / 2)
      //  console.log(this.xacc,this.yacc)  
      //}
    };

    //ensures the player doesn't go beyond the map
    this.constrain = function() {
      if ( this.pos.y >= 600) { this.pos.y = 600; }
      if ( this.pos.x >= 600) { this.pos.x = 600; }
      if ( this.pos.y <= 0) { this.pos.y = 0; }
      if ( this.pos.x <= 0) { this.pos.x = 0; }
      
    }
  
    //displays the player on the screen
    this.show = function() {
      fill(255);
      ellipse(this.pos.x, this.pos.y, this.dir, this.dir);
      
      fill(255);
      textAlign(CENTER);
      textSize(12);
      text(this.Username, this.pos.x, this.pos.y + this.dir*1.5);
      this.cannon.showRange()
    };
  }