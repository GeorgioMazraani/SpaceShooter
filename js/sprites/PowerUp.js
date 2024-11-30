class PowerUp extends Sprite {
    constructor(x, y, type) {
        super();
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type;
        this.color = 'green';
        this.speed = 2;
        this.image = new Image();
        switch (type) {
            case 'double-bullet':
                this.image.src = '../assets/bullets.png';
                break;
            // case 'health':
            //     this.image.src = '../assets/';
            //     break;
            //to be implemented
        }
    }

    update(sprites) {
        this.y += this.speed;
        if (this.y > 550) {
            return true;
        }

        const plane = sprites.find(sprite => sprite instanceof Plane);
        if (plane && this.isColliding(plane)) {
            plane.increaseBulletLines();
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
