class TreasureRender {

    constructor() { }

    preload() {
        this.frames_treasure = []
        this.frames_treasure[0] = loadImage('assets/imgs/img_treasure1.png')
        this.frames_treasure[1] = loadImage('assets/imgs/img_treasure2.png')
        this.frames_treasure[2] = loadImage('assets/imgs/img_treasure3.png')
        this.frames_treasure[3] = loadImage('assets/imgs/img_treasure4.png')
        this.frames_treasure[4] = loadImage('assets/imgs/img_treasure5.png')
    }

    first_load(gamemap) {
        this.tilesize = gamemap.tilesize;
        this.treasure_array = gamemap.treasurelist.treasure_array;
    }

    load_treasure(treasurelist) {
        // Load from a TreasureList
        this.treasure_array = treasurelist.treasure_array;
    }

    display(frameNo) {
        imageMode(CORNER);
        for (let treasure of this.treasure_array) {
            tint(255, 90)
            image(this.frames_treasure[Math.floor(frameNo/16) % this.frames_treasure.length], treasure.x*this.tilesize, treasure.y*this.tilesize, this.tilesize, this.tilesize);
            noTint()
        }
    }

}