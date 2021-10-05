class Player{
  constructor(Username, x, y, dir ){
    this.pos = createVector(x,y)//{x:x, y:y};
    this.dir = dir;
    this.size = 64
    this.vel = {x:0, y:0};
    this.Username = Username
    //this.health = health;
    this.xacc = 0 
    this.yacc = 0
    this.maxspeed = 10
    this.drag = 0.2
    this.health = 100
<<<<<<< HEAD
    this.cannon = new Cannon(range = this.size*5, visionfield = PI/4,player = this)  
  }
  //updates the player position based on mouse position -- moved to server
  //this.update = function() { 
    //var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
    //newvel.setMag(3);
    //this.vel.lerp(newvel, 0.2);
    //this.pos.add(this.vel);
    
    // wasd acc movement version 
    //this.vel = createVector(this.vel.x+this.xacc,this.vel.y+this.yacc)
    //this.vel.setMag( min (max(mag(this.vel.x,this.vel.y)-this.drag,0),this.maxspeed ) ) 
    //this.pos.add(this.vel)
    //this.cannon.update()
=======
    this.cannon = new Cannon(this.size*5,PI/4,this)  
  } 
  preload() {
    this.img_boat = loadImage('assets/img_boat.png');
    this.img_water = loadImage('assets/img_water.png');
  }
>>>>>>> 4649fa427e6693c65dbc1ed7138e1233f1f130ae

  setUsername(username) {
    this.Username = username;
  }
  setYacc(inputAcceleration) {
    this.yacc = inputAcceleration;
  }
  setXacc(inputAcceleration) {
    this.xacc = inputAcceleration;
  }

  //ensures the player doesn't go beyond the map
  constrain() {
    if ( this.pos.y >= 600) { this.pos.y = 600; }
    if ( this.pos.x >= 600) { this.pos.x = 600; }
    if ( this.pos.y <= 0) { this.pos.y = 0; }
    if ( this.pos.x <= 0) { this.pos.x = 0; }
    
  }

  //displays the player on the screen
  show() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.size/2, this.size);
    
    fill(255);
    textAlign(CENTER);
    textSize(12);
    text(this.Username, this.pos.x, this.pos.y + this.size*1.5);

    //health bar
    fill(100,63)
    //base
    rect(this.pos.x-this.size/2, this.pos.y-this.size/2-20,this.size,10);
    //health
    fill(0,220,0)
    rect(this.pos.x-this.size/2, this.pos.y-this.size/2-20,this.size*abs(this.health)/100,10);

    this.cannon.showRange()
  };
  tryfire(){
    if (this.cannon.checkclickinrange()){
      return this.cannon.fireData()
    }
  }
}