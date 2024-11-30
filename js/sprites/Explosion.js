class Explosion extends Sprite {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;  // The desired width on canvas
        this.height = height; // The desired height on canvas
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 5; // Adjust for animation speed
        this.numberOfFrames = 60; // Total number of frames (6 rows * 10 columns)
        this.rows = 6; // Number of rows in the sprite sheet
        this.columns = 10; // Number of columns in the sprite sheet
        this.frameWidth = 355;  // Width of each frame in the sprite sheet
        this.frameHeight = 365; // Height of each frame in the sprite sheet
        this.explosion = new Image();
        this.explosion.src = "../assets/explosion.png"; // Path to the spritesheet
        this.orbExplosionSoundEffect = new Audio("../assets/Sounds/explosion.wav");
        this.orbExplosionSoundEffect.play();
    }

    update() {
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex++;
            if (this.frameIndex >= this.numberOfFrames) {
                return true; // Animation finished
            }
        }
        return false; // Animation still running
    }

    draw(ctx) {
        // Calculate row and column for the current frame
        const row = Math.floor(this.frameIndex / this.columns); // Row for current frame
        const col = this.frameIndex % this.columns; // Column for current frame

        // Draw the current frame from the spritesheet, scaling it to fit the canvas frame size
        ctx.drawImage(
            this.explosion,
            col * this.frameWidth, // X position in the sprite sheet
            row * this.frameHeight, // Y position in the sprite sheet
            this.frameWidth,        // Width of the frame in the sprite sheet
            this.frameHeight,       // Height of the frame in the sprite sheet
            this.x,                 // X position on canvas
            this.y,                 // Y position on canvas
            this.width,             // Width on canvas (scaled size)
            this.height             // Height on canvas (scaled size)
        );
    }

    animationFinished() {
        return this.frameIndex >= this.numberOfFrames; // Returns true when animation finishes
    }
}
