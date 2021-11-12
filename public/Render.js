class Render {

    constructor() {

        this.id
        this.frameNo = 0
        this.VIEWDISTANCE = 16

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

    set_viewdistance(val) {
        this.VIEWDISTANCE = val
    }

    load_gamemap(gamemap) {
        this.tilesize = gamemap.tilesize

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

        var centertile
        var centerpoint

        if (!dead) {
            for (var i in state.playerlist) {
                if (state.playerlist[i].id == this.id) {
                    var player = state.playerlist[i]
                    continue
                }
            }
            centertile = {x: Math.floor(player.pos.x/this.tilesize),y: Math.floor(player.pos.y/this.tilesize)}
            centerpoint = player.pos
            translate(-player.pos.x, -player.pos.y)
        } else {
            centertile = {x: Math.floor(dead.x/this.tilesize),y: Math.floor(dead.y/this.tilesize)}
            centerpoint = dead
            translate(-dead.x, -dead.y)
        }

        // Loading map-based render
        this.treasurerender.load_treasure(state.treasurelist)
        this.turretrender.load_turrets(state.turretlist)
        this.stationrender.load_stations(state.stationlist)
        this.whirlrender.load_whirl(state.whirllist)
        
        // Map-based render
        this.gamemaprender.display(centertile, this.VIEWDISTANCE, this.frameNo)
        this.treasurerender.display(centertile, this.VIEWDISTANCE, this.frameNo)
        this.turretrender.display(centertile, this.VIEWDISTANCE)
        this.stationrender.display(centertile, this.VIEWDISTANCE)
        this.whirlrender.display(centertile, this.VIEWDISTANCE)

        // Event render
        this.eventrender.display(centertile, this.VIEWDISTANCE, state.animationlist)

        // Render border
        fill(color(0,0,0))
        // Left
        rect(centerpoint.x-(this.VIEWDISTANCE+1)*this.tilesize, centerpoint.y-(this.VIEWDISTANCE+1)*this.tilesize, this.tilesize, 2*(this.VIEWDISTANCE+1)*this.tilesize)
        // Right
        rect(centerpoint.x+(this.VIEWDISTANCE)*this.tilesize, centerpoint.y-(this.VIEWDISTANCE+1)*this.tilesize, this.tilesize, 2*(this.VIEWDISTANCE+1)*this.tilesize)
        // Up
        rect(centerpoint.x-(this.VIEWDISTANCE+1)*this.tilesize, centerpoint.y-(this.VIEWDISTANCE+1)*this.tilesize, 2*(this.VIEWDISTANCE+1)*this.tilesize, this.tilesize)
        // Down
        rect(centerpoint.x-(this.VIEWDISTANCE+1)*this.tilesize, centerpoint.y+(this.VIEWDISTANCE)*this.tilesize, 2*(this.VIEWDISTANCE+1)*this.tilesize, this.tilesize)

        // Rendering players
        for (var i in state.playerlist) {
            var player = state.playerlist[i]

            if (player.id !== this.id) {
                // Other players

                
                // Don't render if out of view
                if (Math.floor(player.pos.x/this.tilesize) > centertile.x + this.VIEWDISTANCE
                    || Math.floor(player.pos.x/this.tilesize) < centertile.x - this.VIEWDISTANCE
                    || Math.floor(player.pos.y/this.tilesize) > centertile.y + this.VIEWDISTANCE
                    || Math.floor(player.pos.y/this.tilesize) < centertile.y - this.VIEWDISTANCE)  { continue }

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

        // Rendering projectiles
        for (var i in state.projectilelist){
            var projectile = state.projectilelist[i]

            // Don't render if out of view
            if (Math.floor(projectile.pos.x/this.tilesize) > centertile.x + this.VIEWDISTANCE
                || Math.floor(projectile.pos.x/this.tilesize) < centertile.x - this.VIEWDISTANCE
                || Math.floor(projectile.pos.y/this.tilesize) > centertile.y + this.VIEWDISTANCE
                || Math.floor(projectile.pos.y/this.tilesize) < centertile.y - this.VIEWDISTANCE)  { continue }

            this.playerrender.cannonballshow(projectile)
        }

        // Increase frameNo
        this.frameNo++
    }
}
