class WhirlRender {

    constructor() { 
        this.angle = 0
    }

    preload() {
        this.img_whirl  = loadImage('assets/imgs/img_whirl.png');
    }

    first_load(gamemap) {
        this.tilesize = gamemap.tilesize;
        this.whirl_array = gamemap.whirllist.whirl_array;
    }

    load_whirl(whirllist) {
        // Load from a WhirlList
        this.whirl_array = whirllist.whirl_array;
    }

    display(center, viewdistance) {
        imageMode(CENTER);
        for (let whirl of this.whirl_array) {

            // Don't render if out of view
            if (whirl.loc.x > center.x + viewdistance
                || whirl.loc.x < center.x - viewdistance
                || whirl.loc.y > center.y + viewdistance
                || whirl.loc.y < center.y - viewdistance)  { continue }

            push()
            translate((whirl.loc.x+0.5)*this.tilesize, (whirl.loc.y+0.5)*this.tilesize)
            rotate(this.angle)
            image(this.img_whirl, 0,0, this.tilesize, this.tilesize);
            pop()
        }
        this.angle += PI/18
        this.angle %= PI*2
    }
}
