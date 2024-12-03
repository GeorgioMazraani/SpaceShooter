class MoneyTracker extends Sprite {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.money = 0;
    }

    addMoney(amount) {
        this.money += amount;
    }

    update() {
        return false;
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Money: ${this.money}`, this.x, this.y);
    }
}
