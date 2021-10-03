class GameMap {

    // These should eventually be moved to a separate image file

    constructor() { }

    preload() {
        this.img_water = loadImage('assets/img_water.png');
        this.img_land = loadImage('assets/img_land.png');
        this.img = loadImage('assets/test.jpg');
    }

    display() {
        console.log("Mitch is a based boi")
        console.log("Mitch is a saucy boi")
        image(this.img, 0, 0);
        image(this.img_water, 1, 1);
        image(this.img_land, -1, -1);
    }


}