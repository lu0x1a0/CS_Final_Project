
class SoundRender {

    constructor() { }


    preload() {
        // Music
        this.music_main = loadSound('assets/main_music.mp3');
        this.music_dead = loadSound('assets/dead_music.mp3');

        // SFX
        this.sfx_cannon_fire = loadSound('assets/sfx_cannon_fire.mp3')
        this.sfx_cannon_fire.playMode('restart')

        this.sfx_damage = loadSound('assets/sfx_damage.mp3')
        this.sfx_damage.playMode('restart')

        this.sfx_death = loadSound('assets/sfx_death.mp3')
        this.sfx_death.playMode('restart')

        this.sfx_get_treasure = loadSound('assets/sfx_get_treasure.mp3')
        this.sfx_get_treasure.playMode('restart')

    }

    set_tilesize(tilesize) {
        this.tilesize = tilesize
    }

    set_music_vol(val) {
        this.music_main.setVolume(val)
        this.music_dead.setVolume(val)
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
                        //this.sfx_cannon_fire.setVolume(this.sfx_vol*vol_factor)
                        this.sfx_cannon_fire.play(0,1,this.sfx_vol*vol_factor);
                        break;
                    case 'get_treasure':
                        //this.sfx_get_treasure.setVolume(this.sfx_vol*vol_factor)
                        this.sfx_get_treasure.play(0,1,this.sfx_vol*vol_factor);
                        break;
                    case 'damage':
                        this.sfx_damage.play(0,1,this.sfx_vol*vol_factor);
                        break;
                    case 'death':
                        this.sfx_death.play(0,1,this.sfx_vol*vol_factor);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    vol_factor(coords1, coords2) {

        var tile_dist = (Math.sqrt(Math.pow(coords1.x-coords2.x, 2) + Math.pow(coords1.y-coords2.y, 2)))/this.tilesize

        // Linear interpolation in this range
        var min = 2
        var max = 10

        if (tile_dist < min) {
            return 1
        } else if (tile_dist < max) {
            return (tile_dist - max) / (min - max)
        } else {
            return 0
        }
    }

}