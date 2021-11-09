class EventRender {

    constructor(){ }
  
    preload() {
      // Images
      this.frames_death = []
      this.frames_death[0] = loadImage('assets/imgs/img_boat_death1.png')
      this.frames_death[1] = loadImage('assets/imgs/img_boat_death2.png')
      this.frames_death[2] = loadImage('assets/imgs/img_boat_death3.png')
      this.frames_death[3] = loadImage('assets/imgs/img_boat_death4.png')

      this.img_get_treasure = loadImage('assets/imgs/img_get_treasure.png')
    }

    display(animationlist) {
        for (let i = 0; i < animationlist.length; i++) {
            
            switch (animationlist[i].type) {
                case 'death':
                    this.show_ship_death(animationlist[i].pos, animationlist[i].dir, animationlist[i].frame)
                    break
                case 'get_treasure':
                    if (animationlist[i].frame > 56) { break }
                    tint(255, 128)
                    image(this.img_get_treasure, animationlist[i].pos.x, animationlist[i].pos.y, 16*(animationlist[i].frame/4+1), 16*(animationlist[i].frame/4+1))
                    noTint()
                    break

            }
        }
    }

    show_ship_death(pos, dir, frame) {
        if (Math.floor(frame/16) < this.frames_death.length) {
            rotate(dir+PI)
            imageMode(CENTER)
            image(this.frames_death[Math.floor(frame/16)], pos.x*Math.cos(-dir-PI)- pos.y*Math.sin(-dir-PI), pos.x*Math.sin(-dir-PI) + pos.y*Math.cos(-dir-PI))
            rotate(-dir-PI)
        }
    }

}