class TreasureRender {

    constructor() { }

    preload() {
        this.img_treasure_water = loadImage('assets/img_treasure_water.png');
    }

    load_dimensions(gamemap) {
        this.tilesize = gamemap.tilesize;
    }

    load_treasure(treasurelist) {

        // Load from a TreasureList
        this.treasure_array = treasurelist.treasure_array;

    }

    display() {
        for (let treasure of this.treasure_array) {
            image(this.img_treasure_water, treasure.x*this.tilesize, treasure.y*this.tilesize, this.tilesize, this.tilesize);
        }
    }

}