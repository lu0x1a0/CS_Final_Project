class Render {

    constructor() {

        this.id
        this.frameNo = 0

        this.playerrender = new PlayerRender()
        this.playerrender.preload()

        this.gamemaprender = new GameMapRender()
        this.gamemaprender.preload()

        this.treasurerender = new TreasureRender()
        this.treasurerender.preload()

        this.turretrender = new TurretRender()
        this.turretrender.preload()

        this.stationrender = new StationRender()
        this.stationrender.preload()

        this.eventrender = new EventRender()
        this.eventrender.preload()

        this.whirlrender = new WhirlRender()
        this.whirlrender.preload()

        // Sounds
        this.soundrender = new SoundRender()
        this.soundrender.preload()

    }

    setup() {
        this.gamemaprender.setup()
    }

    set_id(id) {
        this.id = id
    }

    load_gamemap(gamemap) {
        this.gamemaprender.load_map(gamemap)
        this.soundrender.set_tilesize(gamemap.tilesize)
        this.treasurerender.first_load(gamemap)
        this.turretrender.first_load(gamemap)
        this.stationrender.first_load(gamemap)
        this.whirlrender.first_load(gamemap)
    }

    render(state, dead=0) {

        // Background and camera
        background(0)
        translate(width / 2, height / 2)

        if (!dead) {
            for (var i in state.playerlist) {
                if (state.playerlist[i].id == this.id) {
                    var player = state.playerlist[i]
                    continue
                }
            }
            translate(-player.pos.x, -player.pos.y)
        } else {
            translate(-dead.x, -dead.y)
        }


        // Loading map-based render
        this.treasurerender.load_treasure(state.treasurelist)
        this.turretrender.load_turrets(state.turretlist)
        this.stationrender.load_stations(state.stationlist)
        this.whirlrender.load_whirl(state.whirllist)
        
        // Map-based render
        this.gamemaprender.display(this.frameNo)
        this.treasurerender.display(this.frameNo)
        this.turretrender.display()
        this.stationrender.display()
        this.whirlrender.display()

        // Event render
        this.eventrender.display(state.animationlist)


        for (var i in state.playerlist) {
            var player = state.playerlist[i]

            if (player.id !== this.id) {
                // Other players
                showship(
                    player.dir,
                    player.pos,
                    this.playerrender.img_boat,
                    player.username,
                    player.size,
                    player.health,
                    [],
                    player.gold,
                    player.OnTreasure,
                    player.SpaceCounter,
                    player.treasure_fish_time,
                    player.invincible,
                    player.hit,
                )
            }
            else {

                // Player
                this.playerrender.load_player(player)
                this.playerrender.show()

                // Sounds
                this.soundrender.play_sounds(player.pos, state.soundlist)
            }
        }

        // Projectiles
        for (var i in state.projectilelist){
            var projectile = state.projectilelist[i]
            this.playerrender.cannonballshow(projectile)
        }

        // Increase frameNo
        this.frameNo++
    }
}
