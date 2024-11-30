class Enemy extends Sprite {
    constructor(x, y, width, height, speed) {
        super();
        this.x = x;
        this.y = y;
        this.width = Math.random() * 20 + 30;
        this.height = this.width;
        this.speed = speed;
        this.color = 'red';
        this.explosionSound = new Audio('../assets/Sounds/explosion.wav');
        this.enemyImg = new Image();
        this.enemyImg.src = '../assets/enemy.png';
    }

    update(sprites) {
        this.y += this.speed;

        if (this.y > 600) {
            return true;
        }

        const plane = sprites.find(sprite => sprite instanceof Plane);
        if (plane && plane.isActive && this.isColliding(plane)) {
            plane.isActive = false;
            return true;
        }

        for (let sprite of sprites) {
            if (sprite instanceof Bullet && this.isColliding(sprite)) {
                sprite.isActive = false;

                // Play the explosion sound when enemy is hit
                this.explosionSound.play().catch(err => console.error('Audio error:', err));

                // Create an explosion at the enemy's position
                const explosion = new Explosion(this.x,  // Use the enemy's X position
                    this.y,  // Use the enemy's Y position
                    this.width,     // Width of each explosion frame
                    this.height);
                sprites.push(explosion);

                // Update score
                const scoreSprite = sprites.find(s => s instanceof Score);
                if (scoreSprite) scoreSprite.addScore(1);

                // Randomly drop power-ups
                if (Math.random() < 0.2) {
                    sprites.push(new PowerUp(this.x + this.width / 2 - 10, this.y + this.height, 'double-bullet'));
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
        if (!sprite) return false;
        return (
            this.x < sprite.x + sprite.width &&
            this.x + this.width > sprite.x &&
            this.y < sprite.y + sprite.height &&
            this.y + this.height > sprite.y
        );
    }
}
