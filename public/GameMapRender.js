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
        this.sheet_land = loadImage('assets/spritesheets/land_tileset.png')
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

        // Edge images
        this.LU = this.sheet_land.get(96, 80, 16, 16)
        this.LD = this.sheet_land.get(96, 112, 16, 16)
        this.Le = this.sheet_land.get(96, 96, 16, 16)
        this.RU = this.sheet_land.get(128, 80, 16, 16)
        this.RD = this.sheet_land.get(128, 112, 16, 16)
        this.Ri = this.sheet_land.get(128, 96, 16, 16)
        this.Up = this.sheet_land.get(112, 80, 16, 16)
        this.Do = this.sheet_land.get(112, 112, 16, 16)
    }
    


    load_map(gamemap) {

        // Load from a GameMap
        this.map = gamemap.map;
        this.xlen = gamemap.xlen;
        this.ylen = gamemap.ylen;
        this.tilesize = gamemap.tilesize;

        // Preprocess map for rendering edges
        this.preprocess_map()
    }

    preprocess_map() {

        console.log("PREPROCESS")

        // Processes edge water blocks
        for (let x = 0; x < this.xlen; x++) {
            for (let y = 0; y < this.ylen; y++) {

                if (this.map[x][y] != ' ' || x == 0 || y == 0 || x == this.xlen || y == this.ylen) { continue }

                // Rendering depends on walls above, below, left and right
                var isWall = ['L', 'T']

                var left = isWall.includes(this.map[x-1][y])
                var right = isWall.includes(this.map[x+1][y])
                var up = isWall.includes(this.map[x][y-1])
                var down = isWall.includes(this.map[x][y+1])
        
                if (left && up) {
                    this.map[x][y] = 'LU'
                } else if (left && down) {
                    this.map[x][y] = 'LD'
                } else if (left) {
                    this.map[x][y] = 'Le'
                } else if (right && up) {
                    this.map[x][y] = 'RU'
                } else if (right && down) {
                    this.map[x][y] = 'RD'
                } else if (right) {
                    this.map[x][y] = 'Ri'
                } else if (up) {
                    this.map[x][y] = 'Up'
                } else if (down) {
                    this.map[x][y] = 'Do'
                }
            }
        }
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
                        image(this.img_land, x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                        image(this.img_turret, x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                        break;
                    case 'S':
                        image(this.img_water, x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                        break;
                    case ' ':
                        image(this.frames_water[Math.floor(frameNo/12) % this.frames_water.length], x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                        this.render_water_wall(x,y)
                        break;
                    case 'LU':
                        image(this.frames_water[Math.floor(frameNo/12) % this.frames_water.length], x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                        image(this.LU,  x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize)
                        break;
                    case 'LD':
                        image(this.frames_water[Math.floor(frameNo/12) % this.frames_water.length], x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                        image(this.LD,  x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize)
                        break;
                    case 'Le':
                        image(this.frames_water[Math.floor(frameNo/12) % this.frames_water.length], x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                        image(this.Le,  x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize)
                        break;
                    case 'RU':
                        image(this.frames_water[Math.floor(frameNo/12) % this.frames_water.length], x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                        image(this.RU,  x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize)
                        break;
                    case 'RD':
                        image(this.frames_water[Math.floor(frameNo/12) % this.frames_water.length], x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                        image(this.RD,  x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize)
                        break;
                    case 'Ri':
                        image(this.frames_water[Math.floor(frameNo/12) % this.frames_water.length], x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                        image(this.Ri,  x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize)
                        break;
                    case 'Up':
                        image(this.frames_water[Math.floor(frameNo/12) % this.frames_water.length], x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                        image(this.Up,  x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize)
                        break;
                    case 'Do':
                        image(this.frames_water[Math.floor(frameNo/12) % this.frames_water.length], x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                        image(this.Do,  x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize)
                        break;
                    default:
                        image(this.img_missing, x*this.tilesize, y*this.tilesize, this.tilesize, this.tilesize);
                    
                }
            }
        }
    }

    render_water_wall(x,y) {


    }
}
