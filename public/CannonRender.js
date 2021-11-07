function EllipseRange(theta,a,b,x0,y0) {
    // solve quadratic
    var aa = (b*cos(theta))**2+(a*sin(theta))**2
    var bb = -2* ( b**2*x0*cos(theta)+a**2*y0*sin(theta)  )
    var cc = (b*x0)**2+(a*y0)**2-(a*b)**2
    var r1 = (-bb + sqrt(bb**2-4*aa*cc) )/(2*aa)
    //r2 = (-bb - sqrt(bb**2-4*aa*cc) )/(2*aa)
    return r1
}

class CannonRender {

    constructor(cannon, player) {
        this.pos = player.pos
        this.range = cannon.range    // max distance you can shoot out from ship
        this.visionfield = cannon.visionfield
        this.angle = 0
        this.player = player
        this.ellipserange = cannon.ellipsestat//{a:100,b:70}
    }

    showRange() {

        this.pos = this.player.pos
        this.angle = atan2(mouseY - height / 2, mouseX - width / 2);
        push()
        fill(100,63);
        //*2 because it is the diameter of full circle

        //arc(this.pos.x,this.pos.y,this.range*2,this.range*2,
        //    this.angle-this.visionfield/2,this.angle+this.visionfield/2)
        ellipseMode(RADIUS)
        //circle(this.pos.x,this.pos.y,this.range)
        
        var dirrange = EllipseRange(this.angle-this.player.dir,this.ellipserange.a,this.ellipserange.b,this.ellipserange.x0,this.ellipserange.y0,)
        translate(this.player.vel.x,this.player.vel.y)
        arc(this.pos.x,this.pos.y,dirrange,dirrange,
            this.angle-this.visionfield/2,this.angle+this.visionfield/2)
        
        rotate(this.player.dir)
        // might replace the full ellipse below with an above arc of same size
        //ellipse(
        //    this.ellipserange.x0+this.pos.x*cos(-this.player.dir)-this.pos.y*sin(-this.player.dir),
        //    this.ellipserange.y0+this.pos.x*sin(-this.player.dir)+this.pos.y*cos(-this.player.dir),
        //    this.ellipserange.a,
        //    this.ellipserange.b
        //)
        //rotate(-this.player.dir)
        pop()        
    }

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

    checkclickinrange() {
        if (mag(mouseY - height / 2, mouseX - width / 2) > 0){
            return true
        }
        else {
            return false
        }
    }
}
