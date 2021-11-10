class StationRender {

    constructor() { }

    preload() {
        this.img_station = loadImage('assets/imgs/img_station.png');
        this.img_station_dead = loadImage('assets/imgs/img_station_dead.png');
    }

    first_load(gamemap) {
        this.tilesize = gamemap.tilesize;
        this.station_array = gamemap.stationlist.station_array;
    }

    load_stations(stationlist) {
        // Load from a StationList
        this.station_array = stationlist.station_array;
    }

    display() {
        imageMode(CENTER);
        for (let station of this.station_array) {
            
            // Tint if hit
            if (station.hit) {
                tint(256, 0, 0, 160)
            }

            if (station.alive) {
                image(this.img_station, station.coords.x, station.coords.y, this.tilesize, this.tilesize);
            } else {
                image(this.img_station_dead, station.coords.x, station.coords.y, this.tilesize, this.tilesize);
            }
            noTint()

            // Health/repair bar
            if (station.alive && station.health < station.max_health) {
                push()
                fill(100,63)
                //base
                rect(station.coords.x-20, station.coords.y-station.size/2-20,40,10);
                //health
                fill(0,220,0)
                rect(station.coords.x-20, station.coords.y-station.size/2-20,40*abs(station.health)/station.max_health,10);
                pop()
            }
            else if (!station.alive) {
                push()
                fill(158,125,125)
                //base
                rect(station.coords.x-20, station.coords.y-station.size/2-20,40,10);
                //health
                fill(256,0,0)
                rect(station.coords.x-20, station.coords.y-station.size/2-20,40*abs(station.repair_time)/station.max_repair_time,10);
                pop()
            }
        }

    }

}