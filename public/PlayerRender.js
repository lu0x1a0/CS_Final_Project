class PlayerRender {
  constructor(){
    this.username = ""
  }

  preload() {
    // Images
    this.img_boat = loadImage('assets/imgs/img_boat.png');
    this.img_ball = loadImage('assets/imgs/img_ball.png');
  }

  load_player(playerJSON) {
    this.pos = playerJSON.pos
    this.dir = playerJSON.dir
    this.size = playerJSON.size
    this.username = playerJSON.username
    this.hitbox_size = playerJSON.hitbox_size
    this.health = playerJSON.health
    this.gold = playerJSON.gold
    this.invincible = playerJSON.invincible
    this.vel = playerJSON.vel
    this.OnTreasure = playerJSON.OnTreasure
    this.SpaceCounter = playerJSON.SpaceCounter
    this.treasure_fish_time = playerJSON.treasure_fish_time
    this.effects = playerJSON.effects

    this.cannon = new CannonRender(playerJSON.cannon, this)
  }


  setUsername(username) {
    this.username = username;
  }
  setPos(coords, dir) {
    this.pos = coords;
    this.dir = dir;
  }


  //displays the player on the screen
  show() {
    push()
    rotate(this.dir+PI)
    var imgx = this.pos.x //-40
    var imgy = this.pos.y //- 24
    imageMode(CENTER);

    // Tint if invincible
    if (this.invincible) {
      tint(255, 90)
    }

    image(this.img_boat,imgx*cos(-this.dir-PI)-imgy*sin(-this.dir-PI),imgx*sin(-this.dir-PI)+imgy*cos(-this.dir-PI));
    noTint()
    rotate(-this.dir-PI)
    //fill(255);
    //ellipse(this.pos.x, this.pos.y, this.size, this.size);

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
    text(this.username, this.pos.x, this.pos.y + this.size*1);

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
      rect(this.pos.x-this.size/2, this.pos.y-this.size/2-30, this.size*abs(this.SpaceCounter)/this.treasure_fish_time, 10);
    }
    pop()

    this.cannon.showRange()
    this.showEffects()
  };
  showEffects(){
    const effects_list = document.getElementById("effects_list")
    if (Object.keys(this.effects).length){
      var l = ""
      for (var key in this.effects){
        l += "<li><h4>" + key + ": "+ Math.ceil(this.effects[key]/20) + "<\h4><\li> \n" //20 is the divisor for heartbeat interval
      }
      effects_list.innerHTML = l
    } 
    else if (effects_list.innerHTML){
      effects_list.innerHTML = ''
    } 
    //console.log(this.effects)
  }

  cannonballshow(pos,size) {
    imageMode(CENTER)
    image(this.img_ball, pos.x, pos.y, size, size)
  }
}

function showship(dir,pos,img_boat,username,size,health,funcs,gold,OnTreasure,SpaceCounter,SpacePressed, invincible){
  push()
  rotate(dir+PI)
  var imgx = pos.x //-40
  var imgy = pos.y //- 24
  imageMode(CENTER)
  if (invincible) {
    tint(255, 90)
  }
  image(img_boat,imgx*cos(-dir-PI)-imgy*sin(-dir-PI),imgx*sin(-dir-PI)+imgy*cos(-dir-PI));
  rotate(-dir-PI)

  pop()
  fill(255);
  textAlign(CENTER);
  textSize(12);
  text(username, pos.x, pos.y + size*1.5);

  fill(255);
  textAlign(CENTER);
  textSize(12);
  text(gold, pos.x, pos.y + size*2);

  //health bar
  push()
  fill(100,63)
  //base
  rect(pos.x-size/2, pos.y-size/2-20,size,10);
  //health
  fill(0,220,0)
  rect(pos.x-size/2, pos.y-size/2-20,size*abs(health)/100,10);
  pop()

  push()
  if (OnTreasure) {
    fill(100,63)
    rect(pos.x-size/2, pos.y-size/2-30,size,10);
    fill(0, 0, 255)
    rect(pos.x-size/2, pos.y-size/2-30,size*abs(SpaceCounter)/this.treasure_fish_time,10);
  }
  pop()

  for(f in funcs){
    funcs()
  }
}
