class WhirlRender {

    constructor() { }

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
        imageMode(CORNER);
        console.log("TRYING TO DISPLAY WHIRL")
        for (let whirl of this.whirl_array) {
            console.log(whirl)
            image(this.img_whirl, whirl.loc.x*this.tilesize, whirl.loc.y*this.tilesize, this.tilesize, this.tilesize);
            console.log(whirl.x, whirl.y)
        }
    }

}