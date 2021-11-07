const mag = require("./utils.js").mag
const addVec = require("./utils.js").addVec
const setMag = require("./utils.js").setMag
const CONST = require('./Constants.js').CONST
const Maps = require("./MapFiles.js").Maps
const Treasure = require('./Treasure.js')
const {Weapons} = require('./Weapons/WeaponCollect.js')

const {Cannon} = require('./Weapons/Cannon.js')

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
        //this.cannon = new Cannon(this.size*CONST.CANNON_VISION_FACTOR, CONST.CANNON_START_ANGLE, this)
        this.cannon = new Cannon(CONST.RANGESTAT,CONST.CANNON_START_ANGLE,this)
        this.health = CONST.PLAYER_HEALTH
        this.hitbox_size = CONST.PLAYER_HITBOX_SIZE
        this.dim = {a:80/2,b:48/2} // to replace hitbox_size
        this.gold = CONST.PLAYER_START_GOLD;

        this.invincible = true;
        this.invinc_time = 0;

        this.treasure_fish_time = CONST.TREASURE_FISH_TIME
        this.SpaceCounter = 0
        this.SpacePressed = false
        this.OnTreasure = false
        this.healthobserver = healthobserver

        this.effects = {}
    }

    invincTick() {
        this.invinc_time++;
        if (this.invinc_time >= CONST.INVINCIBILITY_FRAMES) {
            this.invincible = false;
        }
    }


    collisionCheck(players,soundmanager){

        // we assume a circle/elliptical collision zone that pushes the player
        //for(var i = 0; i< players.length; i++){
        for(var i in players){
            //console.log(i)
            if (players[i].id !== this.id){
                var posangle = Math.atan2(players[i].pos.y-this.pos.y,players[i].pos.x-this.pos.x)
                var center_distance = mag(players[i].pos.x-this.pos.x,players[i].pos.y-this.pos.y)
                var dir_rad_1 = this.dim.a*this.dim.b/Math.sqrt( (this.dim.b*Math.cos(posangle-this.dir))**2+(this.dim.a*Math.sin(posangle-this.dir))**2  )
                var dir_rad_2 = this.dim.a*this.dim.b/Math.sqrt( (this.dim.b*Math.cos(posangle-players[i].dir))**2+(this.dim.a*Math.sin(posangle-players[i].dir))**2  )

                if (center_distance <= (dir_rad_1 + dir_rad_2)){
                    this.onCollision(players[i],dir_rad_1,dir_rad_2,center_distance,posangle,soundmanager)
                }
            }
        }
    }
    onCollision(collided,this_dir_rad,collided_dir_rad,total_dist,collided_angle,soundmanager){
        //first separate collided entities
        var shared_dist = -(total_dist -  this_dir_rad - collided_dir_rad)

        // collided.pos.x += Math.ceil(shared_dist)*Math.cos(collided_angle)
        // collided.pos.y += Math.ceil(shared_dist)*Math.sin(collided_angle)
        // this.pos.x += Math.ceil(shared_dist)*Math.cos(collided_angle+Math.PI)
        // this.pos.y += Math.ceil(shared_dist)*Math.sin(collided_angle+Math.PI)

        ////pass forward momentum
        collided.vel.x = CONST.PLAYER_MAX_SPEED*Math.cos(collided_angle)
        collided.vel.y = CONST.PLAYER_MAX_SPEED*Math.cos(collided_angle)

        //collided.vel.x = this.vel.x*3.5 //0.9 //xacc*10
        //collided.vel.y = this.vel.y*3.5 //0.9 //yacc*10
        //collided.pos.x += this.vel.x*5//xacc*10
        //collided.pos.y += this.vel.y*5//yacc*10
        //
        //// receives momentum
        //this.vel.x /= 2//collided.vel.x //+= collided.xacc*10
        //this.vel.y /= 2//collided.vel.x //+= collided.yacc*10

        this.collisionDamage(collided,collided_angle,soundmanager)
        //console.log(this,collided)
    }
    collisionDamage(collided,angle,soundmanager){
        var altangle = Math.sign(angle)*(-1) *(2*Math.PI-Math.abs(angle))
        var speed = mag(this.vel.x-collided.vel.x,this.vel.y-collided.vel.y)
        // this takes damage
        var absdiff = Math.abs(angle-this.dir)
        var absdiff2 = Math.abs(altangle-this.dir)
            // side damage
        if ((absdiff> Math.PI/6 && absdiff < 5*Math.PI/6) || (absdiff2> Math.PI/6 && absdiff2 < 5*Math.PI/6) ) {
            //((absdiff>field && absdiff<(Math.PI-field)) || (absdiff2> field && absdiff2<(Math.PI-field)))
            this.takeDamage(CONST.SIDE_DAMAGE_MULTIPLIER*speed, soundmanager)
        }
            // front or back damage
        else {
            this.takeDamage(CONST.FRONT_BACK_DAMAGE_MULTIPLIER*speed, soundmanager)
        }
        // collided takes damage
        var absdiff = Math.abs(angle-collided.dir)
        var absdiff2 = Math.abs(altangle-collided.dir)
        if ( (absdiff> Math.PI/6 && absdiff < 5*Math.PI/6) || (absdiff2> Math.PI/6 && absdiff2 < 5*Math.PI/6) ) {
            collided.takeDamage(CONST.SIDE_DAMAGE_MULTIPLIER*speed, soundmanager)
        } else {
            collided.takeDamage(CONST.FRONT_BACK_DAMAGE_MULTIPLIER*speed, soundmanager)
        }

    }

  takeDamage(damage, soundmanager){
        if (!this.invincible) {
            if (this.health > 0){
                this.health -=damage
                if (this.health <= 0){
                    soundmanager.add_sound("death", this.pos)
                    this.healthobserver.playerDied(this.id)
                    //
                    return "dead"
                } else {
                    soundmanager.add_sound("damage", this.pos)
                }
            }
        }
    }

    endGame(){

    }
    dropTreasure(){
      //rip drop treasure
    }
    toJSON() {
        return {
            pos : this.pos,
            dir : this.dir,
            size : this.size,
            username : this.username,
            health : this.health,
            hitbox_size : this.hitbox_size,
            gold : this.gold,
            treasure_fish_time : CONST.TREASURE_FISH_TIME,
            cannon : this.cannon.toJSON(),
            invincible : this.invincible,
        }
    }

    update(players, soundmanager,paths,costs,tupleval,index,Gmap,forbidden,projectiles) {
        // Called on every heartbeat
        //check whether to remove effect
        var effectdone = 1
        for (var key in this.effects) {
            if ( effectdone === this.effects[key].countdown()){
                delete this.effects[key]
            }
        }
        
        // Tick invincibility
        this.invincTick()
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

        this.collisionCheck(players,soundmanager)
    };

    updateTreasure(gamemap, soundmanager) {
        if (this.OnTreasure && this.SpacePressed) {
            if (this.SpaceCounter == CONST.TREASURE_FISH_TIME) {
                //Remove Treasure coordinates
                let encap = {x: Math.floor(this.pos.x/gamemap.tilesize), y: Math.floor(this.pos.y/gamemap.tilesize)};
                let treasure = gamemap.treasurelist.get_treasure(encap)
                if (treasure){
                    gamemap.treasurelist.remove_treasure(encap)

                    this.gold += treasure.gold

                    if (this.health + treasure.health >= CONST.PLAYER_HEALTH) {
                      this.health = CONST.PLAYER_HEALTH
                    } else {
                      this.health += treasure.health
                    }

                    if (Weapons.hasOwnProperty(treasure.weaponID)){
                        this.effects[treasure.weaponID] = new Weapons[treasure.weaponID](this)
                    }

                    soundmanager.add_sound("get_treasure", this.pos)
                }
                this.SpaceCounter = 0;
                this.OnTreasure = false;
                this.SpacePressed = false;
            } else if (this.SpaceCounter < CONST.TREASURE_FISH_TIME) {
                this.SpaceCounter++;
            }
        }
    }

    updateOnTreasure(x) {
        this.OnTreasure = x
    }

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
    fire(targetX,targetY){
        return this.cannon.fire(targetX, targetY)
    }

}

module.exports = {
    Player: Player,
    //Cannonball:Cannonball
}
