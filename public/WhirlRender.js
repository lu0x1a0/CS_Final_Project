class WhirlRender {

    constructor() { }

    preload() {
        this.img_whirl  = loadImage('assets/img_treasure_water.png');
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
            image(this.img_whirl, whirl.x*this.tilesize, whirl.y*this.tilesize, this.tilesize, this.tilesize);
        }
    }

}