
class SoundManager {

    constructor() {
        this.eventList = []
    }

    add_sound(type, pos) {
        this.eventList.push({type:type, pos:pos})
    }

    pop_events() {
        var popped = this.eventList
        this.eventList = []
        return popped
    }

}
module.exports = {
    SoundManager:SoundManager
}
