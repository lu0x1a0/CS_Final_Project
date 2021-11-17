const entities = require('./Player.js')
const mag = require("./utils.js").mag
const setMag = require("./utils.js").setMag

//const Cannonball = require('./entities.js').Cannonball


const CONST = require('./Constants.js').CONST
const sin = Math.sin
const cos = Math.cos

/*
    Just some simple helper functions here
*/

function CreateVec(a,b) {
    let result = [];
    for (let i=0; i<a.length; i++) {
        result.push(b[i]-a[i]);
    }
    return result
}

function rand(items) {
    // "|" for a kinda "int div"
    return items[items.length * Math.random() | 0];
}

function DotProduct(a,b) {
    let result = 0
    for (let i = 0; i < a.length; ++i) {
        result += a[i]*b[i]
    }
    return result
}

function Angle(a,b) {
    return Math.acos(DotProduct(a,b)/(mag(a[0],a[1])*mag(b[0],b[1])))
}

function RandInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function MapX(x,tilesize) {
    return Math.floor(x/tilesize)
}

function MapY(y,tilesize) {
    return Math.floor(y/tilesize)
}

//This Shuffles an array, used for BFS-wise edge generation
function shuffle(array) {
    let curr = array.length;
    let rand; 
    // While there are elems to reshuffle.
    while (curr != 0) {
        // Pick rand remaning element
        rand = Math.floor(Math.random() * curr);
        curr--;
        // swap with curr
        [array[curr], array[rand]] = [
        array[rand], array[curr]];
    }
    return array;
}

class Bot extends entities.Player {
    constructor(id,username, x, y, dir, healthobserver) {
       super(id,username, x, y, dir, healthobserver)
       this.initialiseEscapePivots = false
       this.closestplayer = null
       this.EscapePivTicks = 0
       this.ShootingTicks = 0
       this.Shoot = true;
       this.EscapeRadius = CONST.BOT_ESCAPE_RADIUS

       this.topright = []
       this.topleft = []
       this.bottomright = []
       this.bottomright = []

       this.XBoundary = 0
       this.YBoundary = 0
       this.RandomPivots = []

       this.BotMinCoord = []
    }

    static getCannonBalls() {
        return Bot.CannonBalls
    }

    static ResetCannonBalls() {
        Bot.CannonBalls = {}
    }

    // Increment EscapePivTicks, so we can update pivots on intervals.
    EscapeTick(Gmap, forbidden) {
        this.EscapePivTicks++;
        if (this.EscapePivTicks >= CONST.BOT_ESCAPEPIVOT_UPDATE) {
            this.EscapePivTicks = 0
            this.GeneratePivots(Gmap, forbidden)
        }
    }

    //Increment ShootingTicks, so we can shoot cannonballs on intervals.
    ShootingTick() {
        if (!this.shoot) {
            this.ShootingTicks += 1
            if (this.ShootingTicks >= CONST.BOT_SHOOTING_RATE) {
                this.shoot = true
                this.ShootingTicks = 0
            }
        }
    }

    //Override entities update and call updateBot
    update(players,soundmanager,paths,costs,tupleval,index,Gmap, forbidden) {
        // Called on every heartbeat
        //check whether to remove effect
        var effectdone = 1
        for (var key in this.effects) {
            if ( effectdone === this.effects[key].countdown()){
                delete this.effects[key]
            }
        }

        this.hit = false

        this.cannon.update()
        if (!this.initialiseEscapePivots) {
            this.XBoundary = (Gmap.xlen/2) - 1
            this.YBoundary = (Gmap.ylen/2) - 1
            this.GeneratePivots(Gmap, forbidden)
            this.initialiseEscapePivots = true
        }
        //this.invincTick()
        this.EscapeTick(Gmap, forbidden)
        this.ShootingTick()
        this.updateBot(players,paths,costs,tupleval,index,Gmap)
        this.collisionCheck(players,soundmanager)
    };

    //generate an array of players for easier use.
    PlayersList(players) {
        let newplayers = []
        for (let i in players){
            if (i != this.id) {
                newplayers.push(players[i])
            }
        }
        return newplayers
    }
    
    /*
        An Escape algorithm which decides where to go based on maximising angles. 
        A Pivot is a randomly generated point. As running away from a player does NOT
        have a CONVEX solution, by introducing pivots we avoid that problem. 
        Relatively lightweight solution, whereby the BOT has the location of the nearest player
        and it chooses the pivot whereby the angle formed when you have a line from the nearest player
        and the bot and the random pivot and the bot, is maximised out of those random pivots. 
    */
    Escape(Gmap,min) {
        //Runs away from the nearest if and only if
        //Generate all angles

        if (min.length == 0) {
            shuffle(this.RandomPivots)
            let minCoord = this.RandomPivots[0]
            return minCoord
        }

        let BotCoord = [MapX(this.pos.x,Gmap.tilesize), MapY(this.pos.y,Gmap.tilesize)]
        let ClosestPlayer = min
        if (this.BotMinCoord.length != 0) {
            if (this.BotMinCoord[0] == BotCoord[0] && this.BotMinCoord[1] == BotCoord[1]) {
                let index = this.RandomPivots.indexOf(this.BotMinCoord);
                if (index > -1) {
                    this.RandomPivots.splice(index, 1);
                }
            }
        }

        let maxCoord = this.RandomPivots[0]
        let A = CreateVec(BotCoord, ClosestPlayer)
        let B = CreateVec(BotCoord, maxCoord)
        let maxAngle = Angle(A,B) + (Math.random() * (0.1000 - 0.0200) + 0.0200)
        for (let i = 1; i < this.RandomPivots.length; ++i) {
            B = CreateVec(BotCoord, this.RandomPivots[i])
            if (maxAngle <= Angle(A,B)) {
                maxAngle = Angle(A,B)
                maxCoord = this.RandomPivots[i]
                this.BotMinCoord = this.RandomPivots[i]
            }
        }
        return maxCoord

    }


    //Can be from any location

    NearestPlayer(newplayers,costs,tupleval,from,tilesize) {
        let x = MapX(newplayers[0].pos.x,tilesize)
        let y = MapY(newplayers[0].pos.y,tilesize)
        let min = [x,y]
        let player = newplayers[0]
        for (let i = 1; i < newplayers.length; ++i) {
            x = MapX(newplayers[i].pos.x,tilesize)
            y = MapY(newplayers[i].pos.y,tilesize)
            if (costs[tupleval.get([x,y])][tupleval.get(from)] < costs[tupleval.get(min)][tupleval.get(from)]) {
                min = [x,y]
                player = newplayers[i]
            }
        }
        return min
    }

    //Generate coordinates for where my pivot points will be, note that they will try to not be near turrets. 
    /*
    Even if the map is P% bad points and (1-P)% good points, the probability of choosing bad points more then 
    n times before reaching a good point will ultimately converge as n gets larger anyway, and P won't be 
    above 60-70%, assuming p = 0.7, the probability that we choose bad points 3 times in a row is 0.343.
    Also, consider that we only generate_coords after certain X ticks.
    */
    generate_coords(Xmin,Xmax,Ymin,Ymax,Gmap,forbidden) {
        let randx = RandInterval(Xmin, Xmax);
        let randy = RandInterval(Ymin,Ymax)
        // Generate until we hit water
        while (Gmap.map[randx][randy] !== ' ' && !forbidden.has([randx][randy])) {
            randx = RandInterval(Xmin, Xmax);
            randy = RandInterval(Ymin,Ymax)
        }
        return [randx, randy]
    }

    //Pivot Generation, 1 Pivot is generated for each equal quarter subsection of the map. 
    GeneratePivots(Gmap, forbidden) {
        this.topright = this.generate_coords(this.XBoundary+1, 2*this.XBoundary-1,0,this.YBoundary,Gmap, forbidden)
        this.topleft = this.generate_coords(0,this.XBoundary,0,this.YBoundary,Gmap, forbidden)
        this.bottomleft = this.generate_coords(0,this.XBoundary,this.YBoundary+1,2*this.YBoundary-1,Gmap, forbidden)
        this.bottomright = this.generate_coords(this.XBoundary+1,2*this.XBoundary-1,this.YBoundary+1,2*this.YBoundary-1,Gmap, forbidden)
        this.RandomPivots.push(this.topright)
        this.RandomPivots.push(this.topleft)
        this.RandomPivots.push(this.bottomleft)
        this.RandomPivots.push(this.bottomright)
    }

    //Shooting Cannonball.
    Shooting(x,y) {
        if (this.shoot) {
            this.updateSpacePressed = false
            this.SpaceCounter = 0
            let cannonball = this.fire(x-this.pos.x,y-this.pos.y)
            if (cannonball){
                // use playerid+current time stamp as id, might not safe from server attack with spamming io
                Bot.CannonBalls[this.id] = cannonball
                //server.UpdateProjectiles.UpdateProjectiles(this.id, cannonball)
            }
            this.shoot = false;
        }
    }

    //Gives the player who's nearest to the bot location.
    NearestPlayerObj(newplayers,costs,tupleval,from,tilesize) {
        let x = MapX(newplayers[0].pos.x,tilesize)
        let y = MapY(newplayers[0].pos.y,tilesize)
        let min = [x,y]
        let player = newplayers[0]
        for (let i = 1; i < newplayers.length; ++i) {
            x = MapX(newplayers[i].pos.x,tilesize)
            y = MapY(newplayers[i].pos.y,tilesize)
            if (costs[tupleval.get([x,y])][tupleval.get(from)] <= costs[tupleval.get(min)][tupleval.get(from)]) {
                min = [x,y]
                player = newplayers[i]
            }
        }
        return player
    }

    //Handles decisions where bot decides to go for the treasure objective.
    GoToTreasure(paths,costs,tupleval,index,Gmap,from) {
        let treasure = this.NearestTreasure(costs,tupleval,from,Gmap)
        //Check if treasure is in the same coordinate as bot
        const util = require('util');
        let coord = [treasure.x,treasure.y]
        if (util.isDeepStrictEqual(coord,from)) {
            //Bot is on the same spot as the treasure.
            this.OnTreasure = true
            this.SpacePressed = true
            this.SpaceCounter = 1
            this.xacc = 0
            this.yacc = 0
            this.vel.x = 0
            this.vel.y = 0
            return //Dont need to do anything if we are already here.
        } else { //If not, we continue going to that place.
            let min = [treasure.x, treasure.y]
            let indx = index.get(paths[tupleval.get(min)][tupleval.get(from)])
            this.DecisionHandler(from, indx, Gmap.map)
        }
        return
    }

    //Finds the Nearest Treasure near that BOT
    NearestTreasure(costs,tupleval,from,Gmap) {
        let treasure = Gmap.treasurelist.treasure_array[0]
        let x = treasure.x
        let y = treasure.y
        let min = [x,y]
        for (let i = 1; i < Gmap.treasurelist.treasure_array.length; ++i) {
            let temp = Gmap.treasurelist.treasure_array[i]
            x = temp.x
            y = temp.y
            if (costs[tupleval.get([x,y])][tupleval.get(from)] <= costs[tupleval.get(min)][tupleval.get(from)]) {
                min = [x,y]
                treasure = temp
            }
        }
        return treasure
    }

    /*
    Conditions
        UpdateBot explanation
        1. Check if there are no other ships in the map. 
           If there isnt check if you are onTreasure, if not GoToTreasure().
        
        2. Check if you are onTreasure().

        Find NEAREST PLAYER.

        3. Check if the nearest player is within X distance from you, if not GoToTreasure()

        4. Check if my health is below a certain threshold, if it is and the nearest player is within my danger or escape radius zone
           if it is I run away to a random pivot.

        5. Check if my health is below another certain threshold, if the nearest player is within my shoot radius then I maintain a certain
           distance from that player yet I make sure to shoot at that player.
        
        6. Check if my health is above a certain threshold, be very aggressive and go to the nearest player. Shoot and Ram them. 

    */

    updateBot(players,paths,costs,tupleval,index,Gmap) {

        let tilesize = Gmap.tilesize
        let BotX = MapX(this.pos.x, tilesize)
        let BotY = MapY(this.pos.y, tilesize)
        var start = [BotX,BotY]
        let newplayers = this.PlayersList(players)
        if (newplayers.length == 0) {
            if (!this.OnTreasure) {
                this.GoToTreasure(paths,costs,tupleval,index,Gmap,start)
            }
            return
        }

        let closestplayer = this.NearestPlayerObj(newplayers,costs,tupleval,start,tilesize)
        let min = [MapX(closestplayer.pos.x,tilesize), MapY(closestplayer.pos.y,tilesize)]

        let DirectionVector = [cos(this.dir),sin(this.dir)]
        let PlayerDirection = [closestplayer.pos.x - this.pos.x, closestplayer.pos.y - this.pos.y]
        let theta =  Angle(DirectionVector,PlayerDirection)
        let threshold = this.cannon.ellipserange(theta)
        let magnitude = mag(PlayerDirection[0], PlayerDirection[1])

        if (magnitude >= CONST.BOT_NEARBY_RADIUS) {
            if (!this.OnTreasure) {
                this.GoToTreasure(paths,costs,tupleval,index,Gmap,start)
            }
            return
        }

        if (this.health <= CONST.BOT_LOW_HEALTH) {
            //if min < then the radius, just hover
            let indx = this.Escape(Gmap,min)
            if (indx.length != 0) {
                indx = index.get(paths[tupleval.get(indx)][tupleval.get(start)])
                this.DecisionHandler(start, indx, Gmap.map)
                if (magnitude < threshold + 100) {
                    this.Shooting(closestplayer.pos.x, closestplayer.pos.y)
                }
            }
        }
        else if (this.health >= CONST.BOT_RAM_CONDITION) {
            let end = index.get(paths[tupleval.get(min)][tupleval.get(start)])
            this.DecisionHandler(start, end, Gmap.map)
            if (magnitude < threshold + 100) {
                this.Shooting(closestplayer.pos.x, closestplayer.pos.y)
            }
        } else {
            if (magnitude > threshold-150) {
                let end = index.get(paths[tupleval.get(min)][tupleval.get(start)])
                this.DecisionHandler(start, end, Gmap.map)
            } 
            else if (magnitude < threshold) {
                this.Shooting(closestplayer.pos.x, closestplayer.pos.y)
            }
        }
    }

    DecisionHandler(Start,DecisionIndex) {

        this.OnTreasure = false
        this.updateSpacePressed = false
        this.SpaceCounter = 0

        let i = Start[0] - DecisionIndex[0]
        let j = Start[1] - DecisionIndex[1]
        if (i <= -1 ) {
            this.xacc = CONST.PLAYER_ACCELERATION
            //accelerates to the right
        }
        else if (i >= 1) {
            this.xacc = -CONST.PLAYER_ACCELERATION
            //This accelerates to the left
        }
        else if (i == 0) {
            this.xacc = 0
        }
        if (j >= 1) {
            //Accelerates to the bottom
            this.yacc = -CONST.PLAYER_ACCELERATION
        }
        else if (j <= -1) {
            //Accelerates to the top
            this.yacc = CONST.PLAYER_ACCELERATION
        }
        else if (j == 0) {
            this.yacc = 0
        }

        this.vel = {x:this.vel.x+this.xacc,y:this.vel.y+this.yacc}
        this.vel = setMag(this.vel, Math.min (Math.max(mag(this.vel.x,this.vel.y)-this.drag,0),this.maxspeed ) )
        if (mag(this.vel.x,this.vel.y)>0.0001){
            this.dir = Math.atan2(this.vel.y,this.vel.x)
        }
    }
}

Bot.CannonBalls = {}

module.exports = {
    Bot : Bot
}
