class BossAlien extends Sprite {
    constructor(x, y, width, height, speed, game) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.game = game;
        this.health = 1;
        this.shootCooldown = 100;
        this.bossImage = new Image();
        this.explosionSound = new Audio('../assets/Sounds/explosion.wav');
        this.bossImage.src = '../assets/bossAlien.png';
    }

    update(sprites) {
        this.y += this.speed;

        if (this.y > this.game.canvas.height) {
            return true;
        }

        if (this.shootCooldown <= 0) {
            this.game.addSprite(new BossBullet(this.x + this.width / 2 - 5, this.y + this.height, 10, 20, 4));
            this.shootCooldown = 100;
        } else {
            this.shootCooldown--;
        }

        for (let sprite of sprites) {
            if (sprite instanceof Bullet && this.isColliding(sprite)) {
                this.explosionSound.play().catch(err => console.error('Audio error:', err));
                sprite.isActive = false;
                this.health -= 1;
                if (this.health <= 0) {
                    sprites.push(
                        new Explosion(
                            [
                                '../assets/Explosion/explosion00_s.png',
                                '../assets/Explosion/explosion01_s.png',
                                '../assets/Explosion/explosion02_s.png',
                                '../assets/Explosion/explosion03_s.png',
                                '../assets/Explosion/explosion04_s.png',
                                '../assets/Explosion/explosion05_s.png'
                            ],
                            this.x - 30,
                            this.y - 30,
                            120,
                            120,
                            90
                        )
                    );
                    return true;
                }
            }
        }

        return false;
    }

    draw(ctx) {
        ctx.drawImage(
            this.bossImage,
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