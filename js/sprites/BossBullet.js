class BossBullet extends Sprite {
    constructor(x, y, width, height, speed) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = 'purple';
    }

    update(sprites) {
        this.y += this.speed;
        if (this.y > 600) {
            return true;
        }

        const plane = sprites.find(sprite => sprite instanceof Plane);
        if (plane && plane.isActive && this.isColliding(plane)) {
            plane.takeDamage(2); // Reduce health by 2
            return true; // Remove the enemy
        }

        return false;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
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