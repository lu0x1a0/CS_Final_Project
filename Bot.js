const entities = require('./entities.js')
const mag = require("./utils.js").mag
const addVec = require("./utils.js").addVec
const setMag = require("./utils.js").setMag

const Cannonball = require('./entities.js').Cannonball


const CONST = require('./Constants.js').CONST
const sin = Math.sin
const cos = Math.cos
const sqrt = Math.sqrt

/*
    A couple of things we need to add are:
    Multiple Escape Pivots which helps the bot
    choose where to go when escaping.

    Hovering Pivot when a bot wants to explore/hover
    around some safe area when there are no nearby
    bots around as moving to another point may
    mean the escape algorithm is redundant. Hover Pivots
    maybe around an escape pivot too, and hovering pivots
    are only formed when

    When the bot is hovering, it should have a hovering speed
    as to not stuff up the animations, since it won't be
    going at full speed in that area.

    Escape Radial Length. The nearest player must be within
    a specific magnitude from the bot, for it to trigger
    the escape algorithm. If it is within a safe space why
    should it move that specific area?

    To do:
    Implement Bot Radius, if player is still following bot
    and player is stil within bots radius and bot arrives to
    the random pivot then the escape pivots will also update,
    so the bot can go to its new position.
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

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
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
       this.EscapeRadius = CONST.ESCAPE_RADIUS

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

    EscapeTick(Gmap, forbidden) {
        this.EscapePivTicks++;
        if (this.EscapePivTicks >= CONST.UPDATE_ESCAPEPIVOTS) {
            this.EscapePivTicks = 0
            this.GeneratePivots(Gmap, forbidden)
        }
    }

    ShootingTick() {
        if (!this.shoot) {
            this.ShootingTicks += 1
            if (this.ShootingTicks >= CONST.SHOOTING) {
                this.shoot = true
                this.ShootingTicks = 0
            }
        }
    }

    update(players,soundmanager,paths,costs,tupleval,index,Gmap, forbidden) {
        this.cannon.update()
        if (!this.initialiseEscapePivots) {
            this.XBoundary = (Gmap.xlen/2) - 1
            this.YBoundary = (Gmap.ylen/2) - 1
            this.GeneratePivots(Gmap, forbidden)
            this.initialiseEscapePivots = true
        }
        this.invincTick()
        this.EscapeTick(Gmap, forbidden)
        this.ShootingTick()
        this.updateBot(players,paths,costs,tupleval,index,Gmap)
        this.collisionCheck(players,soundmanager)
    };

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
        Retrieve Treasure checks if each player is some constant magnitude away
        from the nearest treasure to the bot. And checks if each player is
        some cost value away from the bot too. If the player is within
        the radius of the bot but not within the radius of the treasure then
        depending on the health of the player we decide if we should go for
        the treasure or not. If it is above 70 we should go for the player.
        If it is below 70, but the nearest players health is smaller than the
        bots health then we should go for the player as there is a greater reward
        in killing the player, if it is less than 70 and the nearest players health
        is greater than the bots health by some fixed constant then we should
        opt to get the treasure. If the health is less than 40, if there are no nearest
        players near the bot by some fixed radius from the treasure and bot then it
        is assumed to be safe to go, but if there happens to be a player nearby
        we don't go as we need to be more concerned with the bot survival.

        Conditions to implement:

        Need to decide on some constants:
            -> How far should each player be from the nearest treasure for the bot?
            -> How far should each player be from the nearest bot? -> This will later be decided as the radial length for escaping.

        Const - PlayerTreasureDist
        Const - PlayerBotDist  // This helps us know if we are in a safe space or not. If we are then we will place a hover pivot in this area.
        Let X = NearestPlayerToUs
        Let X1 = NearestPlayerToTreasure
        Let Y = OurPosition
        let Z = TreasurePosition

        Firstly, check if the ship is already on the treasure. If it is this.onTreasure and this.spacePressed should be 1.
        Then UpdateTreasure will automatically increment everythng. Once the treasure is removed (It will not be in the
        treasure map) what happens next will depend on the health of the bot and the condition of the nearest player.

        if (bothealth < 40) {
            if abs(X-Y) < PlayerBotDist then we go to our escape pivot.  (Dont go to the treasure)
            if abs(X-Y) > PlayerBotDist and abs(X-Z) > PlayerTreasureDist then go towards the treasure.
        } else {
            if (40 < bothealth < 70) {
                if abs(X-Y) < PlayerBotDist but C*BotHealth < PlayerHealth  then we should go for the treasure.
                i
            } else { // bothealth > 70

            }
        }

        Need to finish designing conditionals.

    TreasureRetrievalQuest(player,paths,costs,tupleval,index,Gmap) {

    }
    */
    Escape(Gmap,min) {
        //Runs away from the nearest if and only if
        //Generate all angles

        if (min.length == 0) {
            let minCoord =  rand(this.RandomPivots)
            return minCoord
        }

        let BotCoord = [MapX(this.pos.x,Gmap.tilesize), MapY(this.pos.y,Gmap.tilesize)]
        let ClosestPlayer = min
        if (this.BotMinCoord.length != 0) {
            if (this.BotMinCoord[0] == BotCoord[0] && this.BotMinCoord[1] == BotCoord[1]) {
                //console.log("FOUND")
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
    NearestPlayerObj(newplayers,costs,tupleval,from,tilesize) {
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
        return player
    }

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

    generate_coords(Xmin,Xmax,Ymin,Ymax,Gmap,forbidden) {
        let randx = RandInterval(Xmin, Xmax);
        let randy = RandInterval(Ymin,Ymax)
        // Generate until we hit water
        while (Gmap.map[randx][randy] !== 'W' && !forbidden.has([randx][randy])) {
            randx = RandInterval(Xmin, Xmax);
            randy = RandInterval(Ymin,Ymax)
        }
        return [randx, randy]
    }

    GeneratePivots(Gmap, forbidden) {

        this.topright = this.generate_coords(this.XBoundary+1, 2*this.XBoundary-1,0,this.YBoundary,Gmap, forbidden)
        this.topleft = this.generate_coords(0,this.XBoundary,0,this.YBoundary,Gmap, forbidden)
        this.bottomleft = this.generate_coords(0,this.XBoundary,this.YBoundary+1,2*this.YBoundary-1,Gmap, forbidden)
        this.bottomright = this.generate_coords(this.XBoundary+1,2*this.XBoundary-1,this.YBoundary+1,2*this.YBoundary-1,Gmap, forbidden)
        this.RandomPivots.push(this.topright)
        this.RandomPivots.push(this.topleft)
        this.RandomPivots.push(this.bottomleft)
        this.RandomPivots.push(this.bottomright)


        /*
        this.RandomPivots.push(this.generate_coords(this.XBoundary+1, 2*this.XBoundary-1,0,this.YBoundary,Gmap))
        this.RandomPivots.push(this.generate_coords(0,this.XBoundary,0,this.YBoundary,Gmap))
        this.RandomPivots.push(this.generate_coords(0,this.XBoundary,this.YBoundary+1,2*this.YBoundary-1,Gmap))
        this.RandomPivots.push(this.generate_coords(this.XBoundary+1,2*this.XBoundary-1,this.YBoundary+1,2*this.YBoundary-1,Gmap))
        */
        //update this.RandomPivots if we want to add more random points throughout the graph
    }

    Shooting(x,y) {
        if (this.shoot) {
            let cannonball = this.fire(x-this.pos.x,y-this.pos.y)
            //console.log("----------shooting--------")
            //console.log(cannonball)
            //console.log(this.pos.x,this.pos.y)
            //console.log(this.cannon.pos.x,this.cannon.pos.y)
            if (cannonball){
                // use playerid+current time stamp as id, might not safe from server attack with spamming io
                Bot.CannonBalls[this.id] = cannonball
                //console.log("server : " + server)
                //server.UpdateProjectiles.UpdateProjectiles(this.id, cannonball)
            }
            this.shoot = false;
        }
    }

    updateBot(players,paths,costs,tupleval,index,Gmap) {
        let tilesize = Gmap.tilesize
        let BotX = MapX(this.pos.x, tilesize)
        let BotY = MapY(this.pos.y, tilesize)
        var start = [BotX,BotY]
        let newplayers = this.PlayersList(players)
        if (newplayers.length == 0) {
            let indx = this.Escape(Gmap,[])
            indx = index.get(paths[tupleval.get(indx)][tupleval.get(start)])
            this.DecisionHandler(start, indx, Gmap.map)
            return
        }
        let min = this.NearestPlayer(newplayers,costs,tupleval,start,tilesize)
        let closestplayer = this.NearestPlayerObj(newplayers,costs,tupleval,start,tilesize)
        if (this.health <= CONST.BOT_LOW_HEALTH) {
            //if min < then the radius, just hover
            let indx = this.Escape(Gmap,min)
            if (indx.length != 0) {
                indx = index.get(paths[tupleval.get(indx)][tupleval.get(start)])
                this.DecisionHandler(start, indx, Gmap.map)
                this.Shooting(closestplayer.pos.x, closestplayer.pos.y)
            }
        }
        else if (this.health >= CONST.BOT_RAM_CONDITION) {
            let end = index.get(paths[tupleval.get(min)][tupleval.get(start)])
            this.DecisionHandler(start, end, Gmap.map)
            this.Shooting(closestplayer.pos.x, closestplayer.pos.y)
        } else {
            //it means in between check the distance between each other
            //If the distance bewteen the nearest ship and the bot is greater
            //then the shooting range, then we keep following.
            let DirectionVector = [cos(this.dir),sin(this.dir)]
            let PlayerDirection = [closestplayer.pos.x - this.pos.x, closestplayer.pos.y - this.pos.y]
            let theta =  Angle(DirectionVector,PlayerDirection)
            let threshold = this.cannon.ellipserange(theta)
            let magnitude = mag(PlayerDirection[0], PlayerDirection[1])

            if (magnitude > threshold) {
                let end = index.get(paths[tupleval.get(min)][tupleval.get(start)])
                this.DecisionHandler(start, end, Gmap.map)
            } else {
                this.Shooting(closestplayer.pos.x, closestplayer.pos.y)
            }
        }
    }

    DecisionHandler(Start,DecisionIndex) {
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

    ComputeAdjacentVertex(V,map) {
        var AV = [];

        if (map[V[0]-1][V[1]+1] != 'L' && map[V[0]-1][V[1]+1] != 'T') {
            AV.push([V[0]-1,V[1]+1])
        }

        if (map[V[0]-1][V[1]-1] != 'L' && map[V[0]-1][V[1]-1] != 'T') {
            AV.push([V[0]-1,V[1]-1])
        }

        if (map[V[0]+1][V[1]+1] != 'L' && map[V[0]+1][V[1]+1] != 'T') {
            AV.push([V[0]+1,V[1]+1])
        }

        if (map[V[0]+1][V[1]-1] != 'L' &&  map[V[0]+1][V[1]-1] != 'T') {
            AV.push([V[0]+1,V[1]-1])
        }

        if (map[V[0]][V[1]-1] != 'L' &&  map[V[0]][V[1]-1] != 'T') {
            AV.push([V[0],V[1]-1])
        }

        if (map[V[0]][V[1]+1] != 'L' && map[V[0]][V[1]+1] != 'T') {
            AV.push([V[0],V[1]+1])
        }

        if (map[V[0]+1][V[1]] != 'L' && map[V[0]+1][V[1]] != 'T') {
            AV.push([V[0]+1,V[1]])
            }

        if (map[V[0]-1][V[1]] != 'L' && map[V[0]-1][V[1]] != 'T' ) {
            AV.push([V[0]-1,V[1]])
        }
        AV = shuffle(AV)
        return AV;
    }
}

Bot.CannonBalls = {}

module.exports = {
    Bot : Bot
}

/*
    1. Check if bot is below 40
        If bot is below 40 check if nearest player is within its danger radius.
            If it is go to next best action to get away from it.
        If it isnt, then just hover (havent implemented this most likely wont now)

    2. If Bot is above 40 but below 70.
        Check if nearest player is within its firing range.
            If player is within firing range shoot at the player (maybe implement soom randomization here)

            Should the bot move ? Or should it stay stationary ? and let the next iteration handle the next move?

        If it isn't keep following the player.

    3. If Bot is above 70
        Keep following player until you can ram the nearest player.
        If you can also shoot, shoot the player too.

*/
