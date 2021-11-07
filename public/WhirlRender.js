class WhirlRender {

    constructor() { 
        this.angle = 0
    }

    preload() {
        this.img_whirl  = loadImage('assets/img_whirl.png');
    }

    first_load(gamemap) {
        this.tilesize = gamemap.tilesize;
        this.whirl_array = gamemap.whirllist.whirl_array;
    }

    load_whirl(whirllist) {
        // Load from a TreasureList
        this.whirl_array = whirllist.whirl_array;
    }

    display() {
        imageMode(CENTER);
        for (let whirl of this.whirl_array) {
            push()
            translate((whirl.loc.x+0.5)*this.tilesize, (whirl.loc.y+0.5)*this.tilesize)
            rotate(this.angle)
            image(this.img_whirl, 0,0, this.tilesize, this.tilesize);
            pop()
        }
        this.angle += PI/18
    }

}