function Player(Username, x, y, dir ) {
    this.pos = createVector(x, y);
    this.dir = dir;
    this.vel = createVector(0, 0);
    this.Username = Username
    //this.health = health;
  

    //updates the player position based on mouse position
    this.update = function() {
      var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
      newvel.setMag(3);
      this.vel.lerp(newvel, 0.2);
      this.pos.add(this.vel);
    };

    //ensures the player doesn't go beyond the map
    this.constrain = function() {
      if ( abs(this.pos.y) >= 600) { this.pos.y = 600; }
      if ( abs(this.pos.x) >= 600) { this.pos.x = 600; }
    }
  
    //displays the player on the screen
    this.show = function() {
      fill(255);
      ellipse(this.pos.x, this.pos.y, this.dir * 2, this.dir * 2);
      
      fill(255);
      textAlign(CENTER);
      textSize(12);
      text(this.Username, this.pos.x, this.pos.y + this.dir*1.5);
    };
  }