class Asteroid extends Sprite {
    constructor(x, y, game) {
        super();
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.game = game;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 5;
        this.numberOfFrames = 42;
        this.rows = 7;
        this.columns = 6;
        this.frameWidth = 128;
        this.frameHeight = 128;
        this.asteroidImg = new Image();
        this.asteroidImg.src = "../assets/asteroid.png";

        this.speed = 0.5;
        this.maxSpeed = 2;
    }

    update() {
        this.y += this.speed;
        if (this.speed < this.maxSpeed) {
            this.speed += 0.05;
        }

        if (this.y > this.game.canvas.height) {
            return true;
        }

        const plane = this.game.sprites.find(sprite => sprite instanceof Plane);
        if (plane && plane.isActive && this.isColliding(plane)) {
            plane.takeDamage(2);
            return true;
        }

        for (let sprite of this.game.sprites) {
            if (sprite instanceof Bullet && this.isColliding(sprite)) {
                sprite.isActive = false;

                const explosion = new AsteroidExplosion(this.x, this.y, this.width, this.height);
                this.game.sprites.push(explosion);

                const explosionSound = new Audio('../assets/Sounds/explodeAsteroid.mp3');
                explosionSound.play().catch(err => console.error('Audio error:', err));

                this.dropPowerUp();

                return true;
            }
        }

        this.updateAnimation();

        return false;
    }

    draw(ctx) {
        const row = Math.floor(this.frameIndex / this.columns);
        const col = this.frameIndex % this.columns;

        ctx.drawImage(
            this.asteroidImg,
            col * this.frameWidth,
            row * this.frameHeight,
            this.frameWidth,
            this.frameHeight,
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    }

    dropPowerUp() {
        const chance = Math.random();
        if (chance < 0.3) {
            const shield = new PowerUp(this.x, this.y, 'shield');
            this.game.addSprite(shield);
            console.log("Shield dropped!");
        } else if (chance < 0.5) {
            const extraLife = new PowerUp(this.x, this.y, 'extra-life');
            this.game.addSprite(extraLife);
            console.log("Extra life dropped!");
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

    updateAnimation() {
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex++;
            if (this.frameIndex >= this.numberOfFrames) {
                this.frameIndex = 0;
            }
        }
    }
}
