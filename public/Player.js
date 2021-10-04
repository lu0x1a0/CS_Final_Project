function Player(Username, x, y, dir ) {
    this.pos = createVector(x, y);
    this.dir = dir;
    this.vel = createVector(0, 0);
    this.Username = Username
    this.hitbox_size = 16
    //this.health = health;
  

    //updates the player position based on mouse position
    this.update = function(gamemap) {
      var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
      newvel.setMag(3);
      this.vel.lerp(newvel, 0.2);

      // Check if we may move to the location on the map
      let newpos = p5.Vector.add(this.pos, this.vel)
      this.pos = gamemap.player_move(this.pos, this.vel, this.hitbox_size)
    };

    //ensures the player doesn't go beyond the map
    this.constrain = function() {
      if ( this.pos.x <= 0) { this.pos.x = 0; }
      if ( this.pos.x >= 20*16) { this.pos.x = 20*16; }
      if ( this.pos.y <= 0) { this.pos.y = 0; }
      if ( this.pos.y >= 20*16) { this.pos.y = 20*16; }
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