const addVec = require("./utils.js").addVec
class GameMap {


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


    generate_treasure() {

        // Tries to generate tresure if we have space for more treasure
        if (this.treasure_array.length >= this.max_treasure) { return; }

        var randx = Math.floor(Math.random()*this.xlen);
        var randy = Math.floor(Math.random()*this.ylen);

        // Only generates if we randomly pick Water
        if (this.map[randx][randy] === 'W') {
            this.treasure_array.push([randx,randy])
        }
        // This can lead to  double treasure
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
module.exports = {
    GameMap:GameMap
}
