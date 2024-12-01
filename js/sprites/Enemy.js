class Enemy extends Sprite {
    constructor(x, y, width, height, speed, level) {
        super();
        this.x = x;
        this.y = y;
        this.width = Math.random() * 20 + 30;
        this.height = this.width;
        this.speed = speed;
        this.color = 'red';
        this.level = level; // Store the current level
        this.explosionSound = new Audio('../assets/Sounds/explosion.wav');
        this.enemyImg = new Image();
        this.enemyImg.src = '../assets/enemy.png';
    }

    update(sprites) {
        this.y += this.speed;

        if (this.y > 600) {
            return true; // Remove the enemy if it goes off-screen
        }

        const plane = sprites.find(sprite => sprite instanceof Plane);
        if (plane && plane.isActive && this.isColliding(plane)) {
            plane.isActive = false;
            return true; // Remove the enemy
        }

        for (let sprite of sprites) {
            if (sprite instanceof Bullet && this.isColliding(sprite)) {
                sprite.isActive = false;

                // Play the explosion sound
                this.explosionSound.play().catch(err => console.error('Audio error:', err));

                // Create explosion
                const explosion = new Explosion(this.x, this.y, this.width, this.height);
                sprites.push(explosion);

                // Update score
                const scoreSprite = sprites.find(s => s instanceof Score);
                if (scoreSprite) scoreSprite.addScore(1);

                // Drop money only in Level 1 with a 30% chance
                if (this.level === 1 && Math.random() < 0.3) { // 30% chance
                    const money = new Money(this.x, this.y);
                    sprites.push(money);
                    console.log("Money dropped!");
                }

                // Randomly drop power-ups
                if (Math.random() < 0.2) { // 20% chance for power-ups
                    sprites.push(new PowerUp(this.x + this.width / 2 - 10, this.y + this.height, 'double-bullet'));
                }

                return true; // Mark the enemy as destroyed
            }
        }

        return false; // Keep the enemy active
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
