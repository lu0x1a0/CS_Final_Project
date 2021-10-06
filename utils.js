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
    }
};