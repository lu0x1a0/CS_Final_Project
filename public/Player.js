function Player(x, y, dir ) {
    this.pos = createVector(x, y);
    this.dir = dir;
    this.vel = createVector(0, 0);
  
    this.update = function() {
      var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
      newvel.setMag(3);
      this.vel.lerp(newvel, 0.2);
      this.pos.add(this.vel);
    };

    this.constrain = function() {
      if ( abs(this.pos.y) >= 600) { this.pos.y = 600; }
      if ( abs(this.pos.x) >= 600) { this.pos.x = 600; }
    }
  
    this.show = function() {
      fill(255);
      ellipse(this.pos.x, this.pos.y, this.dir * 2, this.dir * 2);
    };
  }