const addVec = require("./utils.js").addVec
const CONST = require('./Constants.js').CONST
const Treasure = require('./Treasure.js')
const {Weapons} = require('./Weapons/WeaponCollect.js')

class TreasureList {

    constructor(gamemap) {

        this.treasure_array = [];
        this.max_treasure = gamemap.max_treasure;
        this.tilesize = gamemap.tilesize

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

        // Decide on the type of treasure (Gold, Health, Weapon)
        var types = ['gold', 'health', 'weapon']
        var type = types[Math.floor(Math.random()*types.length)]

        if (double_treasure == false) {
            var gold = CONST.TREASURE_GOLD
            var health = 0
            var weaponID = 0

            switch (type) {
                case 'gold':
                    gold += CONST.TREASURE_BONUS_GOLD
                    break
                case 'health':
                    health += CONST.TREASURE_HEALTH
                    break
                case 'weapon':
                    var keys = Object.keys(Weapons)
                    weaponID = keys[Math.floor(Math.random()*keys.length)]
                    break
            }

          let treasure = new Treasure(type,coords,gold,health,weaponID)
          this.treasure_array.push(treasure)
        }
    }

    add_death_treasure(coords,gold) {

        // Death treasures are like regular treasures, but with the killed players' gold
        
        // Don't add death treasure if we are past the dead treasure limit
        if (this.treasure_array.length >= CONST.DEATH_TREASURE_FACTOR*this.max_treasure) { return }

        // Convert to map coordinates
        coords = {x: Math.floor(coords.x/this.tilesize),y: Math.floor(coords.y/this.tilesize)}

        // Treasure array will never contain duplicate treasures
        var double_treasure = false;
        for (let treasure of this.treasure_array) {
            if (treasure === coords) { double_treasure = true; }
        }

        // Decide on the type of treasure (Gold, Health, Weapon)
        var types = ['gold', 'health', 'weapon']
        var type = types[Math.floor(Math.random()*types.length)]

        if (double_treasure == false) {
            var health = 0
            var weaponID = 0

            switch (type) {
                case 'gold':
                    gold += CONST.TREASURE_BONUS_GOLD
                    break
                case 'health':
                    health += CONST.TREASURE_HEALTH
                    break
                case 'weapon':
                    var keys = Object.keys(Weapons)
                    weaponID = keys[Math.floor(Math.random()*keys.length)]
                    break
            }

          let treasure = new Treasure(type,coords,gold,health,weaponID)
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
