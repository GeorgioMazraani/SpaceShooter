class lv2Menu {
    constructor(game, money) {
        this.game = game;
        this.money = money; // Player's collected money
        this.bulletTypes = [
            { type: "Default", cost: 0 },
            { type: "Double Bullet", cost: 50 },
            { type: "Triple Bullet", cost: 100 }
        ];
        this.selectedIndex = 0; // Index of currently selected option
        this.selectedBullet = "Default"; // Default selection
        this.shieldCost = 25; // Cost of the shield
        this.shieldPurchased = false; // Whether the shield is purchased
        this.canvas = game.canvas;
        this.ctx = game.ctx;
        this.options = [];
        for (let i = 0; i < this.bulletTypes.length; i++) {
            this.options.push(this.bulletTypes[i]);
        }
        this.options.push({ type: "Shield", cost: this.shieldCost }); // Add shield option manually
    }

    /**
     * Handle keyboard input for navigation and selection
     */
    handleInput(key) {
        switch (key) {
            case "ArrowUp":
                this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length; // Navigate up
                break;
            case "ArrowDown":
                this.selectedIndex = (this.selectedIndex + 1) % this.options.length; // Navigate down
                break;
            case "Enter":
                this.purchaseOption(this.selectedIndex); // Purchase the selected option
                break;
            default:
                break;
        }
    }

    /**
     * Purchase the selected option if the player has enough money
     * @param {number} index - The index of the selected option
     */
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
            selectedOption.cost = 0; // Set the cost to 0 after purchase
        } else {
            console.log("Not enough money!");
        }
    }

    /**
     * Select a bullet type and deduct its cost
     */
    selectBullet(bullet) {
        this.selectedBullet = bullet.type;
        this.money -= bullet.cost;
        console.log(`Selected ${bullet.type}. Remaining Money: ${this.money}`);
    }

    /**
     * Purchase the shield and deduct its cost
     */
    purchaseShield() {
        this.shieldPurchased = true;
        this.money -= this.shieldCost;
        console.log("Shield purchased!");
    }

    /**
     * Draw the menu on the canvas
     */
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Title
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Choose Your Upgrades for Level 2", this.canvas.width / 2, 100);

        // Display options with selection indicator
        this.options.forEach((option, index) => {
            const y = 150 + index * 50;
            this.ctx.fillStyle = index === this.selectedIndex ? "yellow" : "white"; // Highlight selected option
            this.ctx.fillText(`${option.type} (Cost: ${option.cost})`, this.canvas.width / 2, y);
        });

        // Display remaining money
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`Money: $${this.money}`, this.canvas.width / 2, 350);

        // Display selected upgrades
        this.ctx.fillText(`Selected Bullet: ${this.selectedBullet}`, this.canvas.width / 2, 400);
        if (this.shieldPurchased) {
            this.ctx.fillText(`Shield Purchased`, this.canvas.width / 2, 450);
        }
    }
}
