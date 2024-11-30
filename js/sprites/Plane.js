class Plane extends Sprite {
    constructor(x, y, speed, game) {
        super();
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.defaultSpeed = speed;
        this.isActive = true; // Plane is active initially
        this.color = 'blue';
        this.shootCooldown = 0;
        this.width = 60;
        this.height = 60;
        this.game = game;
        this.bulletLines = 1; // Number of bullet lines
        this.health = 3; // Health of the plane
        this.jetImage = new Image();
        this.jetImage.src = '../assets/jet.png';
    }

    increaseBulletLines() {
        this.bulletLines = Math.min(this.bulletLines + 1, 3);
    }

    handleMovement(keys) {
        const level = this.game.levelManager?.currentLevel || 1;

        // Increase speed slightly for harder levels
        const speedMultiplier = 1 + (level - 1) * 0.2;
        const currentSpeed = this.speed * speedMultiplier;

        if ((keys['ArrowLeft'] || keys['a']) && this.x - this.width / 2 > 0) {
            this.x -= currentSpeed;
        }
        if ((keys['ArrowRight'] || keys['d']) && this.x + this.width / 2 < this.game.canvas.width) {
            this.x += currentSpeed;
        }
        if ((keys['ArrowUp'] || keys['w']) && this.y - this.height > 0) {
            this.y -= currentSpeed;
        }
        if ((keys['ArrowDown'] || keys['s']) && this.y + this.height < this.game.canvas.height) {
            this.y += currentSpeed;
        }
    }

    handleShooting() {
        const level = this.game.levelManager?.currentLevel || 1;
        const bulletSpeed = 8 + (level - 1) * 2; // Increase bullet speed for higher levels

        if (this.game.keys[' '] && this.shootCooldown <= 0) {
            if (this.bulletLines === 1) {
                this.game.addSprite(new Bullet(this.x - 2.5, this.y - 10, 5, 10, bulletSpeed));
            } else if (this.bulletLines === 2) {
                this.game.addSprite(new Bullet(this.x - 10, this.y - 10, 5, 10, bulletSpeed));
                this.game.addSprite(new Bullet(this.x + 10, this.y - 10, 5, 10, bulletSpeed));
            } else if (this.bulletLines === 3) {
                this.game.addSprite(new Bullet(this.x - 15, this.y - 10, 5, 10, bulletSpeed));
                this.game.addSprite(new Bullet(this.x, this.y - 10, 5, 10, bulletSpeed));
                this.game.addSprite(new Bullet(this.x + 15, this.y - 10, 5, 10, bulletSpeed));
            }

            this.shootCooldown = 20 - (level - 1); // Decrease cooldown for higher levels
        }

        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
    }

    handleCollisions(sprites) {
        for (const sprite of sprites) {
            if (sprite instanceof Enemy || sprite instanceof Asteroid || sprite instanceof BossBullet) {
                if (this.isColliding(sprite)) {
                    sprite.isActive = false; // Destroy the colliding sprite
                    this.health--;

                    // Trigger game over if health reaches 0
                    if (this.health <= 0) {
                        this.isActive = false;
                        this.game.addSprite(new GameOver(this.game));
                    }
                    return;
                }
            }
        }
    }

    update(sprites, keys) {
        this.handleMovement(keys);
        this.handleShooting();
        this.handleCollisions(sprites);

        return !this.isActive; // Return true if the plane should be removed
    }

    draw(ctx) {
        if (this.isActive) {
            ctx.drawImage(
                this.jetImage,
                this.x - this.width / 2,
                this.y - this.height / 2,
                this.width,
                this.height
            );

            // Draw health bar
            ctx.fillStyle = "green";
            ctx.fillRect(this.x - this.width / 2, this.y + this.height / 2 + 5, (this.width * this.health) / 3, 5);
        }
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
