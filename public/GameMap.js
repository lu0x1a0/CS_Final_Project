class GameMap {

    // These should eventually be moved to a separate image file

    constructor() {
        this.img_water = loadImage('assets/img_water.png');
        this.img_land = loadImage('assets/img_land.png');
        this.img = loadImage('assets/test.jpg');
    }

    show() {
        image(img, 0, 0);
        console.log("Mitch is a saucy boi")
    }


}