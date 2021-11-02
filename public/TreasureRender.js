class TreasureRender {

    constructor() { }

    preload() {
        this.img_treasure_water = loadImage('assets/imgs/img_treasure_water.png');
    }

    first_load(gamemap) {
        this.tilesize = gamemap.tilesize;
        this.treasure_array = gamemap.treasurelist.treasure_array;
    }

    load_treasure(treasurelist) {
        // Load from a TreasureList
        this.treasure_array = treasurelist.treasure_array;
    }

    display() {
        imageMode(CORNER);
        for (let treasure of this.treasure_array) {
            image(this.img_treasure_water, treasure.x*this.tilesize, treasure.y*this.tilesize, this.tilesize, this.tilesize);
        }
    }

}