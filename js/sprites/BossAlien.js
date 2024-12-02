class BossAlien extends Sprite {
    constructor(x, y, width, height, speed, game) {
        super();
        this.x = x; // Initial X position
        this.y = y; // Initial Y position
        this.width = width; // Boss width
        this.height = height; // Boss height
        this.speed = speed; // Vertical movement speed
        this.game = game; // Reference to the game object
        this.health = 10; // Default health for the boss
        this.maxHealth = this.health; // Track maximum health for health bar
        this.shootCooldown = 80; // Cooldown for shooting projectiles
        this.currentCooldown = this.shootCooldown; // Track current cooldown

        // Sine wave properties
        this.waveOffset = Math.random() * Math.PI * 2; // Random initial wave position
        this.amplitude = 50; // Sine wave amplitude (horizontal range)
        this.frequency = 0.05; // Frequency of the sine wave motion

        // Boss visual assets
        this.bossImage = new Image();
        this.bossImage.src = '../assets/bossAlien.png';
        this.explosionSound = new Audio('../assets/Sounds/explosion.wav');
    }

    update(sprites) {
        // Sine wave motion
        this.x += Math.sin(this.waveOffset) * this.amplitude * this.frequency; // Horizontal sine wave motion
        this.waveOffset += this.frequency; // Increment wave position
        this.y += this.speed; // Vertical downward movement

        // Remove if out of bounds
        if (this.y > this.game.canvas.height) {
            return true;
        }

        // Shooting logic
        if (this.currentCooldown <= 0) {
            this.shoot();
            this.currentCooldown = this.shootCooldown;
        } else {
            this.currentCooldown--;
        }

        // Collision with bullets
        for (let sprite of sprites) {
            if (sprite instanceof Bullet && this.isColliding(sprite)) {
                this.takeDamage(sprite);
                sprite.isActive = false;
            }
        }

        // Remove if health reaches zero
        if (this.health <= 0) {
            this.explosionSound.play().catch(err => console.error('Audio error:', err));

            // Create explosion
            const explosion = new Explosion(this.x, this.y, this.width, this.height);
            sprites.push(explosion);
            return true;
        }

        return false; // Boss remains active
    }

    takeDamage(sprite) {
        this.health--;
        console.log(`Boss health: ${this.health}`);
        this.explosionSound.play().catch(err => console.error('Audio error:', err));
    }

    shoot() {
        const bulletX = this.x - this.width / 2 + 5;
        const bulletY = this.y + this.height;
        this.game.addSprite(new BossBullet(bulletX, bulletY, 10, 20, 4));
    }



    draw(ctx) {
        ctx.drawImage(
            this.bossImage,
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );

        // Draw health bar
        const healthBarWidth = (this.health / this.maxHealth) * this.width;
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 10, this.width, 5);
        ctx.fillStyle = "green";
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 10, healthBarWidth, 5);
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
