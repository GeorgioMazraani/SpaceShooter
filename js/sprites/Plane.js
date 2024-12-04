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
        this.bulletLines = 1;
        this.health = 10;
        this.maxHealth = 10;
        this.shieldActive = false;
        this.shieldDurationFrames = 0;
        this.jetImage = new Image();
        this.jetImage.src = '../assets/jet.png';

        this.applyUpgrades(bulletType, shieldPurchased);
    }


    applyUpgrades(bulletType, shieldPurchased) {
        if (bulletType === "Double Bullet") {
            this.bulletLines = 2;
            console.log("Upgraded to Double Bullet!");
        } else if (bulletType === "Triple Bullet") {
            this.bulletLines = 3;
            console.log("Upgraded to Triple Bullet!");
        }

        if (shieldPurchased) {
            this.activateShield();
        }
    }

    increaseBulletLines() {
        this.bulletLines = Math.min(this.bulletLines + 1, 3);
        console.log(`Bullet lines increased! Current: ${this.bulletLines}`);
    }

    restoreHealth(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
        console.log(`Health restored! Current health: ${this.health}`);
    }


    activateShield(durationInSeconds = 10) {
        this.shieldActive = true;
        this.shieldDurationFrames = durationInSeconds * 60;

        const shieldEffect = new Shield(this.x, this.y, this.width * 2, this.height * 2, this.game);
        this.game.sprites.push(shieldEffect);

        console.log(`Shield activated for ${durationInSeconds} seconds!`);
    }



    takeDamage(amount) {
        if (this.shieldActive) {
            console.log("Shield absorbed damage!");
            return;
        }

        this.health -= amount;
        console.log(`Plane took ${amount} damage. Current health: ${this.health}`);

        if (this.health <= 0) {
            this.health = 0;
            this.isActive = false;
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
            if (this.bulletLines === 1) {
                this.game.addSprite(new Bullet(this.x - 2.5, this.y - 10, 9, 10, bulletSpeed));
            } else if (this.bulletLines === 2) {
                this.game.addSprite(new Bullet(this.x - 10, this.y - 10, 9, 10, bulletSpeed));
                this.game.addSprite(new Bullet(this.x + 10, this.y - 10, 9, 10, bulletSpeed));
            } else if (this.bulletLines === 3) {
                this.game.addSprite(new Bullet(this.x - 15, this.y - 10, 5, 10, bulletSpeed));
                this.game.addSprite(new Bullet(this.x, this.y - 10, 5, 10, bulletSpeed));
                this.game.addSprite(new Bullet(this.x + 15, this.y - 10, 5, 10, bulletSpeed));
            }

            this.shootCooldown = 20;
        }

        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
    }

    handleCollisions(sprites) {
        for (const sprite of sprites) {
            if (sprite instanceof Enemy || sprite instanceof Asteroid || sprite instanceof BossBullet) {
                if (this.isColliding(sprite)) {
                    sprite.isActive = false;
                    this.takeDamage(2);
                }
            }
        }
    }

    update(sprites, keys) {
        this.handleMovement(keys);
        this.handleShooting();
        this.handleCollisions(sprites);
        if (this.shieldActive) {
            this.shieldDurationFrames--;
            if (this.shieldDurationFrames <= 0) {
                this.shieldActive = false;
                console.log("Shield deactivated!");
            }
        }

        return !this.isActive;
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

            ctx.fillStyle = "red";
            ctx.fillRect(this.x - this.width / 2, this.y + this.height / 2 + 5, this.width, 5);
            ctx.fillStyle = "green";
            ctx.fillRect(
                this.x - this.width / 2,
                this.y + this.height / 2 + 5,
                (this.width * this.health) / this.maxHealth,
                5
            );


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
