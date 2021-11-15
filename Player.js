const mag = require("./utils.js").mag
const addVec = require("./utils.js").addVec
const setMag = require("./utils.js").setMag
const CONST = require('./Constants.js').CONST
const Maps = require("./MapFiles.js").Maps
const Treasure = require('./Treasure.js')
const {Weapons} = require('./Weapons/WeaponCollect.js')

const {Cannon} = require('./Weapons/Cannon.js')

/**
 *
 *
 * @class Player
 * Declared for each ship,
 * Handles Player input (wasd adds acceleration)
 * Handles Player Damage logic
 * Maintains the ship's status at each heartbeat
 * keeps a record of statistics that will be displayed at endgame.
 */
class Player{
    constructor(id,username, x, y, dir, healthobserver){
        this.pos = {x:x, y:y};
        this.dir = dir;
        this.size = CONST.PLAYER_SIZE;
        this.vel = {x:0, y:0};
        this.id = id;
        this.username = username;
        this.xacc = 0
        this.yacc = 0
        this.maxspeed = CONST.PLAYER_MAX_SPEED
        this.drag = CONST.PLAYER_DRAG
        this.cannon = new Cannon(CONST.RANGESTAT,CONST.CANNON_START_ANGLE,this)
        this.health = CONST.PLAYER_HEALTH
        this.hitbox_size = CONST.PLAYER_HITBOX_SIZE
        this.dim = {a:80/2,b:48/2}
        this.gold = CONST.PLAYER_START_GOLD;
        this.hit = false

        this.invincible = false;

        this.treasure_fish_time = CONST.TREASURE_FISH_TIME
        this.SpaceCounter = 0
        this.SpacePressed = false
        this.OnTreasure = false
        this.healthobserver = healthobserver

        this.effects = {}
        this.effects["InvinceArmor"] = new Weapons["InvinceArmor"](this,CONST.INVINCIBILITY_FRAMES)


        var starttime = Date.now()
        this.gamestat = {
            kill: 0,
            goldstat :{
                gold_time: [starttime],
                gold_amount: [this.gold],
            },
            killstat :{
                kill_time : [starttime],
                kill_amount: [0]
            }
        }
    }
    /**
     *
     * Called everytime the player killed another
     * ship and timestamps it for later
     *
     */
    addkillstat(){
        this.gamestat.kill += 1;
        this.gamestat.killstat.kill_amount.push(this.gamestat.kill)
        this.gamestat.killstat.kill_time.push(Date.now())
    }
    /**
     *
     * Called everytime the player collects a treasure
     * and timestamps it for later
     */
    addgoldstat(gold){
        this.gold += gold
        this.gamestat.goldstat.gold_time.push(Date.now())
        this.gamestat.goldstat.gold_amount.push(this.gold)
    }

    /**
     *
     * check whether this ship and any other ship's elliptical collision region is intersecting.
     */
    collisionCheck(players,eventmanager){

        // we assume a circle/elliptical collision zone that pushes the player
        for(var i in players){
            if (players[i].id !== this.id){
                var posangle = Math.atan2(players[i].pos.y-this.pos.y,players[i].pos.x-this.pos.x)
                var center_distance = mag(players[i].pos.x-this.pos.x,players[i].pos.y-this.pos.y)
                var dir_rad_1 = this.dim.a*this.dim.b/Math.sqrt( (this.dim.b*Math.cos(posangle-this.dir))**2+(this.dim.a*Math.sin(posangle-this.dir))**2  )
                var dir_rad_2 = this.dim.a*this.dim.b/Math.sqrt( (this.dim.b*Math.cos(posangle-players[i].dir))**2+(this.dim.a*Math.sin(posangle-players[i].dir))**2  )

                if (center_distance <= (dir_rad_1 + dir_rad_2)){
                    this.onCollision(players[i],dir_rad_1,dir_rad_2,center_distance,posangle,eventmanager)
                }
            }
        }
    }
    /**
     * handles collision logic including push back and collision damage.
     * this is called for each ship in collision as the separation/addition
     * of speed to position is handled in gamemap
     *
     */
    onCollision(collided,this_dir_rad,collided_dir_rad,total_dist,collided_angle,eventmanager){
        ////pass forward momentum
        collided.vel.x = CONST.PLAYER_MAX_SPEED*Math.cos(collided_angle)
        collided.vel.y = CONST.PLAYER_MAX_SPEED*Math.cos(collided_angle)
        this.collisionDamage(collided,collided_angle,eventmanager)
    }
    /**
     *
     * assign collision damage to this ship and the ship which
     * this ship collided with, with the adjusted angle penalty.
     * (angle of collision for each ship dictates how much damage is received)
     * (more on the side, less on the front and rear)
     */
    collisionDamage(collided,angle,eventmanager){
        var altangle = Math.sign(angle)*(-1) *(2*Math.PI-Math.abs(angle))
        var speed = mag(this.vel.x-collided.vel.x,this.vel.y-collided.vel.y)
        // this takes damage
        var absdiff = Math.abs(angle-this.dir)
        var absdiff2 = Math.abs(altangle-this.dir)
            // side damage
        if ((absdiff> Math.PI/6 && absdiff < 5*Math.PI/6) || (absdiff2> Math.PI/6 && absdiff2 < 5*Math.PI/6) ) {
            this.takeDamage(CONST.SIDE_DAMAGE_MULTIPLIER*speed, eventmanager,collided.id)
        }
            // front or back damage
        else {
            this.takeDamage(CONST.FRONT_BACK_DAMAGE_MULTIPLIER*speed, eventmanager,collided.id)
        }
        // collided takes damage
        var absdiff = Math.abs(angle-collided.dir)
        var absdiff2 = Math.abs(altangle-collided.dir)
        if ( (absdiff> Math.PI/6 && absdiff < 5*Math.PI/6) || (absdiff2> Math.PI/6 && absdiff2 < 5*Math.PI/6) ) {
            collided.takeDamage(CONST.SIDE_DAMAGE_MULTIPLIER*speed, eventmanager,this.id)
        } else {
            collided.takeDamage(CONST.FRONT_BACK_DAMAGE_MULTIPLIER*speed, eventmanager,this.id)
        }

    }
    /**
     * let this ship to take damage, and add audiovisual event to the front end.
     * On death notifies HealthObserver to remove this ship from game.
     */
    takeDamage(damage, eventmanager,idfrom){
        if (!this.invincible) {
            if (this.health > 0){
                this.health -=damage
                if (this.health <= 0){
                    eventmanager.add_sound("death", this.pos)
                    eventmanager.add_animation({
                        type: "death",
                        pos: this.pos,
                        dir: this.dir,
                        frame: 0,
                    })
                    this.healthobserver.playerDied(this.id,idfrom)
                    return "dead"
                } else {
                    this.hit = true
                    eventmanager.add_sound("damage", this.pos)
                }
            }
        }
    }

    heal(amt, eventmanager){
        if (!this.invincible) {
            this.health = Math.min(CONST.PLAYER_HEALTH, this.health+amt)
            eventmanager.add_sound("heal", this.pos)
        }
    }

    /**
     *
     * handles the ship's weapon effect countdown, invincibility countdown,
     * and changes this ship's velocity every heartbeat/frame update.
     */
    update(players, eventmanager,paths,costs,tupleval,index,Gmap,forbidden,projectiles) {

        this.hit = false

        // Called on every heartbeat
        //check whether to remove effect
        var effectdone = 1
        for (var key in this.effects) {
            if ( effectdone === this.effects[key].countdown()){
                delete this.effects[key]
            }
        }


        // Determine if we are on treasure
        this.updateOnTreasure(Gmap.is_on_treasure(this.pos))

        // change the velocity according to current drag and acceleration..
        // wasd acc movement version
        this.vel = {x:this.vel.x+this.xacc,y:this.vel.y+this.yacc}
        this.vel = setMag(this.vel, Math.min (Math.max(mag(this.vel.x,this.vel.y)-this.drag,0),this.maxspeed ) )
        if (mag(this.vel.x,this.vel.y)>0.0001){
            this.dir = Math.atan2(this.vel.y,this.vel.x)
        }
        this.cannon.update()

        this.collisionCheck(players,eventmanager)
    };
    /**
     *
     * Called inside heartbeat along with this.update,
     * checks for conditions for treasure fishng and whether
     * that treasure can be collected. Once collected, remove treasure
     * from gamemap (param) add corresponding treasures to the player
     * (including weapons, health and gold)
     */
    updateTreasure(gamemap, eventmanager) {
        if (this.OnTreasure && this.SpacePressed) {
            if (this.SpaceCounter == CONST.TREASURE_FISH_TIME) {
                //Remove Treasure coordinates
                let encap = {x: Math.floor(this.pos.x/gamemap.tilesize), y: Math.floor(this.pos.y/gamemap.tilesize)};
                let treasure = gamemap.treasurelist.get_treasure(encap)
                if (treasure){
                    gamemap.treasurelist.remove_treasure(encap)

                    this.addgoldstat(treasure.gold)

                    if (this.health + treasure.health >= CONST.PLAYER_HEALTH) {
                      this.health = CONST.PLAYER_HEALTH
                    } else {
                      this.health += treasure.health
                    }

                    if (Weapons.hasOwnProperty(treasure.weaponID)){
                        this.effects[treasure.weaponID] = new Weapons[treasure.weaponID](this)
                    }

                    eventmanager.add_sound("get_treasure", this.pos)

                    // Obtain type of treasure
                    var treasure_type = treasure.type
                    if (treasure_type == 'weapon') {
                        treasure_type = treasure.weaponID
                    }

                    eventmanager.add_animation({
                        type: "get_treasure",
                        treasure_type: treasure_type,
                        pos: this.pos,
                        frame: 0,
                    })
                }
                this.SpaceCounter = 0;
                this.OnTreasure = false;
                this.SpacePressed = false;
            } else if (this.SpaceCounter < CONST.TREASURE_FISH_TIME) {
                this.SpaceCounter++;
            }
        }
    }
    // simple update on internal attributes whether this is on a treasure.
    updateOnTreasure(x) {
        this.OnTreasure = x
    }
    // simple update on internal attributes of whether user pressed onto space, called in server.js
    updateSpacePressed(x) {
        this.SpacePressed = x
    }


    //ensures the player doesn't go beyond the map
    constrain() {
        if ( this.pos.y >= 600) { this.pos.y = 600; }
        if ( this.pos.x >= 600) { this.pos.x = 600; }
        if ( this.pos.y <= 0) { this.pos.y = 0; }
        if ( this.pos.x <= 0) { this.pos.x = 0; }

    }
    // wrapper for player's cannon's fire function
    fire(targetX,targetY){
        return this.cannon.fire(targetX, targetY)
    }

}

module.exports = {
    Player: Player,
}
