class FinalBoss extends Sprite {
    constructor(game, x, y, width, height, health) {
        super();
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.health = health;
        this.maxHealth = health;
        this.speed = 1; // Movement speed
        this.movementOffset = 80; // Mimic player movement offset
        this.bossImage = new Image();
        this.bossImage.src = '../assets/finalBoss.png';
        this.shootCooldown = 120; // Time between shots in frames

        // Load and play the boss sound
        this.bossSound = new Audio('../assets/Sounds/finalBoss.mp3');
        this.bossSound.volume = 0.8; // Adjust volume
        this.bossSound.play().catch((err) => console.error('Audio playback error:', err));
    }

    /**
     * Update the boss's state
     */
    update(sprites) {
        const player = this.game.sprites.find(sprite => sprite instanceof Plane);
        if (player) {
            // Mimic player's horizontal movement with some delay
            if (Math.abs(this.x - player.x) > this.movementOffset) {
                this.x += this.speed * Math.sign(player.x - this.x);
            }
        }

        // Handle shooting
        this.handleShooting();

        // Handle being hit by player's bullets
        this.handleCollisions(sprites);

        // Final boss is defeated when health is 0
        if (this.health <= 0) {
            const explosion = new Explosion(this.x, this.y, this.width, this.height);
            sprites.push(explosion);
            return true;
        }

        return false;
    }

    /**
     * Handle boss shooting bullets from left and right sides
     */
    handleShooting() {
        if (this.shootCooldown <= 0) {
            // Shoot a bullet from the left and right sides of the boss
            const leftBullet = new BossBullet(this.x, this.y + this.height, 10, 20, 3);
            const rightBullet = new BossBullet(this.x + this.width - 10, this.y + this.height, 10, 20, 3);

            this.game.addSprite(leftBullet);
            this.game.addSprite(rightBullet);

            console.log("Final Boss shoots!");

            // Reset the cooldown
            this.shootCooldown = 120; // Adjust to control shooting frequency
        } else {
            this.shootCooldown--; // Decrease cooldown
        }
    }

    /**
     * Handle collisions with player's bullets
     */
    handleCollisions(sprites) {
        for (let sprite of sprites) {
            if (sprite instanceof Bullet && this.isColliding(sprite)) {
                sprite.isActive = false; // Destroy the bullet
                this.health -= 5; // Decrease health (adjust as needed)
                console.log(`Final Boss hit! Health: ${this.health}`);
            }
        }
    }

    /**
     * Draw the boss and its health bar
     */
    draw(ctx) {
        ctx.drawImage(
            this.bossImage,
            this.x,
            this.y,
            this.width,
            this.height
        );

        // Draw health bar
        ctx.fillStyle = "green";
        const healthBarWidth = (this.health / this.maxHealth) * this.width;
        ctx.fillRect(this.x, this.y - 10, healthBarWidth, 5);

        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y - 10, this.width, 5);
    }

    /**
     * Check collision with another sprite
     */
    isColliding(sprite) {
        return (
            this.x < sprite.x + sprite.width &&
            this.x + this.width > sprite.x &&
            this.y < sprite.y + sprite.height &&
            this.y + this.height > sprite.y
        );
    }
}
