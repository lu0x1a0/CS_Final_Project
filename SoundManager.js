
class SoundManager {

    constructor() {
        this.eventList = []
    }

    add_sound(type, pos) {
        this.eventList.push({type:type, pos:pos})
    }

    give_events() {
        return this.eventList
    }

    reset_events() {
        this.eventList = []
    }

}
module.exports = {
    SoundManager:SoundManager
}
