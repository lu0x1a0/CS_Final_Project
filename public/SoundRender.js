
class SoundRender {

    constructor() { }


    preload() {
        // Music
        this.music_main = loadSound('assets/main_music.mp3');

        // SFX
        this.sfx_cannon_fire = loadSound('assets/sfx_cannon_fire.mp3')
        this.sfx_get_treasure = loadSound('assets/sfx_get_treasure.mp3')

    }

    set_tilesize(tilesize) {
        this.tilesize = tilesize
    }

    set_music_vol(val) {
        this.music_main.setVolume(val)
    }
    
    set_sfx_vol(val) {
        this.sfx_vol = val
    }

    play_sounds(shipPos, eventlist) {

        for (let i=0; i<eventlist.length; i++) {

            var vol_factor = this.vol_factor(shipPos, eventlist[i].pos)

            if (vol_factor > 0) {

                switch (eventlist[i].type) {
                    case 'cannon_fire':
                        this.sfx_cannon_fire.setVolume(this.sfx_vol*vol_factor)
                        this.sfx_cannon_fire.play();
                        break;
                    case 'get_treasure':
                        this.sfx_get_treasure.setVolume(this.sfx_vol*vol_factor)
                        this.sfx_get_treasure.play();
                        break;
                    default:
                        break;
                }
            }
        }
    }

    vol_factor(coords1, coords2) {

        var dist = Math.sqrt(Math.pow(coords1.x-coords2.x, 2) + Math.pow(coords1.y-coords2.y, 2))

        if (dist > this.tilesize*10) {
            return 0
        } else {
            return Math.tanh((this.tilesize/dist)/2)
        }
    }

}