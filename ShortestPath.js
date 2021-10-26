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

function ComputeAdjacentVertex(V,map) {
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
  

function Generation(map) {
    let tuplelist = []
    for (let i = 0; i < map.length; ++i) {
        for (let j = 0; j < map[i].length; ++j) {
            if (map[i][j] == 'W' || map[i][j] == 'S' ) {
                tuplelist.push([i,j])
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
    
    for (let [key, value] of graph) {
        for (let i = 0; i < value.length; i++) {
            cost[tupleVal.get(key)][tupleVal.get(value[i])] = 1
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
    return [path, cost, tupleVal, index]
}


module.exports = {
    Generation,
};
