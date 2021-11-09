class Treasure{
  constructor(type,coords,gold,health,weaponID) {
    this.x = coords.x
    this.y = coords.y
    this.type = type
    this.gold = gold
    this.health = health
    this.weaponID = weaponID
  }


}
module.exports = Treasure
