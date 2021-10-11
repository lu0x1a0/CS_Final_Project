const mag = require("./utils.js").mag
const addVec = require("./utils.js").addVec
const setMag = require("./utils.js").setMag
const Maps = require("./MapFiles.js").Maps


class Player{
    constructor(id,Username, x, y, dir){
        this.pos = {x:x, y:y};
        this.dir = dir;
        this.size = 64
        this.vel = {x:0, y:0};
        this.id = id;
        this.username = Username;
        //this.health = health;
        this.xacc = 0
        this.yacc = 0
        this.maxspeed = 3
        this.drag = 0.1
        this.cannon = new Cannon(this.size*5,Math.PI/3,this)
        this.health = 100
        this.hitbox_size = 16 // need help from arkie with what this is // its the size of its hitbox so we know how wide around the ship we collide with land
        this.isBot = false;
    }
    // change the velocity according to current drag and acceleration..
    update(players) {
        //var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
        //newvel.setMag(3);
        //this.vel.lerp(newvel, 0.2);
        //this.pos.add(this.vel);

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
    };

    updateBot(players) {
        const GameMap = require("./GameMap.js").GameMap
        var Gmap = new GameMap(Maps.MapSquare)
        var map = Gmap.map;

        var playerSet = new Set();


        for(let i = 0; i<players.length;i++) {
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

        for(let i = 0; i<players.length;i++) {
            let pixelX = players[i].pos.x
            let pixelY = players[i].pos.y
            let factor = Gmap.tilesize
            let x = Math.floor(pixelX/factor)
            let y = Math.floor(pixelY/factor)
            map[x][y] = 'W'
        }

        if (end.length != 0) {
            var IndexDirection = this.Decision(parents,start,end)
            this.DecisionHandler(start, IndexDirection)
        }


    }

    DecisionHandler(Start,DecisionIndex) {
        let i = Start[0] - DecisionIndex[0]
        let j = Start[1] - DecisionIndex[1]
        if (i == -1) {
            this.xacc = 0.3
        }
        else if (i == 1) {
            this.xacc = -0.3
        }
        if (j == 1) {
            this.yacc = -0.3
        }
        else if (j == -1) {

            this.yacc = 0.3
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
    convert2treasure(){

    }
}
function Cannon(range,visionfield,player){
    this.pos = player.pos
    this.range = range
    this.visionfield = visionfield
    this.angle = 0
    this.player = player
    this.speed = player.maxspeed*1.5
    this.update = function(){//x,y){
      this.pos = this.player.pos
      //this.angle = Math.atan2(mouseY - height / 2, mouseX - width / 2);
      //this.angle = Math.atan2(x,y);
      //console.log("------------cannon-update---------\n",x,y,this.angle)
    }

    this.fire = function (targetX,targetY){
        //input validity checking
        var dist = mag(targetX,targetY)
        // this.angle in [-pi,pi]
        this.angle = Math.atan2(targetY,targetX)
        // altangle expresses this angle in the alternative domain that goes either +- [0,2*PI]
        var altangle = Math.sign(this.angle)*(-1) *(2*Math.PI-Math.abs(this.angle))
        var absdiff = Math.abs(this.angle-this.player.dir)
        var absdiff2 = Math.abs(altangle-this.player.dir)
        var field = Math.PI/4 //this.visionfield // PI/3
        // checks
        // 1. whether the mouse is within this.range pixels of the ship,
        // 2. the difference between the mouse angle and the ship's steering angle (where the front points to)
        //    is between the field size and PI-field. i.e. valid firing angle is from either side of the ship
        //    with allowed variability to left or right of (PI-2*field)/2 radian.
        if (    (dist <= this.range) &&
                //((absdiff>field && absdiff<(Math.PI-field)) || (absdiff2> field && absdiff2<(Math.PI-field)))
                ((absdiff<(Math.PI-field)) || (absdiff2<(Math.PI-field)))
            ){
            startpos = {x:this.pos.x,y:this.pos.y}
            // move slightly off player's collision zone so the ball doesn't hit the player
            shift = setMag({x:targetX,y:targetY},this.player.size/2+5)
            shiftstart = addVec(startpos,shift)
            var data = {
                start:shiftstart,
                end:{x:startpos.x+targetX, y:startpos.y+targetY},
                speed: this.speed
            }
            return new Cannonball(data.start,data.end,data.speed)
        }

    }
}
class Cannonball{
    constructor(start,end,speed){
        this.pos = {x:start.x,y:start.y};
        this.start = start;
        this.end = end;
        this.speed = speed;
        this.delta = this.calcDelta()
        this.done = false;
        this.diameter = 8
    }
    //checks whether the ball's euclidian distance from a player is less than the two radius combined.
    contactcheck(players){
        for(var i = 0; i < players.length;i++){
            //if the distance between two points are less than two collision circle - contact.
            if (mag(players[i].pos.x-this.pos.x,players[i].pos.y-this.pos.y)<(players[i].size/2+this.diameter) ){
                this.done = true
                return players[i]
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
        if (mag(this.pos.x-this.start.x,this.pos.y-this.start.y)>=mag(this.end.x-this.start.x,this.end.y-this.start.y)){
            this.done = true;
            //console.log("done");
        }
        else {
            var touched = 0 //this.contactcheck(Players)
            if (touched){
                //touched.takedamage()
                this.done = true
            }
        }
    }
    //this.show = function(){
    //    if (this.done === false){
    //        fill(255);
    //        circle(this.pos.x,this.pos.y,this.diameter)
    //    }
    //}
}

module.exports = {
    Player: Player
}
