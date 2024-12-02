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
        this.shootCooldown = 60; // Time between shots in frames

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

        // Final boss is defeated when health is 0
        if (this.health <= 0) {
            console.log("Final Boss defeated!");
            this.game.sprites = this.game.sprites.filter(sprite => sprite !== this); // Remove boss
        }

        return false;
    }

    /**
     * Handle boss shooting from both sides
     */
    handleShooting() {
        if (this.shootCooldown <= 0) {
            // Shoot bullets from the left and right sides
            const leftBullet = new BossBullet(this.x, this.y + this.height, 10, 20, 2);
            const rightBullet = new BossBullet(this.x + this.width - 10, this.y + this.height, 10, 20, 2);

            this.game.addSprite(leftBullet);
            this.game.addSprite(rightBullet);

            console.log("Final Boss shoots!");

            // Reset the cooldown
            this.shootCooldown = 60; // Adjust based on desired shooting frequency
        } else {
            this.shootCooldown--; // Decrease cooldown
        } a
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
}
