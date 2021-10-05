class GameMap {

    // These should eventually be moved to a separate image file

    constructor() {
        this.map = [
            ['L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','L','L','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','L','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','L','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','L','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','L','L','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','L'],
            ['L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L','L'],
          ];
        this.length = 20
        this.width = 20
        this.tilesize = 32
    }


    preload() {
        this.img_water = loadImage('assets/img_water.png');
        this.img_land = loadImage('assets/img_land.png');
    }

    display() {
        for (let x = 0; x < this.length; x++) {
            for (let y = 0; y < this.length; y++) {
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

        // Currently just check centre point
        var px = Math.floor((pos.x)/this.tilesize)
        var py = Math.floor((pos.y)/this.tilesize)

        // For now, let's assume we cannot move more than one tile in a tick
        
        // // Ensure that if there are any walls around, they restrict movement
        // for (let i = -1; i <= 1; i++) {
        //     for (let j = -1; j <= 1; j++) {
        //         if (i == 0 && j == 0) { continue; }
        //         if (this.map[px+i][py+j]) {
        //             // We have a wall at (px+i, py+j)
        //         }
        //     }
        // }

        // Wall left
        if (this.map[px-1][py] === 'L') { new_pos.x = Math.max(new_pos.x, (px)*this.tilesize) }
        // Wall right
        if (this.map[px+1][py] === 'L') { new_pos.x = Math.min(new_pos.x, (px)*this.tilesize) }
        // Wall above
        if (this.map[px][py-1] === 'L') { new_pos.y = Math.max(new_pos.y, (py)*this.tilesize) }
        // Wall below
        if (this.map[px][py+1] === 'L') { new_pos.y = Math.min(new_pos.y, (py)*this.tilesize) }
        
        return new_pos;

    }

}