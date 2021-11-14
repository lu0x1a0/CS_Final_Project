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
      this.icon_ball = loadImage('assets/icon/ball.png')
      this.icon_gold = loadImage('assets/icon/gold.png')
      this.icon_health = loadImage('assets/icon/health.png')
      this.icon_range = loadImage('assets/icon/range.png')
      this.icon_speed = loadImage('assets/icon/speed.png')
      this.icon_star = loadImage('assets/icon/star.png')
    }

    display(center, viewdistance, animationlist) {
        for (let i = 0; i < animationlist.length; i++) {

            // Don't render if out of view
            if (Math.floor(animationlist[i].pos.x/this.tilesize) > center.x + viewdistance
                || Math.floor(animationlist[i].pos.x/this.tilesize) < center.x - viewdistance
                || Math.floor(animationlist[i].pos.y/this.tilesize) > center.y + viewdistance
                || Math.floor(animationlist[i].pos.y/this.tilesize) < center.y - viewdistance)  { continue }


            switch (animationlist[i].type) {
                case 'death':
                    this.show_ship_death(animationlist[i].pos, animationlist[i].dir, animationlist[i].frame)
                    break
                case 'get_treasure':
                    if (animationlist[i].frame > 56) { break }
                    tint(255, 128)

                    if (animationlist[i].treasure_type == 'gold') {
                        image(this.icon_gold, animationlist[i].pos.x, animationlist[i].pos.y, 16*(animationlist[i].frame/4+1), 16*(animationlist[i].frame/4+1))
                    } else if (animationlist[i].treasure_type == 'health') {
                        image(this.icon_health, animationlist[i].pos.x, animationlist[i].pos.y, 16*(animationlist[i].frame/4+1), 16*(animationlist[i].frame/4+1))
                    } else if (animationlist[i].treasure_type == 'LargeBall') {
                        image(this.icon_ball, animationlist[i].pos.x, animationlist[i].pos.y, 16*(animationlist[i].frame/4+1), 16*(animationlist[i].frame/4+1))
                    } else if (animationlist[i].treasure_type == 'LargeRange') {
                        image(this.icon_range, animationlist[i].pos.x, animationlist[i].pos.y, 16*(animationlist[i].frame/4+1), 16*(animationlist[i].frame/4+1))
                    } else if (animationlist[i].treasure_type == 'FastSpeed') {
                        image(this.icon_speed, animationlist[i].pos.x, animationlist[i].pos.y, 16*(animationlist[i].frame/4+1), 16*(animationlist[i].frame/4+1))
                    }
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
