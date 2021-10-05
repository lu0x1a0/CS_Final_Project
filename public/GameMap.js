class GameMap {

    // These should eventually be moved to a separate image file

    constructor() {
        this.map = [
            ['L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','L','L','L','L','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','L','L','L','L','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','L','L','L','L','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','L','L','L','L','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L'],
          ];
        // Transpose so that x/y coords match board
        this.map = this.map.reduce((prev, next) => next.map((item, i) => (prev[i] || []).concat(next[i])), []);
        
        // Map parameters
        this.xlen = 32
        this.ylen = 32
        this.tilesize = 32

        this.max_treasure = 8

        this.treasure_array = [];
        // Attempt to generate treasure
        for (let i = 0; i < this.max_treasure; i++) {
            // If we hit a water tile, add to list
            this.generate_treasure()
        }

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

    generate_treasure() {

        // Tries to generate tresure if we have space for more treasure
        if (this.treasure_array.length >= this.max_treasure) { return; }

        var randx = Math.floor(random(this.xlen));
        var randy = Math.floor(random(this.ylen));

        // Only generates if we randomly pick Water
        if (this.map[randx][randy] === 'W') {
            this.treasure_array.push(createVector(randx,randy))
        }
        // This can lead to  double treasure
    }

    allowed_position(pos_vector, hitbox_size) {

        // A position is allowed if all four corners of the hitbox are in movable terrain
        var tlx = Math.floor((pos_vector.x - hitbox_size/2)/this.tilesize)
        var tly = Math.floor((pos_vector.y - hitbox_size/2)/this.tilesize)
        var brx = Math.floor((pos_vector.x + hitbox_size/2)/this.tilesize)
        var bry = Math.floor((pos_vector.y + hitbox_size/2)/this.tilesize)

        if (this.map[tlx][tly] === 'L') { return false; }
        if (this.map[tlx][bry] === 'L') { return false; }
        if (this.map[brx][tly] === 'L') { return false; }
        if (this.map[brx][bry] === 'L') { return false; }

        return true;
    }

    player_move(pos, vel, hitbox_size) {

        var new_pos = p5.Vector.add(pos, vel)

        // Check each of four corners
        for (let i = 0; i <= 1; i++) {
            for (let j = 0; j <= 1; j++) {

                // Set (px,py) to be the coordinates of the map square containing the corner
                var px = Math.floor((pos.x+(i-0.5)*hitbox_size)/this.tilesize)
                var py = Math.floor((pos.y+(j-0.5)*hitbox_size)/this.tilesize)
                
                console.log(px, py)

                // Wall left
                if (this.map[px-1][py] === 'L') { new_pos.x = Math.max(new_pos.x, (px)*this.tilesize+(i-0.5)*hitbox_size) }
                // Wall right
                if (this.map[px+1][py] === 'L') { new_pos.x = Math.min(new_pos.x, (px+1)*this.tilesize+(i-0.5)*hitbox_size-0.001) }
                // Wall above
                if (this.map[px][py-1] === 'L') { new_pos.y = Math.max(new_pos.y, (py)*this.tilesize+(j-0.5)*hitbox_size) }
                // Wall below
                if (this.map[px][py+1] === 'L') { new_pos.y = Math.min(new_pos.y, (py+1)*this.tilesize+(j-0.5)*hitbox_size-0.001) }
                
            }
        }

        return new_pos;

    }

}