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

    this.cannon = new Cannon(this.size*5,PI/4,this)
    this.hitbox_size = 32
  }



  preload() {
    this.img_boat = loadImage('assets/img_boat.png');
    this.img_water = loadImage('assets/img_water.png');
  }

  setUsername(username) {
    this.Username = username;
  }
  setYacc(inputAcceleration) {
    this.yacc = inputAcceleration;
  }
  setXacc(inputAcceleration) {
    this.xacc = inputAcceleration;
  }


  //displays the player on the screen
  show() {

    image(this.img_boat, this.pos.x -40, this.pos.y - 24);
    //fill(255);
    //ellipse(this.pos.x, this.pos.y, this.size, this.size);
    var debug = 1;
    if (true) {
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
