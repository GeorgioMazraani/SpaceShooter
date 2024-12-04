class GameOver extends Sprite {
    constructor(game, levelManager, backgroundMusic, isVictory = false) {
        super();
        this.game = game;
        this.levelManager = levelManager;
        this.backgroundMusic = backgroundMusic;
        this.isVictory = isVictory;

        this.opacity = 0;
        this.restartTriggered = false;
    }

    update(sprites, keys) {
        if (this.opacity < 1) {
            this.opacity += 0.02; // Gradually increase opacity
        }

        // Handle restart on "R" key press
        if (keys['r'] && !this.restartTriggered) {
            this.restartTriggered = true;
            this.triggerRestart();
            return true; // Remove GameOver sprite
        }

        return false;
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';

        if (this.isVictory) {
            ctx.fillText('VICTORY!', this.game.canvas.width / 2, this.game.canvas.height / 2 - 100);
            ctx.font = '25px Arial';
            ctx.fillText(
                'You saved humanity! The galaxy is safe.',
                this.game.canvas.width / 2,
                this.game.canvas.height / 2
            );
            ctx.fillText(
                'Press R to Restart.',
                this.game.canvas.width / 2,
                this.game.canvas.height / 2 + 100
            );
        } else {
            ctx.fillText('GAME OVER', this.game.canvas.width / 2, this.game.canvas.height / 2 - 100);
            ctx.font = '25px Arial';
            ctx.fillText(
                'You lost. Humanity has fallen.',
                this.game.canvas.width / 2,
                this.game.canvas.height / 2
            );
            ctx.fillText(
                'Press R to try again.',
                this.game.canvas.width / 2,
                this.game.canvas.height / 2 + 100
            );
        }
    }

    triggerRestart() {
        console.log('Restarting the game...');

        // Pause and reset background music
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }

        // Use the restart flag to reinitialize the game
        this.game.restart = true;

    }
}
