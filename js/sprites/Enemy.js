class Enemy extends Sprite {
    constructor(x, y, width, height, speed, level) {
        super();
        this.x = x;
        this.y = y;
        this.width = Math.random() * 20 + 30;
        this.height = this.width;
        this.speed = speed;
        this.color = 'red';
        this.level = level;
        this.explosionSound = new Audio('../assets/Sounds/explosion.wav');
        this.enemyImg = new Image();
        this.enemyImg.src = '../assets/enemy.png';
    }

    update(sprites) {
        this.y += this.speed;

        // Remove enemy if it moves out of bounds
        if (this.y > 600) {
            return true;
        }

        // Check collision with the player's plane
        const plane = sprites.find(sprite => sprite instanceof Plane);
        if (plane && plane.isActive && this.isColliding(plane)) {
            plane.takeDamage(2);
            return true;
        }

        // Check collision with bullets
        for (let sprite of sprites) {
            if (sprite instanceof Bullet && this.isColliding(sprite)) {
                sprite.isActive = false;

                // Play explosion sound
                this.explosionSound.play().catch(err => console.error('Audio error:', err));

                // Create explosion effect
                const explosion = new Explosion(this.x, this.y, this.width, this.height);
                sprites.push(explosion);

                // Add score
                const scoreSprite = sprites.find(s => s instanceof Score);
                if (scoreSprite) scoreSprite.addScore(1);

                // Drop money with a 20% chance
                if (this.level === 1 && Math.random() < 0.25) {
                    const money = new Money(this.x, this.y);
                    sprites.push(money);
                    console.log("Money dropped!");
                }

                // Drop power-up if conditions are met
                if (this.level === 1 && Math.random() < 0.2) {
                    console.log(plane.bulletLines)
                    if (plane.bulletLines !== 3) {
                        sprites.push(new PowerUp(this.x + this.width / 2 - 10, this.y + this.height, 'double-bullet'));
                        console.log("Triple bullet power-up dropped!");
                    }
                }

                return true;
            }
        }

        return false;
    }


    draw(ctx) {
        ctx.drawImage(
            this.enemyImg,
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
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
