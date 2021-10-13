const CONST = require('./Constants.js').CONST
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
        this.tilesize = CONST.TILESIZE;
        this.max_treasure = map.max_treasure;

        // Initialize treasure
        this.treasurelist = new TreasureList(this)

        // Initialize spawn positions
        this.spawns = []
        for (let x = 0; x < this.xlen; x++) {
            for (let y = 0; y < this.ylen; y++) {
                if (this.map[x][y] === 'S') {
                    this.spawns.push({x:x,y:y});
                }
            }
        }

    }

    get_spawn() {
        // TODO: implement multiple spawn points
        return {
            x:(this.spawns[0].x + 0.5)*this.tilesize,
            y:(this.spawns[0].y + 0.5)*this.tilesize,
        }
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

    try_add_treasure() {
        
        if (this.treasurelist.treasure_array.length < this.max_treasure) {
            this.treasurelist.add_treasure(this)
        }

    }

    player_move(pos, vel, hitbox_size) {

        var new_pos = addVec(pos,vel)//p5.Vector.add(pos, vel)

        // Currently just check centre point
        var px = Math.floor((pos.x)/this.tilesize)
        var py = Math.floor((pos.y)/this.tilesize)

        // Wall left
        if (this.map[px-1][py] === 'L') { new_pos.x = Math.max(new_pos.x, (px)*this.tilesize + 0.5*hitbox_size) }
        // Wall right
        if (this.map[px+1][py] === 'L') { new_pos.x = Math.min(new_pos.x, (px+1)*this.tilesize - 0.5*hitbox_size) }
        // Wall above
        if (this.map[px][py-1] === 'L') { new_pos.y = Math.max(new_pos.y, (py)*this.tilesize + 0.5*hitbox_size) }
        // Wall below
        if (this.map[px][py+1] === 'L') { new_pos.y = Math.min(new_pos.y, (py+1)*this.tilesize - 0.5*hitbox_size) }

        return new_pos;
    }

}
module.exports = {
    GameMap:GameMap
}
