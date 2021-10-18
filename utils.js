module.exports = {
    mag: function (x,y){
        return Math.sqrt(x**2+y**2)
    },
    addVec: function (v1,v2){
        return {x:v1.x+v2.x,y:v1.y+v2.y}
    },
    setMag: function(vel,newmag){        
        var oldmag = Math.sqrt(vel.x**2+vel.y**2)
        if (oldmag){
            var newvel = {x:vel.x/oldmag*newmag, y:vel.y/oldmag*newmag}
            return newvel
        }
        else{
            return vel
        }
    },
    distance: function(coords1, coords2) {
        return Math.sqrt(Math.pow(coords1.x-coords2.x, 2) + Math.pow(coords1.y-coords2.y, 2))
    }
};