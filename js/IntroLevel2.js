class lv2Menu {
    constructor(game, money) {
        this.game = game;
        this.money = money;
        this.bulletTypes = [
            { type: "Default", cost: 0 },
            { type: "Double Bullet", cost: 50 },
            { type: "Triple Bullet", cost: 100 }
        ];
        this.selectedIndex = 0;
        this.selectedBullet = "Default";
        this.shieldCost = 25;
        this.shieldPurchased = false;
        this.canvas = game.canvas;
        this.ctx = game.ctx;
        this.options = [];
        for (let i = 0; i < this.bulletTypes.length; i++) {
            this.options.push(this.bulletTypes[i]);
        }
        this.options.push({ type: "Shield", cost: this.shieldCost });
    }

    handleInput(key) {
        switch (key) {
            case "ArrowUp":
                this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
                break;
            case "ArrowDown":
                this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
                break;
            case "Enter":
                this.purchaseOption(this.selectedIndex);
                break;
            default:
                break;
        }
    }

    purchaseOption(index) {
        const selectedOption = this.options[index];
        if (selectedOption.cost === 0) {
            console.log(`${selectedOption.type} is already purchased!`);
            return;
        }

        if (this.money >= selectedOption.cost) {
            if (selectedOption.type === "Shield") {
                this.purchaseShield();
            } else {
                this.selectBullet(selectedOption);
            }
            selectedOption.cost = 0;
        } else {
            console.log("Not enough money!");
        }
    }


    selectBullet(bullet) {
        this.selectedBullet = bullet.type;
        this.money -= bullet.cost;
        console.log(`Selected ${bullet.type}. Remaining Money: ${this.money}`);
    }

    purchaseShield() {
        this.shieldPurchased = true;
        this.money -= this.shieldCost;
        console.log("Shield purchased!");
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Choose Your Upgrades for Level 2", this.canvas.width / 2, 100);

        this.options.forEach((option, index) => {
            const y = 150 + index * 50;
            this.ctx.fillStyle = index === this.selectedIndex ? "yellow" : "white";
            this.ctx.fillText(`${option.type} (Cost: ${option.cost})`, this.canvas.width / 2, y);
        });

        this.ctx.fillStyle = "white";
        this.ctx.fillText(`Money: $${this.money}`, this.canvas.width / 2, 350);

        this.ctx.fillText(`Selected Bullet: ${this.selectedBullet}`, this.canvas.width / 2, 400);
        if (this.shieldPurchased) {
            this.ctx.fillText(`Shield Purchased`, this.canvas.width / 2, 450);
        }
    }
}
