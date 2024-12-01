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

        // Set power-up image and additional properties based on type
        switch (type) {
            case 'double-bullet':
                this.image.src = '../assets/bullets.png';
                break;
            case 'shield':
                this.image.src = '../assets/shield.png';
                break;
            case 'speed-boost':
                this.image.src = '../assets/speed.png';
                break;
            case 'extra-life':
                this.image.src = '../assets/heart.png';
                break;
        }
    }

    update(sprites) {
        this.y += this.speed;

        // Remove power-up if it goes off-screen
        if (this.y > 550) {
            return true;
        }

        // Check collision with the plane
        const plane = sprites.find(sprite => sprite instanceof Plane);
        if (plane && this.isColliding(plane)) {
            // Apply power-up effect based on type
            switch (this.type) {
                case 'double-bullet':
                    plane.increaseBulletLines(); // Enable double bullets
                    console.log('Double bullet activated!');
                    break;
                case 'shield':
                    plane.hasShield = true; // Grant a shield
                    console.log('Shield activated!');
                    break;
                case 'speed-boost':
                    plane.speedBoostDuration = 300; // Temporary speed boost (5 seconds at 60 FPS)
                    console.log('Speed boost collected!');
                    break;
                case 'extra-life':
                    plane.lives = (plane.lives || 1) + 1; // Add an extra life
                    console.log('Extra life gained!');
                    break;
                default:
                    console.warn(`Unhandled power-up type: ${this.type}`);
            }
            return true; // Remove power-up after collection
        }

        return false;
    }

    draw(ctx) {
        // Draw the power-up image
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    isColliding(sprite) {
        // Check for collision with the plane
        return (
            this.x < sprite.x + sprite.width &&
            this.x + this.width > sprite.x &&
            this.y < sprite.y + sprite.height &&
            this.y + this.height > sprite.y
        );
    }
}
