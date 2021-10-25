class TurretRender {

    constructor() { }

    preload() {
        this.img_turret = loadImage('assets/img_turret.png');
    }

    first_load(gamemap) {
        this.tilesize = gamemap.tilesize;
        this.turret_array = gamemap.turretlist.turret_array;
    }

    load_turrets(turretlist) {
        // Load from a TurretList
        this.turret_array = turretlist.turret_array;
    }

    display() {
        imageMode(CORNER);
        for (let turret of this.turret_array) {
            // Turret
            image(this.img_turret, turret.coords.x*this.tilesize, turret.coords.y*this.tilesize, this.tilesize, this.tilesize);

            // Health/repair bar
            if (turret.alive && turret.health < turret.max_health) {
                push()
                fill(100,63)
                //base
                rect(turret.coords.x-20, turret.coords.y-turret.size/2-20,40,10);
                //health
                fill(0,220,0)
                rect(turret.coords.x-20, turret.coords.y-turret.size/2-20,40*abs(turret.health)/turret.max_health,10);
                pop()
            }
            else if (!turret.alive) {
                push()
                fill(158,125,125)
                //base
                rect(turret.coords.x-20, turret.coords.y-turret.size/2-20,40,10);
                //health
                fill(256,0,0)
                rect(turret.coords.x-20, turret.coords.y-turret.size/2-20,40*abs(turret.repair_time)/turret.max_repair_time,10);
                pop()
            }
        }

    }

}