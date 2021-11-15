/**
 * calculates the distance of range to be diplayed wrt to 
 * the angle between ship's bow and where the mouse is pointing at.
 * @param {*} theta angle wrt bow of ship
 * @param {*} a  x radius
 * @param {*} b  y radius
 * @param {*} x0 shift from origin on x axis
 * @param {*} y0 shift from origin on y axis
 * @return {*} 
 */
function EllipseRange(theta,a,b,x0,y0) {
    // solve quadratic
    var aa = (b*cos(theta))**2+(a*sin(theta))**2
    var bb = -2* ( b**2*x0*cos(theta)+a**2*y0*sin(theta)  )
    var cc = (b*x0)**2+(a*y0)**2-(a*b)**2
    var r1 = (-bb + sqrt(bb**2-4*aa*cc) )/(2*aa)
    return r1
}

/**
 * render the player's range in game as an indictator of outreach to possible target
 * and prevents user from clicking at the centre of ship.  
 *
 * @class CannonRender
 */
class CannonRender {

    constructor(cannon, player) {
        this.pos = player.pos
        this.range = cannon.range    // max distance you can shoot out from ship
        this.visionfield = cannon.visionfield
        this.angle = 0
        this.player = player
        this.ellipserange = cannon.ellipsestat
    }
    /**
     * calculate where on canvas to show the appropriate range
     *
     * @memberof CannonRender
     */
    showRange() {

        this.pos = this.player.pos
        this.angle = atan2(mouseY - height / 2, mouseX - width / 2);
        push()
        fill(100,63)

        ellipseMode(RADIUS)
        
        var dirrange = EllipseRange(this.angle-this.player.dir,this.ellipserange.a,this.ellipserange.b,this.ellipserange.x0,this.ellipserange.y0,)
        translate(this.player.vel.x,this.player.vel.y)
        arc(this.pos.x,this.pos.y,dirrange,dirrange,
            this.angle-this.visionfield/2,this.angle+this.visionfield/2)
        
        rotate(this.player.dir)
        pop()        
    }
    /**
     * convert the radian domain to between -pi and pi 
     */
    convertraddomain(angle) {
        if (angle>PI){
            remain = angle%(2*PI)
            if (remain>PI){
                return -(PI-remain%PI)
            }
        } else if (angle<PI) {
            remain = angle%(2*PI)
            if (remain<-PI){
                return (PI+remain%PI)
            }
        }else{
            return angle
        }
    }
    // prevent clicking at centre of self as a target to fire at
    checkclickinrange() {
        if (mag(mouseY - height / 2, mouseX - width / 2) > 0){
            return true
        }
        else {
            return false
        }
    }
}
