class Money extends Sprite {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 60; // Adjust size as needed
        this.height = 60;
        this.image = new Image();
        this.image.src = '../assets/cash.png'; // Path to your money image
    }

    update(sprites) {
        this.y += 1; // Money falls slightly

        if (this.y > 600) {
            return true; // Remove money if it goes off-screen
        }
        console.log("Sprites array:", sprites.map(sprite => sprite.constructor.name)); // Debug log

        // Check if the player collects the money
        const plane = sprites.find(sprite => sprite instanceof Plane);
        if (plane && plane.isActive && this.isColliding(plane)) {
            // Find the MoneyTracker and update it
            const moneyTracker = sprites.find(sprite => sprite instanceof MoneyTracker);
            console.log(moneyTracker)
            if (moneyTracker) {
                moneyTracker.addMoney(10); // Add 10 units of money
                console.log('Money collected!');
            }

            return true; // Remove money from the game
        }

        return false; // Keep money active
    }

    draw(ctx) {
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        } else {
            ctx.fillStyle = 'gold'; // Fallback color
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
