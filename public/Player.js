
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

}
