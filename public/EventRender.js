class EventRender {

    constructor(){ }
  
    preload() {
      // Images
      this.frames_death = []
      this.frames_death[0] = loadImage('assets/imgs/img_boat_death1.png')
      this.frames_death[1] = loadImage('assets/imgs/img_boat_death2.png')
      this.frames_death[2] = loadImage('assets/imgs/img_boat_death3.png')
      this.frames_death[3] = loadImage('assets/imgs/img_boat_death4.png')
    }

    display(deadlist) {
        for (let i = 0; i < deadlist.length; i++) {
            this.show_ship_death(deadlist[i].pos, deadlist[i].dir, deadlist[i].frame)
        }
    }

    show_ship_death(pos, dir, frame) {
        if (Math.floor(frame/16) < this.frames_death.length) {
            rotate(dir+PI)
            imageMode(CENTER);
            image(this.frames_death[Math.floor(frame/16)], pos.x*Math.cos(-dir-PI)- pos.y*Math.sin(-dir-PI), pos.x*Math.sin(-dir-PI) + pos.y*Math.cos(-dir-PI))
            rotate(-dir-PI)
        }
    }

}