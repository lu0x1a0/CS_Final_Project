
class EventManager {

    constructor() {
        this.soundlist = []
        this.animationlist = []
    }

    add_sound(type, pos) {
        this.soundlist.push({type:type, pos:pos})
    }

    add_animation(data) {
        this.animationlist.push(data)
    }

    pop_sounds() {
        var popped = this.soundlist
        this.soundlist = []
        return popped
    }

    pop_animations() {
        var popped = this.animationlist
        this.animationlist = []
        return popped
    }

}
module.exports = {
    EventManager:EventManager
}
