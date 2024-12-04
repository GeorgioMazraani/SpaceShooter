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
        this.speed = 1; // Horizontal movement speed
        this.direction = 1; // 1 for right, -1 for left
        this.bossImage = new Image();
        this.bossImage.src = '../assets/finalBoss.png';
        this.shootCooldown = 120;

        this.bossSound = new Audio('../assets/Sounds/finalBoss.mp3');
        this.bossSound.volume = 0.8;
        this.bossSound.play().catch((err) => console.error('Audio playback error:', err));
    }

    update(sprites) {
        // Move the boss left and right
        this.x += this.speed * this.direction;

        // Reverse direction when hitting the canvas edges
        if (this.x <= 0 || this.x + this.width >= this.game.canvas.width) {
            this.direction *= -1; // Reverse direction
        }

        this.handleShooting();
        this.handleCollisions(sprites);

        // Check if health is zero or below
        if (this.health <= 0) {
            const explosion = new Explosion(this.x, this.y, this.width, this.height);
            sprites.push(explosion);
            return true; // Remove the boss
        }

        return false; // Keep the boss active
    }

    handleShooting() {
        if (this.shootCooldown <= 0) {
            const leftBullet = new BossBullet(this.x, this.y + this.height, 10, 20, 3);
            const rightBullet = new BossBullet(this.x + this.width - 10, this.y + this.height, 10, 20, 3);

            this.game.addSprite(leftBullet);
            this.game.addSprite(rightBullet);

            console.log("Final Boss shoots!");

            this.shootCooldown = 120;
        } else {
            this.shootCooldown--;
        }
    }

    handleCollisions(sprites) {
        for (let sprite of sprites) {
            if (sprite instanceof Bullet && this.isColliding(sprite)) {
                sprite.isActive = false;
                this.health -= 5;
                console.log(`Final Boss hit! Health: ${this.health}`);
            }
        }
    }

    draw(ctx) {
        ctx.drawImage(this.bossImage, this.x, this.y, this.width, this.height);

        // Draw health bar
        ctx.fillStyle = "green";
        const healthBarWidth = (this.health / this.maxHealth) * this.width;
        ctx.fillRect(this.x, this.y - 10, healthBarWidth, 5);

        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y - 10, this.width, 5);
    }

    isColliding(sprite) {
        return (
            this.x < sprite.x + sprite.width &&
            this.x + this.width > sprite.x &&
            this.y < sprite.y + sprite.height &&
            this.y + this.height > sprite.y
        );
    }
}
