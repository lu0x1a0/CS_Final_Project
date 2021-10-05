const addVec = require("./utils.js").addVec
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
        this.length = 32
        this.width = 32
        this.tilesize = 32
    }
    player_move(pos, vel, hitbox_size) {

        var new_pos = addVec(pos,vel)//p5.Vector.add(pos, vel)

        // Currently just check centre point
        var px = Math.floor((pos.x)/this.tilesize)
        var py = Math.floor((pos.y)/this.tilesize)
        //console.log(
        //    "------------------------------\n\n",
        //    px,py,"\n",
        //    "------------------------------\n\n",
        //)
        //console.log(
        //    this.map.length,
        //    this.map[0].length
        //)

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
