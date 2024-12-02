class FinalBoss extends Sprite {
    constructor(game, x, y, width, height, health) {
        super();
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.health = health;
        this.maxHealth = health;
        this.speed = 2; // Movement speed
        this.movementOffset = 50; // Mimic player movement offset
        this.bossImage = new Image();
        this.bossImage.src = '../assets/finalBoss.png';
        // Load and play the boss sound
        this.bossSound = new Audio('../assets/Sounds/finalBoss.mp3');
        this.bossSound.volume = 0.8; // Adjust volume
        this.bossSound.play().catch((err) => console.error('Audio playback error:', err));
    }

    update() {
        const player = this.game.sprites.find(sprite => sprite instanceof Plane);
        if (player) {
            // Mimic player's horizontal movement with some delay
            if (Math.abs(this.x - player.x) > this.movementOffset) {
                this.x += this.speed * Math.sign(player.x - this.x);
            }
        }

        // Final boss is defeated when health is 0
        if (this.health <= 0) {
            console.log("Final Boss defeated!");
            this.game.sprites = this.game.sprites.filter(sprite => sprite !== this); // Remove boss
        }

        return false;
    }

    draw(ctx) {
        ctx.drawImage(
            this.bossImage,
            this.x,
            this.y,
            this.width,
            this.height
        );

        ctx.fillStyle = "green";
        const healthBarWidth = (this.health / this.maxHealth) * this.width;
        ctx.fillRect(this.x, this.y - 10, healthBarWidth, 5);

        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y - 10, this.width, 5);
    }
}
