class GameMapRender {

    constructor() { }

    preload() {
        this.img_land = loadImage('assets/img_land.png');
        this.img_missing = loadImage('assets/img_missing.png');
        this.img_treasure_water = loadImage('assets/img_treasure_water.png');
        this.img_turret = loadImage('assets/img_turret.png');
        this.img_water = loadImage('assets/img_water.png');
    }

    load_map(gamemap) {

        // Load from a GameMap
        this.map = gamemap.map;
        this.xlen = gamemap.xlen;
        this.ylen = gamemap.ylen;
        this.tilesize = gamemap.tilesize;

    }

    display() {

        imageMode(CORNER);
        // Display background map
        for (let x = 0; x < this.xlen; x++) {
            for (let y = 0; y < this.ylen; y++) {
                switch (this.map[x][y]) {
                    case 'L':
                        image(this.img_land, x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                        break;
                    case 'T':
                        image(this.img_turret, x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                        break;
                    case 'S':
                        image(this.img_water, x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                        break;
                    case 'W':
                        image(this.img_water, x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                        break;
                    default:
                        image(this.img_missing, x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);

                }
            }
        }
    }
}
