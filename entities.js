const mag = require("./utils.js").mag
const addVec = require("./utils.js").addVec
const setMag = require("./utils.js").setMag
const CONST = require('./Constants.js').CONST
const Maps = require("./MapFiles.js").Maps
const sin = Math.sin
const cos = Math.cos
const sqrt = Math.sqrt



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
        this.isBot = false;
        this.gold = CONST.PLAYER_START_GOLD;

        this.invincible = true;
        this.invinc_time = 0;

        this.SpaceCounter = 0
        this.SpacePressed = false
        this.OnTreasure = false
        this.healthobserver = healthobserver
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
        collided.pos.x += Math.ceil(shared_dist)*Math.cos(collided_angle)
        collided.pos.y += Math.ceil(shared_dist)*Math.sin(collided_angle)
        this.pos.x += Math.ceil(shared_dist)*Math.cos(collided_angle+Math.PI)
        this.pos.y += Math.ceil(shared_dist)*Math.sin(collided_angle+Math.PI)

        ////pass forward momentum 
        collided.vel.x += this.vel.x*1.5 //0.9 //xacc*10
        collided.vel.y += this.vel.y*1.5 //0.9 //yacc*10
        //collided.pos.x += this.vel.x*5//xacc*10
        //collided.pos.y += this.vel.y*5//yacc*10
        //
        //// receives momentum
        this.vel.x /= 2//collided.vel.x //+= collided.xacc*10
        this.vel.y /= 2//collided.vel.x //+= collided.yacc*10
        
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
        if ( (absdiff> Math.PI/6 && absdiff < 5*Math.PI/6) || (absdiff2> Math.PI/6 && absdiff2 < 5*Math.PI/6) ) {
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
                    this.endGame()
                    return "dead"
                } else {
                    soundmanager.add_sound("damage", this.pos)
    
                }
            }
        }
    }
  
    endGame(){
        this.healthobserver.playerDied(this.id)
    }
    dropTreasure(){

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
            cannonJSON : this.cannon.toJSON(),
            invincible : this.invincible,
        }
    }


    update(players,soundmanager) {
        // Called on every heartbeat
        
        this.invincTick()

        // change the velocity according to current drag and acceleration..
        // wasd acc movement version
        if (!this.isBot) {
            this.vel = {x:this.vel.x+this.xacc,y:this.vel.y+this.yacc}
            this.vel = setMag(this.vel, Math.min (Math.max(mag(this.vel.x,this.vel.y)-this.drag,0),this.maxspeed ) )
            this.pos = addVec(this.pos,this.vel)
            if (mag(this.vel.x,this.vel.y)>0.0001){
                this.dir = Math.atan2(this.vel.y,this.vel.x)
            }
            this.cannon.update()
        } else {
            this.updateBot(players);
        }
        this.collisionCheck(players,soundmanager)
    };

    updateTreasure(gamemap, soundmanager) {
        if (this.OnTreasure && this.SpacePressed) {
            if (this.SpaceCounter == CONST.TREASURE_FISH_TIME) {
                //Remove Treasure coordinates 
                let encap = {x: Math.floor(this.pos.x/gamemap.tilesize), y: Math.floor(this.pos.y/gamemap.tilesize)};
                gamemap.treasurelist.remove_treasure(encap)
                soundmanager.add_sound("get_treasure", this.pos)
                this.gold += CONST.GOLD_AMT;
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

    updateBot(players) {
        const GameMap = require("./GameMap.js").GameMap
        var Gmap = new GameMap(Maps.MapSquare)
        var map = Gmap.map;

        var playerSet = new Set();

        let decision = 0; 
        if (this.health <= CONST.BOT_LOW_HEALTH) {
            decision = 1;
        }

        //for(let i = 0; i<players.length;i++) {
        for (var i in players){
            let pixelX = players[i].pos.x
            let pixelY = players[i].pos.y
            let factor = Gmap.tilesize
            let x = Math.floor(pixelX/factor)
            let y = Math.floor(pixelY/factor)
            let tmp = [x,y]
            playerSet.add(tmp)
            map[x][y] = 'P'
        }

        let Visited = Array(Gmap.xlen).fill().map(() => Array(Gmap.ylen).fill(0));
        var parents = {}
        let BotX = Math.floor(this.pos.x/Gmap.tilesize)
        let BotY = Math.floor(this.pos.y/Gmap.tilesize)
        var start = [BotX,BotY]
        //console.log(Visited)
        //console.log(Visited.length)

        Visited[BotX][BotY] = 1;
        var end = []
        var Q = []
        Q.push(start)
        let j = 20;

        while (Q.length != 0) {
        let V = Q.shift()
        let AV = this.ComputeAdjacentVertex(V,map);
        let k = 0;
        for (let i = 0; i < AV.length; ++i) {
            if (!Visited[AV[i][0]][AV[i][1]]) {
                Visited[AV[i][0]][AV[i][1]] = 1;
                if (map[AV[i][0]][AV[i][1]] == 'W') {
                    parents[AV[i]] = V;
                    Q.push(AV[i])
                }
                else if (map[AV[i][0]][AV[i][1]] == 'P') {
                    end = AV[i];
                    parents[AV[i]] = V;
                    k = 1;
                    break;
                }
            }
        }
            if (k) {
                break;
            }
        }
        
        //for(let i = 0; i<players.length;i++) {
        for (var i in players){
            let pixelX = players[i].pos.x
            let pixelY = players[i].pos.y
            let factor = Gmap.tilesize
            let x = Math.floor(pixelX/factor)
            let y = Math.floor(pixelY/factor)
            map[x][y] = 'W'
        }

        let IndexDirection;
        if (decision) {
            if (end.length != 0) {
                IndexDirection = this.RunAwayIndex(start,end,map)
                this.DecisionHandler(start, IndexDirection)
            } 
        } 
        else if (end.length != 0) {
            IndexDirection = this.Decision(parents,start,end)  
            this.DecisionHandler(start, IndexDirection)
        } else {
            IndexDirection = this.RandomIndex(start,map)
            this.DecisionHandler(start, IndexDirection)
        }
    }

    RandomIndex(Start, map) {
        let Adjacents = this.ComputeAdjacentVertex(Start,map);
        return Adjacents[Math.floor(Math.random()*Adjacents.length)]
    }

    RunAwayIndex(Start, end, map) {
        let Adjacents = this.ComputeAdjacentVertex(Start,map);
        //Gets all the possible adjacent index
        let MagAdjacents = []
        for (let i = 0; i < Adjacents.length; ++i) {
            MagAdjacents.push(mag(Adjacents[i][0] - end[0], Adjacents[i][1] - end[1]))
        }
        //Find the largest element. //We can just use brute force
        let maxLists = []
        let max = MagAdjacents[0];
        let maxIndex = 0;
        for (let i = 1; i < MagAdjacents.length; ++i) {
            if (max < MagAdjacents[i]) {
                max = MagAdjacents[i];
                maxIndex = i;
            }
        }
        for (let i = 0; i < MagAdjacents.length; ++i) {
            if (max == MagAdjacents[i]) {
                maxLists.push(MagAdjacents)
            }
        }

        return maxLists[Math.floor(Math.random()*maxLists.length)]
    } 

    DecisionHandler(Start,DecisionIndex) {
        let i = Start[0] - DecisionIndex[0]
        let j = Start[1] - DecisionIndex[1]
        if (i == -1) {
            this.xacc = CONST.PLAYER_ACCELERATION
        }
        else if (i == 1) {
            this.xacc = -CONST.PLAYER_ACCELERATION
        }
        if (j == 1) {
            this.yacc = -CONST.PLAYER_ACCELERATION
        }
        else if (j == -1) {

            this.yacc = CONST.PLAYER_ACCELERATION
        }

        this.vel = {x:this.vel.x+this.xacc,y:this.vel.y+this.yacc}
        this.vel = setMag(this.vel, Math.min (Math.max(mag(this.vel.x,this.vel.y)-this.drag,0),this.maxspeed ) )
        this.pos = addVec(this.pos,this.vel)
        if (mag(this.vel.x,this.vel.y)>0.0001){
            this.dir = Math.atan2(this.vel.y,this.vel.x)
        }
    }

    Decision(parent, start, end) {
        //Start index
        var path = []
        path.push(end);
        let size = 1;
        while (path[size-1] != start) {
          path.push(parent[path[size-1]])
          size++;
        }
        return path[size-2];
      }

    ComputeAdjacentVertex(V,map) {
        var AV = [];
        if (map[V[0]-1][V[1]] != 'L') {
          AV.push([V[0]-1,V[1]])
        }

        if (map[V[0]-1][V[1]+1] != 'L') {
          AV.push([V[0]-1,V[1]+1])
        }

        if (map[V[0]-1][V[1]-1] != 'L') {
          AV.push([V[0]-1,V[1]-1])
        }

        if (map[V[0]+1][V[1]] != 'L') {
          AV.push([V[0]+1,V[1]])
        }

        if (map[V[0]+1][V[1]+1] != 'L') {
          AV.push([V[0]+1,V[1]+1])
        }

        if (map[V[0]+1][V[1]-1] != 'L') {
          AV.push([V[0]+1,V[1]-1])
        }

        if (map[V[0]][V[1]-1] != 'L') {
          AV.push([V[0],V[1]-1])
        }

        if (map[V[0]][V[1]+1] != 'L') {
          AV.push([V[0],V[1]+1])
        }
        return AV;
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
function Cannon(rangestat,visionfield,player){
    this.pos = player.pos
    this.visionfield = visionfield
    this.angle = 0
    this.player = player
    this.speed = player.maxspeed*CONST.CANNON_SPEED_FACTOR
    this.range = rangestat.b*rangestat.framelife*this.speed // b is redundant because its set to 1
    
    this.ellipsestat = {
        a :rangestat.a*rangestat.framelife*this.speed,
        b :rangestat.b*rangestat.framelife*this.speed
    }
    this.ellipsestat['x0'] = this.ellipsestat.a-this.ellipsestat.b 
    this.ellipsestat['y0'] = 0
    this.ellipserange = function(theta) {
        //theta is wrt the bow/front of the ship
        var a  = this.ellipsestat.a
        var b  = this.ellipsestat.b
        var x0 = this.ellipsestat.x0
        var y0 = this.ellipsestat.y0
        // solve quadratic
        var aa = (b*cos(theta))**2+(a*sin(theta))**2
        var bb = -2* ( b**2*x0*cos(theta)+a**2*y0*sin(theta)  )
        var cc = (b*x0)**2+(a*y0)**2-(a*b)**2
        var r1 = (-bb + sqrt(bb**2-4*aa*cc) )/(2*aa)
        //r2 = (-bb - sqrt(bb**2-4*aa*cc) )/(2*aa)
        return r1
    }
    this.update = function(){
      this.pos = this.player.pos
    }

    this.fire = function (targetX,targetY){
        var move = {x:targetX,y:targetY}
        if (mag(move)!==0){
            this.angle = Math.atan2(targetY,targetX)
            startpos = {x:this.pos.x,y:this.pos.y}
            // move slightly off player's collision zone so the ball doesn't hit the player
            shift = setMag({x:targetX,y:targetY},this.player.size/2+20)
            shiftstart = addVec(startpos,shift)
    
            // adj speed according to player velocity
            x = this.speed*Math.cos(this.angle)
            y = this.speed*Math.sin(this.angle)
            adjspeed = mag(x+this.player.vel.x,y+this.player.vel.y)
            move = setMag(move,this.ellipserange(this.angle-this.player.dir))//,this.range)
            
            var data = {
                start:shiftstart,
                end:{x:startpos.x+move.x, y:startpos.y+move.y},
                speed: adjspeed//this.speed
            }
            return new Cannonball(data.start,data.end,data.speed)    
        }
    }

    this.toJSON = function() {
        return {
            range : this.range,
            visionfield : this.visionfield,
            ellipsestat : this.ellipsestat
        }
    }
}
class Cannonball{
    constructor(start,end,speed, shotByPlayer=true){
        this.pos = {x:start.x,y:start.y};
        this.start = start;
        this.end = end;
        this.speed = speed; // dist per heartbeat
        this.delta = this.calcDelta()
        this.done = false;
        this.diameter = CONST.CANNONBALL_DIAMETER;
        this.shotByPlayer = shotByPlayer
    }
    //checks whether the ball's euclidian distance from a player is less than the two radius combined.
    contactcheck(players, turret_array){
        //for(var i = 0; i < players.length;i++){
        for (var i in players){
            //if the distance between two points are less than two collision circle - contact.
            if (mag(players[i].pos.x-this.pos.x,players[i].pos.y-this.pos.y)<(players[i].size/2+this.diameter) ){
                this.done = true
                return players[i]
            }
        }

        // Also check for turret hits
        if (this.shotByPlayer) {
            for (var i in turret_array){
                var turret_coords = turret_array[i].coords
                //if the distance between two points are less than two collision circle - contact.
                if (mag(turret_coords.x-this.pos.x,turret_coords.y-this.pos.y)<(CONST.TURRET_SIZE/2+this.diameter) ){
                    this.done = true
                    return turret_array[i]
                }
            }
        }
    }

    //calculates the distace the ball travels per heartbeat
    calcDelta(){
        var d = {x:(this.end.x-this.start.x),y:(this.end.y-this.start.y) }
        var oldmag = mag(d.x,d.y)
        var delta = {x:d.x/oldmag*this.speed,y:d.y/oldmag*this.speed}
        return delta
    }
    //update the position of the ball each heartbeat and if it now travels further from the target, removes it.
    update(){
        //delta = end.sub(this.start).setMag(this.speed);
        this.pos = addVec(this.pos,this.delta);
        if ( (mag(this.pos.x-this.start.x,this.pos.y-this.start.y)>=mag(this.end.x-this.start.x,this.end.y-this.start.y))  
            ){
            this.done = true;
            //console.log("done");
        }
    }
}

module.exports = {
    Player: Player,
    Cannonball:Cannonball
}
