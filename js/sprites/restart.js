class GameOver extends Sprite {
    constructor(game) {
        super();
        this.game = game;
        this.opacity = 0;  // Start with no transparency
        this.gameOverSound = new Audio('../assets/Sounds/gameover.wav');
        this.gameOverSound.play(); // Play game over sound
    }

    update() {
        // Fade out the background by increasing opacity
        if (this.opacity < 1) {
            this.opacity += 0.02; // Increase the opacity slowly to fade in
        }

        // Stop the game by pausing the game logic
        this.game.paused = true;

        // When the user clicks to restart
        if (this.game.keys['r']) {
            this.game.restartGame(); // Restart the game
            return true;
        }

        return false;
    }

    draw(ctx) {
        // Draw a transparent background for fade effect
        ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

        // Display game over text
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', this.game.canvas.width / 2, this.game.canvas.height / 2 - 50);
        ctx.font = '30px Arial';
        ctx.fillText('We lost our humanity', this.game.canvas.width / 2, this.game.canvas.height / 2 + 20);
        ctx.fillText('Press R to Restart', this.game.canvas.width / 2, this.game.canvas.height / 2 + 80);
    }
}
