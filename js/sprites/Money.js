class Money extends Sprite {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.image = new Image();
        this.image.src = '../assets/cash.png';
    }

    update(sprites) {
        this.y += 1;

        if (this.y > 600) {
            return true;
        }
        console.log("Sprites array:", sprites.map(sprite => sprite.constructor.name));

        const plane = sprites.find(sprite => sprite instanceof Plane);
        if (plane && plane.isActive && this.isColliding(plane)) {
            const moneyTracker = sprites.find(sprite => sprite instanceof MoneyTracker);
            console.log(moneyTracker)
            if (moneyTracker) {
                moneyTracker.addMoney(10);
                console.log('Money collected!');
            }

            return true;
        }

        return false;
    }

    draw(ctx) {
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        } else {
            ctx.fillStyle = 'gold';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
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
