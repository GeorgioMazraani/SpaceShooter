class AsteroidExplosion extends Sprite {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width; // Width of the explosion (scaled)
        this.height = height; // Height of the explosion (scaled)
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 5;  // Adjust animation speed
        this.numberOfFrames = 60; // Total frames in the sprite sheet (6 rows * 10 columns)
        this.rows = 6;           // Number of rows in the sprite sheet
        this.columns = 10;       // Number of columns in the sprite sheet
        this.frameWidth = 516;   // Width of each frame in the sprite sheet
        this.frameHeight = 463;  // Height of each frame in the sprite sheet
        this.explosion = new Image();
        this.explosion.src = "../assets/asteroidExplosion.png"; // Path to the explosion sprite sheet
        this.explosionSound = new Audio("../assets/Sounds/explodeAsteroid.mp3"); // Explosion sound effect
        this.explosionSound.play();
    }

    update() {
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex++;
            if (this.frameIndex >= this.numberOfFrames) {
                return true;  // Return true when animation finishes
            }
        }
        return false; // Animation still running
    }

    draw(ctx) {
        // Calculate row and column for the current frame
        const row = Math.floor(this.frameIndex / this.columns); // Row for the current frame
        const col = this.frameIndex % this.columns; // Column for the current frame

        // Draw the current frame from the sprite sheet
        ctx.drawImage(
            this.explosion,
            col * this.frameWidth, // X position in the sprite sheet
            row * this.frameHeight, // Y position in the sprite sheet
            this.frameWidth,        // Width of each frame
            this.frameHeight,       // Height of each frame
            this.x,                 // X position on canvas
            this.y,                 // Y position on canvas
            this.width,             // Width on canvas
            this.height             // Height on canvas
        );
    }

    animationFinished() {
        return this.frameIndex >= this.numberOfFrames;  // Returns true when animation finishes
    }
}
