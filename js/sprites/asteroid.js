class Asteroid extends Sprite {
    constructor(x, y, game) {
        super();
        this.x = x;
        this.y = y;
        this.width = 50; // Width of each asteroid frame
        this.height = 50; // Height of each asteroid frame
        this.game = game;

        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 5; // Adjust to control animation speed
        this.numberOfFrames = 42; // 6 columns * 7 rows
        this.rows = 7;
        this.columns = 6;
        this.frameWidth = 128;
        this.frameHeight = 128;
        this.asteroidImg = new Image();
        this.asteroidImg.src = "../assets/asteroid.png"; // Path to the asteroid sprite sheet

        this.speed = 0.5; // Initial falling speed of the asteroid
        this.maxSpeed = 2; // Maximum falling speed
    }

    update() {
        // Move the asteroid downwards and increase its speed
        this.y += this.speed;
        if (this.speed < this.maxSpeed) {
            this.speed += 0.05; // Increase the speed over time
        }

        // Check if the asteroid has fallen off the screen
        if (this.y > this.game.canvas.height) {
            return true; // Remove asteroid if it goes off-screen
        }

        // Handle collision with plane
        const plane = this.game.sprites.find(sprite => sprite instanceof Plane);
        if (plane && plane.isActive && this.isColliding(plane)) {
            // Trigger the restart screen if the asteroid hits the plane
            this.game.showRestartScreen();
            return true; // Destroy asteroid after collision
        }

        // Handle collision with bullets
        for (let sprite of this.game.sprites) {
            if (sprite instanceof Bullet && this.isColliding(sprite)) {
                sprite.isActive = false; // Destroy bullet

                // Create an explosion at the asteroid's location
                const explosion = new AsteroidExplosion(this.x, this.y, this.width, this.height);
                this.game.sprites.push(explosion); // Add explosion to the game

                // Optional: Play explosion sound
                const explosionSound = new Audio('../assets/Sounds/explodeAsteroid.mp3');
                explosionSound.play().catch(err => console.error('Audio error:', err));

                // Drop shield or extra life with a random chance
                this.dropPowerUp();

                return true; // Destroy asteroid after collision
            }
        }

        // Update animation frame
        this.updateAnimation();

        return false; // Keep asteroid active
    }

    draw(ctx) {
        // Calculate row and column for the current frame
        const row = Math.floor(this.frameIndex / this.columns);
        const col = this.frameIndex % this.columns;

        // Draw the current frame from the sprite sheet
        ctx.drawImage(
            this.asteroidImg,
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

    // Drop a random power-up
    dropPowerUp() {
        const chance = Math.random();
        if (chance < 0.3) { // 30% chance to drop a shield
            const shield = new PowerUp(this.x, this.y, 'shield');
            this.game.addSprite(shield);
            console.log("Shield dropped!");
        } else if (chance < 0.5) { // 20% chance to drop an extra life
            const extraLife = new PowerUp(this.x, this.y, 'extra-life');
            this.game.addSprite(extraLife);
            console.log("Extra life dropped!");
        }
    }

    // Collision detection
    isColliding(sprite) {
        return (
            this.x < sprite.x + sprite.width &&
            this.x + this.width > sprite.x &&
            this.y < sprite.y + sprite.height &&
            this.y + this.height > sprite.y
        );
    }

    // Handle asteroid animation
    updateAnimation() {
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex++;
            if (this.frameIndex >= this.numberOfFrames) {
                this.frameIndex = 0; // Loop back to the first frame
            }
        }
    }
}
