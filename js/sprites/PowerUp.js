class PowerUp extends Sprite {
    constructor(x, y, type) {
        super();
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type;
        this.speed = 2;
        this.image = new Image();

        switch (type) {
            case 'double-bullet':
                this.image.src = '../assets/bullets.png';
                break;
            case 'shield':
                this.image.src = '../assets/shield.png';
                break;
            case 'extra-life':
                this.image.src = '../assets/heart.png';
                break;
        }
    }

    update(sprites) {
        this.y += this.speed;
        if (this.y > 650) {
            return true;
        }

        const plane = sprites.find(sprite => sprite instanceof Plane);
        if (plane && this.isColliding(plane)) {
            switch (this.type) {
                case 'double-bullet':
                    plane.increaseBulletLines();
                    console.log('Double bullet activated!');
                    break;
                case 'shield':
                    plane.activateShield();
                    console.log('Shield activated!');
                    break;
                case 'extra-life':
                    plane.restoreHealth(2);
                    console.log('Health restored!');
                    break;
                default:
                    console.warn(`Unhandled power-up type: ${this.type}`);
            }
            return true;
        }

        return false;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
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
