CONST = {
    // Map constants
    TILESIZE : 64,
    
    // Entity constants
    PLAYER_SIZE : 64,
    PLAYER_MAX_SPEED : 3,
    PLAYER_ACCELERATION : 0.3,
    PLAYER_DRAG : 0.1,
    PLAYER_HEALTH : 100,
    PLAYER_HITBOX_SIZE : 45,
    PLAYER_START_GOLD : 10,

    CANNON_SPEED_FACTOR : 3,
    CANNON_VISION_FACTOR : 5,
    CANNON_START_ANGLE : Math.PI/3,
    CANNONBALL_DIAMETER : 8,
    CANNONBALL_DAMAGE : 10,

    TURRET_FIRING_RANGE : 5,
    TURRET_FRAME_FREQ : 100,

    // Bot constants
    BOT_LOW_HEALTH : 50,

    // Mechanics constants
    HEARTBEAT_INTERVAL : 10,
    INVINCIBILITY_FRAMES : 200,
    TREASURE_FISH_TIME : 150,
    GOLD_AMT : 10,

    SIDE_DAMAGE_MULTIPLIER : 3,
    FRONT_BACK_DAMAGE_MULTIPLIER : 1,
}
rangestat = {
    a        :1/0.7,
    b        :0.7/0.7,
    framelife:18, // 
    range    :CONST.PLAYER_SIZE*CONST.CANNON_VISION_FACTOR
}
CONST['RANGESTAT'] = rangestat

module.exports = {
    CONST: CONST    
}