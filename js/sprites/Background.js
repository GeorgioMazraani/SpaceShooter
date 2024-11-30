class Background extends Sprite {
    constructor(imageSrc, speed, canvas) {
        super();
        this.image = new Image();
        this.image.src = imageSrc;
        this.speed = speed;
        this.canvas = canvas;
        this.bgY = 0;
    }

    update() {
        this.bgY += this.speed;
        if (this.bgY >= this.canvas.height) {
            this.bgY = 0;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, 0, this.bgY, this.canvas.width, this.canvas.height);
        ctx.drawImage(this.image, 0, this.bgY - this.canvas.height, this.canvas.width, this.canvas.height);
    }
}