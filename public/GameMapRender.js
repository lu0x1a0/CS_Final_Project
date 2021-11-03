class GameMapRender {

    constructor() { }

    preload() {
        this.img_land = loadImage('assets/imgs/img_land.png');
        this.img_missing = loadImage('assets/imgs/img_missing.png');
        this.img_treasure_water = loadImage('assets/imgs/img_treasure_water.png');
        this.img_turret = loadImage('assets/imgs/img_turret.png');
        this.img_water = loadImage('assets/imgs/img_water.png');
        
        // Water animation load
        this.sheet_water = loadImage('assets/spritesheets/water_tileset.png')
        this.json_water = loadJSON('assets/spritesheets/water_tileset.json')
    }

    setup() {
        this.frames_water = []
        for (let i = 0; i < this.json_water.frames.length; i++) {
            let pos = this.json_water.frames[i].position
            let img = this.sheet_water.get(pos.x, pos.y, pos.w, pos.h)
            console.log(img)
            this.frames_water.push(img)
        }
    }
    


    load_map(gamemap) {

        // Load from a GameMap
        this.map = gamemap.map;
        this.xlen = gamemap.xlen;
        this.ylen = gamemap.ylen;
        this.tilesize = gamemap.tilesize;

    }

    display(frameNo) {
    
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
                    case ' ':
                        image(this.frames_water[Math.floor(frameNo/12) % this.frames_water.length], x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                        break;
                    default:
                        image(this.img_missing, x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                    
                }
            }
        }
    }
}
