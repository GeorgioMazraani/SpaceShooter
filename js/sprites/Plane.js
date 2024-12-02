class Plane extends Sprite {
    constructor(x, y, speed, game, bulletType = "Default", shieldPurchased = false) {
        super();
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.isActive = true; // Plane starts active
        this.color = 'blue';
        this.shootCooldown = 0;
        this.width = 60;
        this.height = 60;
        this.game = game;
        this.bulletLines = 1; // Number of bullet lines
        this.health = 10; // Initial health
        this.maxHealth = 10; // Max health for the plane
        this.shieldActive = false; // Shield status
        this.shieldDurationFrames = 0; // Shield timer in frames (60 FPS)
        this.jetImage = new Image();
        this.jetImage.src = '../assets/jet.png';

        // Apply upgrades based on parameters
        this.applyUpgrades(bulletType, shieldPurchased);
    }

    /**
     * Apply upgrades to the plane (e.g., bullet type, shield).
     * @param {string} bulletType - The selected bullet type ("Default", "Double Bullet", etc.).
     * @param {boolean} shieldPurchased - Whether the shield was purchased.
     */
    applyUpgrades(bulletType, shieldPurchased) {
        // Apply bullet upgrade
        if (bulletType === "Double Bullet") {
            this.bulletLines = 2;
            console.log("Upgraded to Double Bullet!");
        } else if (bulletType === "Triple Bullet") {
            this.bulletLines = 3;
            console.log("Upgraded to Triple Bullet!");
        }

        // Apply shield upgrade
        if (shieldPurchased) {
            this.activateShield(20); // Activate shield for 10 seconds
        }
    }
    /**
     * Increase the number of bullet lines, up to a maximum of 3.
     */
    increaseBulletLines() {
        this.bulletLines = Math.min(this.bulletLines + 1, 3);
        console.log(`Bullet lines increased! Current: ${this.bulletLines}`);
    }

    /**
     * Restore health when collecting a heart power-up, up to the maximum health.
     * @param {number} amount - Amount of health to restore.
     */
    restoreHealth(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
        console.log(`Health restored! Current health: ${this.health}`);
    }

    /**
     * Activate a temporary shield that prevents damage.
     * @param {number} durationInSeconds - Duration of the shield in seconds.
     */
    activateShield(durationInSeconds = 10) {
        this.shieldActive = true;
        this.shieldDurationFrames = durationInSeconds * 60; // Convert duration to frames
        console.log(`Shield activated for ${durationInSeconds} seconds!`);
    }

    /**
     * Handle taking damage. Reduces health and deactivates the plane if health drops to 0.
     * @param {number} amount - Amount of damage to take.
     */
    takeDamage(amount) {
        if (this.shieldActive) {
            console.log("Shield absorbed damage!");
            return; // No damage taken if shield is active
        }

        this.health -= amount;
        console.log(`Plane took ${amount} damage. Current health: ${this.health}`);

        if (this.health <= 0) {
            this.health = 0; // Prevent negative health
            this.isActive = false; // Deactivate the plane
            this.game.addSprite(new GameOver(this.game)); // Trigger game over
            console.log("Game Over!");
        }
    }

    handleMovement(keys) {

        if ((keys['ArrowLeft'] || keys['a']) && this.x - this.width / 2 > 0) {
            this.x -= this.speed;
        }
        if ((keys['ArrowRight'] || keys['d']) && this.x + this.width / 2 < this.game.canvas.width) {
            this.x += this.speed;
        }
        if ((keys['ArrowUp'] || keys['w']) && this.y - this.height > 0) {
            this.y -= this.speed;
        }
        if ((keys['ArrowDown'] || keys['s']) && this.y + this.height < this.game.canvas.height) {
            this.y += this.speed;
        }
    }

    handleShooting() {
        const bulletSpeed = 10;

        if (this.game.keys[' '] && this.shootCooldown <= 0) {
            // Fire bullets based on the number of bullet lines
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

            this.shootCooldown = 20; // Set cooldown in frames
        }

        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
    }

    handleCollisions(sprites) {
        for (const sprite of sprites) {
            if (sprite instanceof Enemy || sprite instanceof Asteroid || sprite instanceof BossBullet) {
                if (this.isColliding(sprite)) {
                    sprite.isActive = false; // Deactivate the colliding sprite
                    this.takeDamage(2); // Take damage
                }
            }
        }
    }

    update(sprites, keys) {
        this.handleMovement(keys);
        this.handleShooting();
        this.handleCollisions(sprites);

        // Decrease shield duration over time
        if (this.shieldActive) {
            this.shieldDurationFrames--;
            if (this.shieldDurationFrames <= 0) {
                this.shieldActive = false;
                console.log("Shield deactivated!");
            }
        }

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
            ctx.fillStyle = "red";
            ctx.fillRect(this.x - this.width / 2, this.y + this.height / 2 + 5, this.width, 5);
            ctx.fillStyle = "green";
            ctx.fillRect(
                this.x - this.width / 2,
                this.y + this.height / 2 + 5,
                (this.width * this.health) / this.maxHealth,
                5
            );

            // Draw shield indicator
            if (this.shieldActive) {
                ctx.strokeStyle = "blue";
                ctx.lineWidth = 3;
                ctx.strokeRect(
                    this.x - this.width / 2,
                    this.y - this.height / 2,
                    this.width,
                    this.height
                );
            }
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
