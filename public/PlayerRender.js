class PlayerRender {
  constructor(){
    this.username = ""
  }

  preload() {
    // Images
    this.img_boat = loadImage('assets/img_boat.png');
    this.img_water = loadImage('assets/img_water.png');
    // Sounds
    this.music = loadSound('assets/main_music.mp3');
    this.sfx_cannon_fire = loadSound('assets/sfx_cannon_fire.mp3')
    this.sfx_get_treasure = loadSound('assets/sfx_get_treasure.mp3')
  }

  music_vol(val) {
    this.music.setVolume(val)
  }

  sfx_vol(val) {
    this.sfx_cannon_fire.setVolume(val)
    this.sfx_get_treasure.setVolume(val)
  }

  load_player(playerJSON) {
    this.pos = playerJSON.pos;
    this.dir = playerJSON.dir;
    this.size = playerJSON.size;
    this.hitbox_size = player.hitbox_size
    this.health = playerJSON.health
    this.gold = playerJSON.gold
    this.treasure_fish_time = playerJSON.treasure_fish_time

    this.cannon = new CannonRender(playerJSON.cannonJSON, this)
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
      // Treasure get SFX
      if (this.SpaceCounter == this.treasure_fish_time) {
        this.sfx_get_treasure.play()
      }

      fill(100,63)
      rect(this.pos.x-this.size/2, this.pos.y-this.size/2-30,this.size,10);
      fill(0, 0, 255)
      rect(this.pos.x-this.size/2, this.pos.y-this.size/2-30, this.size*abs(this.SpaceCounter)/this.treasure_fish_time, 10);
    }
    pop()

    this.cannon.showRange()
  };
  
  tryfire(){
    if (this.cannon.checkclickinrange()){
      // Fire SFX
      this.sfx_cannon_fire.play();
    }
  }
}

function showship(dir,x,y,img_boat,username,size,health,funcs,gold,OnTreasure,SpaceCounter,SpacePressed){
  push()
  rotate(dir+PI)
  var imgx = x //-40
  var imgy = y //- 24
  imageMode(CENTER)
  image(img_boat,imgx*cos(-dir-PI)-imgy*sin(-dir-PI),imgx*sin(-dir-PI)+imgy*cos(-dir-PI));
  rotate(-dir-PI)

  pop()
  console.log(gold)
  fill(255);
  textAlign(CENTER);
  textSize(12);
  text(username, x, y + size*1.5);

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
    rect(x-size/2, y-size/2-30,size*abs(SpaceCounter)/this.treasure_fish_time,10);
  }
  pop()
  
  for(f in funcs){
    funcs()
  }
}
