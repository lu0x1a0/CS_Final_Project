
class SoundRender {

    constructor() { }


    preload() {

        // Music
        this.music_main = new Howl({
            src:'assets/mus/main_music.mp3',
            loop: true,
        })
        this.music_dead = new Howl({
            src:'assets/mus/dead_music.mp3',
            loop: true,
        })

        // SFX
        this.sfx_cannon_fire = new Howl({
            src:'assets/sfx/sfx_cannon_fire.mp3',
        })

        this.sfx_damage = new Howl({
            src:'assets/sfx/sfx_damage.mp3',
        })

        this.sfx_death = new Howl({
            src:'assets/sfx/sfx_death.mp3',
        })

        this.sfx_get_treasure = new Howl({
            src:'assets/sfx/sfx_get_treasure.mp3',
        })
    }

    start_music_main() {
        this.music_main.play()
    }

    stop_music_main() {
        this.music_main.stop()
    }

    start_music_dead() {
        this.music_dead.play()
    }

    stop_music_dead() {
        this.music_dead.stop()
    }

    set_tilesize(tilesize) {
        this.tilesize = tilesize
    }

    set_music_vol(val) {
        this.music_main.volume(val)
        this.music_dead.volume(val)
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
                        this.sfx_cannon_fire.volume(this.sfx_vol*vol_factor)
                        this.sfx_cannon_fire.play(/*0,1,this.sfx_vol*vol_factor*/)
                        break;
                    case 'get_treasure':
                        this.sfx_get_treasure.volume(this.sfx_vol*vol_factor)
                        this.sfx_get_treasure.play(/*0,1,this.sfx_vol*vol_factor*/)
                        break;
                    case 'damage':
                        this.sfx_damage.volume(this.sfx_vol*vol_factor)
                        this.sfx_damage.play(/*0,1,this.sfx_vol*vol_factor*/)
                        break;
                    case 'death':
                        this.sfx_death.volume(this.sfx_vol*vol_factor)
                        this.sfx_death.play(/*0,1,this.sfx_vol*vol_factor*/)
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