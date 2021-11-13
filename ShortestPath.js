const CONST = require('./Constants.js').CONST

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

function IndexCheck(V,map) {
    //Returns true if its good, false if its bad
    let x = V[0]
    let y = V[1]
    if (x < 0 || x >= map.length) {
        return false
    }

    if (y < 0 || y >= map[0].length) {
        return false
    }

    return true;
}

function ComputeAdjacentVertex(V,map) {
    var AV = [];
    //Check Map Dimensions

    if (IndexCheck([V[0]-1,V[1]+1],map) && map[V[0]-1][V[1]+1] != 'L' && map[V[0]-1][V[1]+1] != 'T' && map[V[0]-1][V[1]+1] != 'H') {
        AV.push([V[0]-1,V[1]+1])
    }

    if (IndexCheck([V[0]-1,V[1]-1],map) && map[V[0]-1][V[1]-1] != 'L' && map[V[0]-1][V[1]-1] != 'T' && map[V[0]-1][V[1]-1] != 'H') {
        AV.push([V[0]-1,V[1]-1])
    }

    if (IndexCheck([V[0]+1,V[1]+1],map) && map[V[0]+1][V[1]+1] != 'L' && map[V[0]+1][V[1]+1] != 'T'  && map[V[0]+1][V[1]+1] != 'H') {
        AV.push([V[0]+1,V[1]+1])
    }

    if (IndexCheck([V[0]+1,V[1]-1],map) && map[V[0]+1][V[1]-1] != 'L' &&  map[V[0]+1][V[1]-1] != 'T' &&  map[V[0]+1][V[1]-1] != 'H') {
        AV.push([V[0]+1,V[1]-1])
    }

    if (IndexCheck([V[0],V[1]-1],map) && map[V[0]][V[1]-1] != 'L' &&  map[V[0]][V[1]-1] != 'T' &&  map[V[0]][V[1]-1] != 'H') {
        AV.push([V[0],V[1]-1])
    }

    if (IndexCheck([V[0],V[1]+1],map) && map[V[0]][V[1]+1] != 'L' && map[V[0]][V[1]+1] != 'T' && map[V[0]][V[1]+1] != 'H') {
        AV.push([V[0],V[1]+1])
    }

    if (IndexCheck([V[0]+1,V[1]],map) && map[V[0]+1][V[1]] != 'L' && map[V[0]+1][V[1]] != 'T'  && map[V[0]+1][V[1]] != 'H') {
        AV.push([V[0]+1,V[1]])
        }

    if (IndexCheck([V[0]-1,V[1]],map) && map[V[0]-1][V[1]] != 'L' && map[V[0]-1][V[1]] != 'T' && map[V[0]-1][V[1]] != 'H' ) {
        AV.push([V[0]-1,V[1]])
    }
    AV = shuffle(AV)
    return AV;
}

class ArrayKeyedMap extends Map {
    get(array) {
      return super.get(this.toKey(array));
    }

    set(array, value) {
      return super.set(this.toKey(array), value);
    }

    has(array) {
      return super.has(this.toKey(array));
    }

    delete(array) {
      return super.delete(this.toKey(array));
    }

    toKey(array) {
        if (typeof(array) == 'string') {
            return array
        }
        return JSON.stringify(array);
    }
}


function FloydWarshall(path,cost) {
    for(let k = 0; k < path.length; ++k) {
        for (let v = 0; v < path.length; ++v) {
            for (let u = 0; u < path.length; ++u) {
                if (cost[v][k] != Infinity && cost[k][u] != Infinity && cost[v][k] + cost[k][u] < cost[v][u]) {
                    cost[v][u] = cost[v][k] + cost[k][u]
                    path[v][u] = path[k][u]
                }
            }
        }
    }
}
/*
// Generates a heat map for every single point
function FloodAlgorithm(index,tuplelist,map) {
    //For every single tuplelist we generate a heat map
    //Each coordinate is associatd with a tuplelist
    let PositiveHeatMaps = new Array(index.length)
    for (let coords = 0; coords < tuplelist.length; ++coords) {
        //HeatMaps[coords], initialise a new map
        PositiveHeatMaps[coords] = new Array(map.length)
        for (let i = 0; i < map.length; ++i) {
            PositiveHeatMaps[coords][i] = new Array(map[i].length);
            PositiveHeatMaps[coords][i].fill(0)
        }
        let levels = 0; //We start off a level 0?
        let Q = []
        Q.push(coords)
        while (Q.length == 0) {
            let level_size = Q
        }





    }

}
*/


function Generation(map,mapfile) {
    let tuplelist = []
    let TurretListQ = []
    let LandListQ = []
    let Found = new Array(map.length)
    for (let i = 0; i < map.length; ++i) {
        Found[i] = new Array(map[i].length)
        Found[i].fill(0)
    }

    for (let i = 0; i < map.length; ++i) {
        for (let j = 0; j < map[i].length; ++j) {
            if (map[i][j] == ' ' || map[i][j] == 'S' ) {
                tuplelist.push([i,j])
            }
            else if (map[i][j] == 'T') {
                TurretListQ.push([i,j])
                Found[i][j] = 1
            }
            else if (map[i][j] == 'L') {
                LandListQ.push([i,j])
                Found[i][j] = 1
            }
        }
    }

    let size = tuplelist.length
    let tupleVal = new ArrayKeyedMap()
    let index = new Map()
    let cost = new Array(size)
    for (let i = 0; i < size; ++i) {
        cost[i] = new Array(size)
    }
    let path = new Array(size)
    for (let i = 0; i < size; ++i) {
        path[i] = new Array(size)
    }
    let graph = new Map()

    for (let i = 0; i < tuplelist.length; ++i) {
        for (let j = 0; j < tuplelist.length; ++j) {
            cost[i][j] = Infinity
            path[i][j] = -1
        }
    }

    // Tuplelist is a list of coordinates so
    // [[1,2], [3,4], .. [n,m]]
    for (let i = 0; i < tuplelist.length; ++i) {
        index.set(i, tuplelist[i])
        tupleVal.set(tuplelist[i], i)
        cost[i][i] = 0
        let x = ComputeAdjacentVertex(tuplelist[i],map)
        graph.set(tuplelist[i], x) //Maps a [x,y] to [[x,y],[x,y], ...]
    }


    // Level Wise iterations of places near turrets.
    let ForbiddenVals = new ArrayKeyedMap()
    let TurretLevelVal = new ArrayKeyedMap()
    let levels = 0; //This should be some range
    while (TurretListQ.length != 0 && levels < CONST.TURRET_FIRING_RANGE-3)  {
        let level_size = TurretListQ.length
        while(level_size--) {
            let V = TurretListQ.shift()
            let AV = ComputeAdjacentVertex(V,map)
            for (let i = 0; i < AV.length; ++i) {
                if (!Found[AV[i][0]][AV[i][1]]) {
                    Found[AV[i][0]][AV[i][1]] = 1
                    if (tupleVal.has(AV[i])) {
                        TurretListQ.push(AV[i])
                        TurretLevelVal.set(AV[i], levels+1)
                        ForbiddenVals.set(AV[i], 0);
                        //let x = levels+1
                        //map[AV[i][0]][AV[i][1]] = "X"
                    }
                }
            }
        }
        levels++;
    }

    //Level Wise iterations of places near land Have a slight penalty for this too.
    let LandLevelVal = new ArrayKeyedMap()
    levels = 0
    while (LandListQ.length != 0 && levels < CONST.NEARBY_LAND_ITERATIONS) {
        let level_size = LandListQ.length
        while(level_size--) {
            let V = LandListQ.shift()
            //Need to index check.
            let AV = ComputeAdjacentVertex(V,map)
            for (let i = 0; i < AV.length; ++i) {
                if (!Found[AV[i][0]][AV[i][1]]) { //If space has already been occupied by turrets then dont worry
                    Found[AV[i][0]][AV[i][1]] = 1
                    if (tupleVal.has(AV[i])) {
                        LandListQ.push(AV[i])
                        LandLevelVal.set(AV[i], levels+1)
                        //let x = levels+1
                        //map[AV[i][0]][AV[i][1]] = "Y"
                    }
                }
            }
        }
        levels++
    }


    for (let [key, value] of graph) {
        for (let i = 0; i < value.length; i++) {
            if (TurretLevelVal.has(value[i])) {
                cost[tupleVal.get(key)][tupleVal.get(value[i])] = CONST.MAP_TURRET_STARTING_VALUE - TurretLevelVal.get(value[i])*CONST.TURRET_LOSING_RATE
            }
            else if (LandLevelVal.has(value[i])) {
                cost[tupleVal.get(key)][tupleVal.get(value[i])] = CONST.LAND_COST_INIT_PENATY - LandLevelVal.get(value[i])*CONST.LAND_LOSING_RATE
            } else {
                cost[tupleVal.get(key)][tupleVal.get(value[i])] = CONST. MAP_INIT_VALUE
            }
        }
    }

    for (let i = 0; i < cost.length; ++i) {
        for (let j = 0; j < cost[i].length; ++j) {
            if (i == j) {
                path[i][j] = 0
            } else if (cost[i][j] != Infinity){
                path[i][j] = i
            }
        }
    }

    FloydWarshall(path,cost)

    //Round everything to 2dp - reduce file size
    for (let i = 0; i < cost.length; ++i) {
        for (let j = 0; j < cost[i].length; ++j) {
            cost[i][j] = Math.round(cost[i][j]*100)/100
        }
    }

    //https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
    function replacer(key, value) {
        if(value instanceof Map) {
          return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
          };
        } else {
          return value;
        }
      }

    function stringifyMap(myMap) {
        function selfIterator(map) {
            return Array.from(map).reduce((acc, [key, value]) => {
                if (value instanceof Map) {
                    acc[key] = selfIterator(value);
                } else {
                    acc[key] = value;
                }
                return acc;
            }, {})
        }

        const res = selfIterator(myMap)
        return JSON.stringify(res);
    }

    function reviver(key, value) {
        if(typeof value === 'object' && value !== null) {
          if (value.dataType === 'Map') {
            return new Map(value.value);
          }
        }
        return value;
    }

    //Or any other Map
    if (mapfile != 'MapHuge') {
        let obj = {
            'path' : JSON.stringify(path),
            'cost' : JSON.stringify(cost),
            'tupleVal' : stringifyMap(tupleVal),
            'index' : JSON.stringify(index, replacer),
            'ForbiddenVals' : stringifyMap(ForbiddenVals)
        }

        let fs = require('fs'),
            JSONObj = JSON.stringify(obj);

        let str = "./JSON/" + mapfile + ".json";
        fs.writeFileSync(str, JSONObj)
    } else {
        let obj = {
            'path' : JSON.stringify(path),
        }

        let obj1 = {
            'cost' : JSON.stringify(cost),
        }
        let obj2 = {
            'tupleVal' : stringifyMap(tupleVal),
            'index' : JSON.stringify(index, replacer),
            'ForbiddenVals' : stringifyMap(ForbiddenVals)
        }

        let fs = require('fs'),
            JSONObj = JSON.stringify(obj),
            JSONObj1 = JSON.stringify(obj1),
            JSONObj2 = JSON.stringify(obj2);

        let str = "./JSON/" + mapfile + "path" + ".json";
        let str1 = "./JSON/" + mapfile + "cost" + ".json";
        let str2 = "./JSON/" + mapfile + "other" + ".json";

        fs.writeFileSync(str, JSONObj)
        fs.writeFileSync(str1, JSONObj1)
        fs.writeFileSync(str2, JSONObj2)

    }

    return [path, cost, tupleVal, index, ForbiddenVals]
}

module.exports = {
    Generation,
    ArrayKeyedMap : ArrayKeyedMap,
};
