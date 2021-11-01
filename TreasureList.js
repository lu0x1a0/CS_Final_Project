const addVec = require("./utils.js").addVec
const CONST = require('./Constants.js').CONST
const Treasure = require('./Treasure.js')

class TreasureList {

    constructor(gamemap) {

        this.treasure_array = [];
        this.max_treasure = gamemap.max_treasure;

        // Attempt to generate treasure
        for (let i = 0; i < this.max_treasure; i++) {
            // If we hit a water tile, add to list
            this.add_treasure(gamemap)
        }

    }

    add_treasure(gamemap) {

        // Try to generate coordinates - guaranteed to be on water
        var coords = gamemap.generate_treasure_coords()

        // Treasure array will never contain duplicate treasures
        var double_treasure = false;
        for (let treasure of this.treasure_array) {
            if (treasure === coords) { double_treasure = true; }
        }
        if (double_treasure == false) {
          var gold = 0
          var health = 0
          if ( Math.random() >= CONST.GOLD_HEALTH_CHANCE ) {
            gold = CONST.GOLD_AMT
          } else {
            health = CONST.MAX_HEALTH_AMT
          }
          let treasure = new Treasure(coords.x,coords.y,gold,health,0)
          this.treasure_array.push(treasure)
        }
    }

    add_death_treasure(coords,gold,health,id) {


        // Treasure array will never contain duplicate treasures
        var double_treasure = false;
        for (let treasure of this.treasure_array) {
            if (treasure === coords) { double_treasure = true; }
        }
        if (double_treasure == false) {
          var gold = 0
          var health = 0
          if ( Math.random() >= CONST.GOLD_HEALTH_CHANCE ) {
            gold = CONST.GOLD_AMT
          } else {
            health = CONST.MAX_HEALTH_AMT
          }
          let treasure = new Treasure(coords.x,coords.y,gold,health,id)
          this.treasure_array.push(treasure)
        }
    }

    get_treasure(coords) {
        for (let i = 0; i < this.treasure_array.length; i++) {
            if (this.treasure_array[i].x == coords.x && this.treasure_array[i].y == coords.y) {
                return this.treasure_array[i];
            }
        }
    }

    remove_treasure(coords) {
        for (let i = 0; i < this.treasure_array.length; i++) {
            if (this.treasure_array[i].x == coords.x && this.treasure_array[i].y == coords.y) {
                this.treasure_array.splice(i,1);
                break;
            }
        }
    }
}
module.exports = {
    TreasureList:TreasureList
}
