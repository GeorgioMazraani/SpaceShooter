class lv2Menu extends Sprite {
    constructor(game, money) {
        super();
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
        this.options = [];
        for (let i = 0; i < this.bulletTypes.length; i++) {
            this.options.push(this.bulletTypes[i]);
        }
        this.options.push({ type: "Shield", cost: this.shieldCost });
        this.errorMessage = "";
        this.errorDisplayFrames = 0;
        this.isActive = true;
        this.purchaseSound = new Audio('../assets/Sounds/purchase.mp3');
        this.error = new Audio('../assets/Sounds/error.mp3');
    }

    handleInput(key) {
        if (!this.isActive) return;

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
            case "x":
                this.exitMenu();
                break;
        }
    }

    purchaseOption(index) {
        const selectedOption = this.options[index];

        if (selectedOption.type === "Shield") {
            if (this.money >= selectedOption.cost) {
                this.shieldPurchased = true;
                this.money -= selectedOption.cost;
                selectedOption.cost = 0;

                // Play purchase sound
                this.purchaseSound.play().catch(err => console.error("Audio error:", err));
            } else {
                this.errorMessage = "Not enough money!";
                this.error.play().catch(err => console.error("Audio error:", err));
                this.errorDisplayFrames = 180;

            }
            return;
        }

        if (selectedOption.cost === 0) {
            this.selectedBullet = selectedOption.type;
            return;
        }

        if (this.money >= selectedOption.cost) {
            this.selectedBullet = selectedOption.type;
            this.money -= selectedOption.cost;
            selectedOption.cost = 0;

            // Play purchase sound
            this.purchaseSound.play().catch(err => console.error("Audio error:", err));
        } else {
            this.errorMessage = "Not enough money!";
            this.error.play().catch(err => console.error("Audio error:", err));
            this.errorDisplayFrames = 180;
        }
    }

    exitMenu() {
        this.isActive = false;
        if (this.onMenuExit) {
            this.onMenuExit();
        }
    }

    update(sprites, keys) {
        if (!this.isActive) return true;

        for (let key in keys) {
            if (keys[key]) {
                this.handleInput(key);
                keys[key] = false;
            }
        }

        if (this.errorDisplayFrames > 0) {
            this.errorDisplayFrames--;
        }

        return false;
    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Choose Your Upgrades for Level 2", this.game.canvas.width / 2, 100);

        this.options.forEach((option, index) => {
            const y = 150 + index * 50;
            ctx.fillStyle = index === this.selectedIndex ? "yellow" : "white";
            ctx.fillText(`${option.type} (Cost: ${option.cost})`, this.game.canvas.width / 2, y);
        });

        ctx.fillStyle = "white";
        ctx.fillText(`Money: $${this.money}`, this.game.canvas.width / 2, 350);

        ctx.fillText(`Selected Bullet: ${this.selectedBullet}`, this.game.canvas.width / 2, 400);
        if (this.shieldPurchased) {
            ctx.fillText(`Shield Purchased`, this.game.canvas.width / 2, 450);
        }

        if (this.errorDisplayFrames > 0) {
            ctx.fillStyle = "red";
            ctx.font = "20px Arial";
            ctx.fillText(this.errorMessage, this.game.canvas.width / 2, 550);
        }

        ctx.fillStyle = "yellow";
        ctx.font = "20px Arial";
        ctx.fillText("Press X to start Level 2", this.game.canvas.width / 2, 600);
    }
}
