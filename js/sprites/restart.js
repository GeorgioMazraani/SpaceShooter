class GameOver extends Sprite {
    constructor(game, levelManager, backgroundMusic) {
        super();
        this.game = game;
        this.levelManager = levelManager;
        this.backgroundMusic = backgroundMusic;

        // Fade-in effect
        this.opacity = 0;
        this.restartTriggered = false;

        // Play game-over sound
        this.gameOverSound = new Audio('../assets/Sounds/gameover.wav');
        this.gameOverSound.play().catch(err => console.error('Audio error:', err));
    }

    update(sprites, keys) {
        // Gradually increase opacity for fade-in effect
        if (this.opacity < 1) {
            this.opacity += 0.02;
        }

        // Restart the game when "R" is pressed
        if (keys['r'] && !this.restartTriggered) {
            this.restartTriggered = true; // Prevent multiple restarts
            this.restartGame(sprites);
            return true; // Remove GameOver sprite
        }

        return false; // Keep GameOver sprite active
    }

    draw(ctx) {
        // Draw semi-transparent background
        ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

        // Display "Game Over" message
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', this.game.canvas.width / 2, this.game.canvas.height / 2 - 50);
        ctx.font = '30px Arial';
        ctx.fillText('Press R to Restart', this.game.canvas.width / 2, this.game.canvas.height / 2 + 50);
    }

    restartGame(sprites) {
        // Stop music
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;

        // Clear all sprites
        sprites.length = 0;

        // Reinitialize game components
        const background = new Background('../assets/bg.png', 1, this.game.canvas);
        this.game.addSprite(background);

        const plane = new Plane(200, 500, 2, this.game);
        this.game.addSprite(plane);

        const score = new Score(0, 0);
        this.game.addSprite(score);

        // Restart the first level
        this.levelManager.startLevel(1);

        // Restart music
        this.backgroundMusic.play();
    }
}
