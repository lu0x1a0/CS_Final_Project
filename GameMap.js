const addVec = require("./utils.js").addVec
const TreasureList = require("./TreasureList.js").TreasureList

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

        // Initialize treasure
        this.treasurelist = new TreasureList(this)

    }


    generate_treasure_coords() {

        var randx = Math.floor(Math.random()*this.xlen);
        var randy = Math.floor(Math.random()*this.ylen);

        // Generate until we hit water
        while (this.map[randx][randy] !== 'W') {
            randx = Math.floor(Math.random()*this.xlen);
            randy = Math.floor(Math.random()*this.ylen);
        }

        // this.map[randx][randy] != 'W'
        return {x:randx, y:randy};
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
