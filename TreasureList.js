const addVec = require("./utils.js").addVec

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
            this.treasure_array.push(coords)
        }
    }

    remove_treasure(coords) {
        for (let i = 0; i < this.treasure_array.length; i++) {
            if (this.treasure_array[i] === coords) { 
                this.treasure_array.splice(i,1);
                break;
            }
        }
    }
}
module.exports = {
    TreasureList:TreasureList
}
