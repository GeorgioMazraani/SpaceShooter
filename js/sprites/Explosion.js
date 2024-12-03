class Explosion extends Sprite {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 5;
        this.numberOfFrames = 60;
        this.rows = 6;
        this.columns = 10;
        this.frameWidth = 355;
        this.frameHeight = 365;
        this.explosion = new Image();
        this.explosion.src = "../assets/explosion.png";
        this.orbExplosionSoundEffect = new Audio("../assets/Sounds/explosion.wav");
        this.orbExplosionSoundEffect.play();
    }

    update() {
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex++;
            if (this.frameIndex >= this.numberOfFrames) {
                return true;
            }
        }
        return false;
    }

    draw(ctx) {
        const row = Math.floor(this.frameIndex / this.columns);
        const col = this.frameIndex % this.columns;

        ctx.drawImage(
            this.explosion,
            col * this.frameWidth,
            row * this.frameHeight,
            this.frameWidth,
            this.frameHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    animationFinished() {
        return this.frameIndex >= this.numberOfFrames;
    }
}
