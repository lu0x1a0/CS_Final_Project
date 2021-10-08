const addVec = require("./utils.js").addVec
class GameMap {


    constructor(map) {
        
        this.map = map.map;
        // Transpose so that x/y coords match board
        this.map = this.map.reduce((prev, next) => next.map((item, i) => (prev[i] || []).concat(next[i])), []);
        
        // Map parameters
        this.xlen = map.xlen;
        this.ylen = map.ylen;
        this.tilesize = map.tilesize;
        this.max_treasure = map.max_treasure;

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
            this.treasure_array.push({x:randx, y:randy})
        }
        // This can lead to  double treasure
    }

    player_move(pos, vel, hitbox_size) {

        var new_pos = addVec(pos,vel)//p5.Vector.add(pos, vel)

        // Currently just check centre point
        var px = Math.floor((pos.x)/this.tilesize)
        var py = Math.floor((pos.y)/this.tilesize)


        // Wall left
        if (this.map[px-1][py] === 'L') { new_pos.x = Math.max(new_pos.x, (px+1)*this.tilesize) }
        // Wall right
        if (this.map[px+1][py] === 'L') { new_pos.x = Math.min(new_pos.x, (px)*this.tilesize) }
        // Wall above
        if (this.map[px][py-1] === 'L') { new_pos.y = Math.max(new_pos.y, (py+1)*this.tilesize) }
        // Wall below
        if (this.map[px][py+1] === 'L') { new_pos.y = Math.min(new_pos.y, (py)*this.tilesize) }

        return new_pos;
    }

}
module.exports = {
    GameMap:GameMap
}
