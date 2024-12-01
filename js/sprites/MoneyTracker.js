class MoneyTracker extends Sprite {
    constructor(x, y) {
        super();
        this.x = x; // Position on the canvas
        this.y = y;
        this.money = 0; // Initial money amount
    }

    addMoney(amount) {
        this.money += amount; // Increment money
    }

    update() {
        return false; // No need to remove this sprite
    }

    draw(ctx) {
        ctx.fillStyle = 'white'; // Gold color for money text
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Money: ${this.money}`, this.x, this.y);
    }
}
