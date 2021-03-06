const CONST = require('./Constants.js').CONST
const addVec = require("./utils.js").addVec
const TreasureList = require("./TreasureList.js").TreasureList
const TurretList = require("./TownTurrets.js").TurretList
const StationList = require("./Stations.js").StationList
const WhirlList = require('./Whirlpool.js').WhirlList

/**
 *
 * Collective handler of all maptiles related events such as object movement 
 * and object spawning.
 * 
 */
class GameMap {
    constructor(map) {

        this.map = map.map;
        // Transpose so that x/y coords match board
        this.map = this.map.reduce((prev, next) => next.map((item, i) => (prev[i] || []).concat(next[i])), []);

        // Map parameters
        this.xlen = map.xlen
        this.ylen = map.ylen
        this.tilesize = CONST.TILESIZE
        this.max_treasure = map.max_treasure
        this.min_players = map.min_players

        // Initialize
        this.treasurelist = new TreasureList(this)
        this.turretlist = new TurretList(this)
        this.stationlist = new StationList(this)
        this.whirllist =  new WhirlList(this,map.max_whirls)

        // Initialize spawn positions
        this.whichSpawn = 0
        this.spawns = []
        for (let x = 0; x < this.xlen; x++) {
            for (let y = 0; y < this.ylen; y++) {
                if (this.map[x][y] === 'S') {
                    this.spawns.push({x:x,y:y});
                }
            }
        }
    }
    // find available position that whirlpool can move to
    gridAroundAvail(cp){
        //cp : current position
        var avail = []
        if ( (cp.x-1)>=0 && (cp.y-1)>=0 && this.map[cp.x-1][cp.y-1]==' ' ){
            avail.push({x:cp.x-1,y:cp.y-1})          
        }
        if ( (cp.x-1)>=0  && this.map[cp.x-1][cp.y]==' '){
            avail.push({x:cp.x-1,y:cp.y})          
        }
        if ( (cp.y-1)>=0  && this.map[cp.x][cp.y-1]==' '){
            avail.push({x:cp.x,y:cp.y-1})          
        }
        
        if ( (cp.x+1)<this.xlen && (cp.y+1)<this.ylen && this.map[cp.x+1][cp.y+1]==' '){
            avail.push({x:cp.x,y:cp.y+1})          
        }
        if ( (cp.x+1)<this.xlen && this.map[cp.x+1][cp.y]==' '){
            avail.push({x:cp.x+1,y:cp.y})          
        }
        if ( (cp.y+1)<this.ylen && this.map[cp.x][cp.y+1]==' '){
            avail.push({x:cp.x,y:cp.y+1})          
        }

        if ( (cp.x+1)<this.xlen && (cp.y-1)>=0  && this.map[cp.x+1][cp.y-1]==' '){
            avail.push({x:cp.x+1,y:cp.y})          
        }
        if ( (cp.x-1)>=0 && (cp.y+1)<this.ylen  && this.map[cp.x-1][cp.y+1]==' '){
            avail.push({x:cp.x,y:cp.y+1})          
        }
        return avail
    }
    // Picks the current valid spawn point for ships.
    get_spawn() {
        // Rotate which spawn we use
        this.whichSpawn ++
        if (this.whichSpawn >= this.spawns.length) { this.whichSpawn = 0 }
        // Return spawn coordinates
        return {
            x:(this.spawns[this.whichSpawn].x + 0.5)*this.tilesize,
            y:(this.spawns[this.whichSpawn].y + 0.5)*this.tilesize,
        }
    }

    /**
     * creates a random coordinate that is allowed to spawn a treasure on 
     * (only on water tiles)
     *
     */
    generate_treasure_coords() {

        var randx = Math.floor(Math.random()*this.xlen);
        var randy = Math.floor(Math.random()*this.ylen);

        // Generate until we hit water
        while (this.map[randx][randy] !== ' ') {
            randx = Math.floor(Math.random()*this.xlen);
            randy = Math.floor(Math.random()*this.ylen);
        }

        // this.map[randx][randy] != ' '
        return {x:randx, y:randy};
    }
    /**
     *  add treasures when the total avail treasure is low -
     *  i.e. at the beginning of the game or when a lot of 
     *  players have left or frequency of combat is low
     */
    try_add_treasure() {
        
        if (this.treasurelist.treasure_array.length < this.max_treasure) {
            this.treasurelist.add_treasure(this)
        }

    }
    /**
     *
     * check whether a position (player's) coincide with that of the treasure
     */
    is_on_treasure(pos) {
        for (let i = 0; i < this.treasurelist.treasure_array.length; i++) {
            let encap = {x: Math.floor(pos.x/this.tilesize), y: Math.floor(pos.y/this.tilesize)}
            if (encap.x === this.treasurelist.treasure_array[i].x && encap.y === this.treasurelist.treasure_array[i].y) {
                return true
            }
        }
        return false
    }
    /**
     *
     * move the given player according to its velocity and surroundings 
     * (i.e. is the tile passable)
     */
    player_move(player, soundmanager) {

        // Impassible tiles
        var impassible = ['L', 'T', 'H']

        var new_pos = addVec(player.pos, player.vel)//p5.Vector.add(pos, vel)

        // Currently just check centre point
        var px = Math.floor((player.pos.x)/this.tilesize)
        var py = Math.floor((player.pos.y)/this.tilesize)

        // Wall left
        if (impassible.includes(this.map[px-1][py])) {
            if (new_pos.x < (px)*this.tilesize + 0.5*player.hitbox_size) {player.takeDamage(CONST.WALL_DAMAGE, soundmanager)}
            new_pos.x = Math.max(new_pos.x, (px)*this.tilesize + 0.5*player.hitbox_size)
        }
        // Wall right
        if (impassible.includes(this.map[px+1][py])) {
            if (new_pos.x > (px+1)*this.tilesize - 0.5*player.hitbox_size) {player.takeDamage(CONST.WALL_DAMAGE, soundmanager)}
            new_pos.x = Math.min(new_pos.x, (px+1)*this.tilesize - 0.5*player.hitbox_size)
        }
        // Wall above
        if (impassible.includes(this.map[px][py-1])) {
            if (new_pos.y < (py)*this.tilesize + 0.5*player.hitbox_size) {player.takeDamage(CONST.WALL_DAMAGE, soundmanager)}
            new_pos.y = Math.max(new_pos.y, (py)*this.tilesize + 0.5*player.hitbox_size)
        }
        // Wall below
        if (impassible.includes(this.map[px][py+1])) {
            if (new_pos.y > (py+1)*this.tilesize - 0.5*player.hitbox_size) {player.takeDamage(CONST.WALL_DAMAGE, soundmanager)}
            new_pos.y = Math.min(new_pos.y, (py+1)*this.tilesize - 0.5*player.hitbox_size)
        }

        // If the new position is still in a wall, use old position
        if (!impassible.includes(this.map[Math.floor((new_pos.x)/this.tilesize)][Math.floor((new_pos.y)/this.tilesize)])) {
            player.pos = new_pos;
        }
        
        // take whirlpool damage
        var key = px.toString() + '-' + py.toString()
        if (key in this.whirllist.whirl_coord_map) {
            player.takeDamage(CONST.WHIRL_DAMAGE,soundmanager)
        }
    }

}
module.exports = {
    GameMap:GameMap
}
