class Timer extends Sprite {
    constructor(x, y, duration, game) {
        super();
        this.x = x;
        this.y = y;
        this.duration = duration;
        this.framesPerSecond = 60;
        this.totalFrames = this.duration * this.framesPerSecond;
        this.remainingFrames = this.totalFrames;
        this.game = game;
    }


    update() {
        if (this.game.paused) return false;

        if (this.remainingFrames > 0) {
            this.remainingFrames--;
        }

        if (this.remainingFrames <= 0) {
            console.log("Timer ended!");
            return true;
        }

        return false;
    }

    draw(ctx) {
        const timeLeft = Math.ceil(this.remainingFrames / this.framesPerSecond);
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(this.x - 60, this.y - 20, 120, 30);
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(`Time: ${timeLeft}s`, this.x, this.y);
    }
}
