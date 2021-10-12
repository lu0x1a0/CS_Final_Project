class Player{
  constructor(){
    this.pos = createVector(0,0)//{x:x, y:y};
    this.dir = 0;
    this.size = 64
    this.vel = {x:0, y:0};
    this.Username = ""
    //this.health = health;
    this.xacc = 0
    this.yacc = 0
    this.maxspeed = 10
    this.drag = 0.2
    this.health = 100
    this.gold = 10;

    this.cannon = new Cannon(this.size*5,PI/3,this)
    this.hitbox_size = 45

    this.isBot = false;
    this.SpaceCounter = 0
    this.SpacePressed = false;
    this.OnTreasure = false
  }

  preload() {
    this.img_boat = loadImage('assets/img_boat.png');
    this.img_water = loadImage('assets/img_water.png');
  }

  setUsername(username) {
    this.Username = username;
  }
  setPos(coords, dir) {
    this.pos = coords;
    this.dir = dir;
  }
  setYacc(inputAcceleration) {
    this.yacc = inputAcceleration;
  }
  setXacc(inputAcceleration) {
    this.xacc = inputAcceleration;
  }


  //displays the player on the screen
  show() {
    push()
    rotate(this.dir+PI)
    var imgx = this.pos.x //-40
    var imgy = this.pos.y //- 24
    imageMode(CENTER);
    image(this.img_boat,imgx*cos(-this.dir-PI)-imgy*sin(-this.dir-PI),imgx*sin(-this.dir-PI)+imgy*cos(-this.dir-PI));
    rotate(-this.dir-PI)
    //fill(255);
    //ellipse(this.pos.x, this.pos.y, this.size, this.size);
    var debug = 1;
    if (true) {
      stroke(255, 0, 0);
      strokeWeight(1);
      rectMode(CENTER);
      rect(this.pos.x, this.pos.y, this.hitbox_size, this.hitbox_size);
      stroke(255,255,255);

    }
    pop()

    fill(255);
    textAlign(CENTER);
    textSize(12);
    text(this.Username, this.pos.x, this.pos.y + this.size*1);

    fill(255);
    textAlign(CENTER);
    textSize(12);
    text(this.gold, this.pos.x, this.pos.y  + this.size*1.5);

    //health bar
    push()
    fill(100,63)
    //base
    rect(this.pos.x-this.size/2, this.pos.y-this.size/2-20,this.size,10);
    //health
    fill(0,220,0)
    rect(this.pos.x-this.size/2, this.pos.y-this.size/2-20,this.size*abs(this.health)/100,10);
    pop()

    push()
    if (this.OnTreasure) {
      fill(100,63)
      rect(this.pos.x-this.size/2, this.pos.y-this.size/2-30,this.size,10);
      fill(0, 0, 255)
      rect(this.pos.x-this.size/2, this.pos.y-this.size/2-30,this.size*abs(this.SpaceCounter)/150,10);
    }
    pop()

    this.cannon.showRange()
  };
  
  tryfire(){
    if (this.cannon.checkclickinrange()){
      return this.cannon.fireData()
    }
  }
}

function showship(dir,x,y,img_boat,Username,size,health,funcs,gold,OnTreasure,SpaceCounter,SpacePressed){
  push()
  rotate(dir+PI)
  var imgx = x //-40
  var imgy = y //- 24
  image(img_boat,imgx*cos(-dir-PI)-imgy*sin(-dir-PI),imgx*sin(-dir-PI)+imgy*cos(-dir-PI));
  rotate(-dir-PI)

  pop()
  console.log(gold)
  fill(255);
  textAlign(CENTER);
  textSize(12);
  text(Username, x, y + size*1.5);

  fill(255);
  textAlign(CENTER);
  textSize(12);
  text(gold, x, y + size*2);

  //health bar
  push()
  fill(100,63)
  //base
  rect(x-size/2, y-size/2-20,size,10);
  //health
  fill(0,220,0)
  rect(x-size/2, y-size/2-20,size*abs(health)/100,10);
  pop()

  push()
  if (OnTreasure) {
    fill(100,63)
    rect(x-size/2, y-size/2-30,size,10);
    fill(0, 0, 255)
    rect(x-size/2, y-size/2-30,size*abs(SpaceCounter)/150,10);
  }
  pop()
  
  for(f in funcs){
    funcs()
  }
}
