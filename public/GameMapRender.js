class GameMapRender {

    constructor(gamemap) {

        // Load from a GameMap
        this.map = gamemap.map;
        this.xlen = gamemap.xlen;
        this.ylen = gamemap.ylan;
        this.tilesize = gamemap.tilesize;
        this.treasure_array = gamemap.treasure_array;

    }


    preload() {
        this.img_land = loadImage('assets/img_land.png');
        this.img_treasure_water = loadImage('assets/img_treasure_water.png');
        this.img_water = loadImage('assets/img_water.png');
    }

    display() {

        // Display background map
        for (let x = 0; x < this.xlen; x++) {
            for (let y = 0; y < this.ylen; y++) {
                switch (this.map[x][y]) {
                    case 'L':
                        image(this.img_land, x*this.tilesize, y*this.tilesize);
                        break;
                    case 'W':
                        image(this.img_water, x*this.tilesize, y*this.tilesize);
                        break;
                    default:
                        image(this.img_water, x*this.tilesize, y*this.tilesize);
                    
                }
            }
        }

        // Display all treasure
        for (let treasure of this.treasure_array) {
            image(this.img_treasure_water, treasure.x*this.tilesize, treasure.y*this.tilesize);
        }
    }

}