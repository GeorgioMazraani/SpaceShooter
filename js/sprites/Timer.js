class Timer extends Sprite {
    constructor(x, y, duration, game) {
        super();
        this.x = x; // X position for the timer display
        this.y = y; // Y position for the timer display
        this.duration = duration; // Duration of the timer in seconds
        this.framesPerSecond = 60; // Game runs at 60 FPS
        this.totalFrames = this.duration * this.framesPerSecond; // Total frames for the timer
        this.remainingFrames = this.totalFrames; // Countdown starts at total frames
        this.game = game; // Reference to the main game instance
    }

    /**
     * Updates the timer each frame
     */
    update() {
        if (this.game.paused) return false; // Do not count down if the game is paused

        // Only decrement once every frame
        if (this.remainingFrames > 0) {
            this.remainingFrames--; // Decrease remaining frames
        }

        if (this.remainingFrames <= 0) {
            console.log("Timer ended!");
            return true; // Signal that the timer has finished
        }

        return false; // Timer still running
    }

    /**
     * Draws the timer on the canvas
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        const timeLeft = Math.ceil(this.remainingFrames / this.framesPerSecond); // Convert frames to seconds

        // Background for timer
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(this.x - 60, this.y - 20, 120, 30);

        // Timer text
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(`Time: ${timeLeft}s`, this.x, this.y);
    }
}
