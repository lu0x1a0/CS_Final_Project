CONST = {
    // Map constants
    TILESIZE : 64,
    WALL_DAMAGE : 0.5,

    // Entity constants
    PLAYER_SIZE : 64,
    PLAYER_MAX_SPEED : 16,
    PLAYER_ACCELERATION : 2.4,
    PLAYER_DRAG : 0.5,
    PLAYER_HEALTH : 100,
    PLAYER_HITBOX_SIZE : 45,
    PLAYER_START_GOLD : 10,

    CANNON_SPEED_FACTOR : 3,
    CANNON_VISION_FACTOR : 5,
    CANNON_START_ANGLE : Math.PI/3,
    CANNONBALL_DIAMETER : 12,
    CANNONBALL_DAMAGE : 10,


    TURRET_FIRING_RANGE : 7,
    TURRET_HEALTH : 50,
    TURRET_SIZE : 32,

    WHIRL_DAMAGE : 5,

    // Bot constants
    BOT_LOW_HEALTH : 50,
    BOT_RAM_CONDITION: 70,
    MAX_BOTS_ONSERVER: 1,


    // Timing constants
    HEARTBEAT_INTERVAL : 1000/20,
    INVINCIBILITY_FRAMES : 20*5,
    TREASURE_FISH_TIME : 20*1,
    TURRET_FRAME_FREQ : 20*2,
    TURRET_REPAIR_TIME : 20*5,
    WHIRLMOVETICK : 2000/(1000/20), //2 seconds,
    WEAPON_EFFECT_PERIOD : 20*20, // 20 Seconds

    // Treasure constants
    TREASURE_GOLD : 10,
    TREASURE_BONUS_GOLD : 20,
    TREASURE_HEALTH: 30,
    GOLD_HEALTH_CHANCE: 0.5,
    GOLD_PERCENT_DROP: 0.5,

    SIDE_DAMAGE_MULTIPLIER : 1/3,
    FRONT_BACK_DAMAGE_MULTIPLIER : 0.25/3,

    UPDATE_ESCAPEPIVOTS : 200,
    ESCAPE_RADIUS: 300,

    COST_INIT_VALUE: 1,
    TURRET_LOSING_RATE: 0.09,
    COST_INIT_PENALTY: 5,

    LAND_COST_INIT_PENATY: 4,
    NEARBY_LAND_ITERATIONS: 3,
    LAND_LOSING_RATE: 0.10,

    SHOOTING: 30,
}

CONST['RANGESTAT'] = {
    a        :0.42,
    b        :0.35,
    framelife:18, //
    range    :CONST.PLAYER_SIZE*CONST.CANNON_VISION_FACTOR
}


module.exports = {
    CONST: CONST
}
