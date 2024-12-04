class Shield extends Sprite {
    constructor(x, y, width, height, game) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.game = game;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 5;
        this.numberOfFrames = 60;
        this.rows = 7;
        this.columns = 9;
        this.frameWidth = 265;
        this.frameHeight = 265;
        this.imageLoaded = false;
        this.durationFrames = 600;

        this.shieldImg = new Image();
        this.shieldImg.src = "../assets/ShieldAnimation.png";

        this.shieldImg.onload = () => {
            this.imageLoaded = true;
        };

        this.shieldImg.onerror = (error) => {
            console.error("Failed to load shield animation image:", error);
        };
    }

    update() {
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex++;
            if (this.frameIndex >= this.numberOfFrames) {
                this.frameIndex = 0;
            }
        }

        this.durationFrames--;
        if (this.durationFrames <= 0) {
            return true;
        }

        const plane = this.game.sprites.find(sprite => sprite instanceof Plane);
        if (plane) {
            this.x = plane.x;
            this.y = plane.y;
        }

        return false;
    }

    draw(ctx) {
        if (!this.imageLoaded) {
            return;
        }

        const row = Math.floor(this.frameIndex / this.columns);
        const col = this.frameIndex % this.columns;

        ctx.drawImage(
            this.shieldImg,
            col * this.frameWidth,
            row * this.frameHeight,
            this.frameWidth,
            this.frameHeight,
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    }
}
