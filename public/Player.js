
class Player {

  constructor(x, y, dir) {

    this.pos = createVector(x, y);
    this.dir = dir;
    this.size = 64
    this.vel = createVector(0, 0);
    this.hitbox_size = 16
    //this.health = health;
    this.xacc = 0
    this.yacc = 0
    this.maxspeed = 10
    this.drag = 0.2
    this.Username = "";


    this.cannon = new Cannon(640,PI/4,this)

    //updates the player position based on mouse position
   }

   update(gamemap) {
      //var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
      //newvel.setMag(3);
      //this.vel.lerp(newvel, 0.2);
      //this.pos.add(this.vel);

      // wasd acc movement version
      this.vel = createVector(this.vel.x+this.xacc,this.vel.y+this.yacc)
      this.vel.setMag( min (max(mag(this.vel.x,this.vel.y)-this.drag,0),this.maxspeed ) )

      let newpos = p5.Vector.add(this.pos, this.vel)
      this.pos = gamemap.player_move(this.pos, this.vel, this.hitbox_size)
      this.cannon.update()
      //if (this.xacc != 0){
      //  console.log("--------------------------------------")
      //  console.log(mouseX,mouseY)
      //  console.log(mouseX - width / 2, mouseY - height / 2)
      //  console.log(this.xacc,this.yacc)
      //}
    }

    preload() {
      this.img_boat = loadImage('assets/img_boat.png');
      this.img_water = loadImage('assets/img_water.png');
    }

    setUsername(username) {
      this.Username = username;
    }


    show() {
      image(this.img_boat, this.pos.x -40, this.pos.y - 24);
      //image(this.image_boat, this.pos.x, this.pos.y);
      //fill(255);
      //ellipse(this.pos.x, this.pos.y, this.size, this.size);

      fill(255);
      textAlign(CENTER);
      textSize(12);
      text(this.Username, this.pos.x, this.pos.y + this.size*1.5);
      this.cannon.showRange();
    }


    tryfire(){
      if (this.cannon.checkclickinrange()){
        return this.cannon.fireData()
      }
    }

    setYacc(inputAcceleration) {
      this.yacc = inputAcceleration;
    }
    setXacc(inputAcceleration) {
      this.xacc = inputAcceleration;
    }

=======
function Player(Username, x, y, dir ) {
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
  this.cannon = new Cannon(range = this.size*5, visionfield = PI/4,player = this)
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

    //if (this.xacc != 0){
    //  console.log("--------------------------------------")
    //  console.log(mouseX,mouseY)
    //  console.log(mouseX - width / 2, mouseY - height / 2)
    //  console.log(this.xacc,this.yacc)  
    //}
  //};

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
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
    
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
    
    // Debug hitboxes
    if (debug) {

      stroke(255, 0, 0);
      strokeWeight(1);
      rect(this.pos.x-this.hitbox_size/2, this.pos.y-this.hitbox_size/2, this.hitbox_size, this.hitbox_size);
      stroke(255,255,255);

      // line(this.pos.x - this.hitbox_size/2, this.pos.y - this.hitbox_size/2, this.pos.x + this.hitbox_size/2, this.pos.y - this.hitbox_size/2)
      // line(this.pos.x - this.hitbox_size/2, this.pos.y - this.hitbox_size/2, this.pos.x - this.hitbox_size/2, this.pos.y + this.hitbox_size/2)
      // line(this.pos.x + this.hitbox_size/2, this.pos.y + this.hitbox_size/2, this.pos.x + this.hitbox_size/2, this.pos.y - this.hitbox_size/2)
      // line(this.pos.x + this.hitbox_size/2, this.pos.y + this.hitbox_size/2, this.pos.x - this.hitbox_size/2, this.pos.y + this.hitbox_size/2)
      // color(255,0,0)
    }
    
  };
  this.tryfire = function(){
    if (this.cannon.checkclickinrange()){
      return this.cannon.fireData()
    }
  }
}
