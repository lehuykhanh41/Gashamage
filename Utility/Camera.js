class Camera {
    constructor (width, height, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }

    resetCamera() {
        this.width = 720;
        this.height = 576;
        this.x = 360;
        this.y = 0;
    }
}

var camera = new Camera(720, 576, 360, 0);