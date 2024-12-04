class Menu extends Sprite {
    constructor(canvas, ctx, game) {
        super();
        this.canvas = canvas;
        this.ctx = ctx;
        this.game = game;
        this.showing = true;
        this.backgroundImage = new Image();
        this.backgroundImage.src = '../assets/bgmenu.jpg';
        this.onMenuExit = null;
        this.currentState = 'main';
        this.click = new Audio('../assets/Sounds/click.mp3');
    }

    draw() {
        if (!this.showing) return;

        if (this.backgroundImage.complete) {
            this.ctx.drawImage(
                this.backgroundImage,
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );
        } else {
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        switch (this.currentState) {
            case 'main':
                this.drawMainMenu();
                break;
            case 'instructions':
                this.drawInstructions();
                break;
            case 'story':
                this.drawStory();
                break;
        }
    }

    drawMainMenu() {
        this.ctx.fillStyle = 'rgba(0, 255, 128, 1)';
        this.ctx.font = '80px "Creepster", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = 'rgba(0, 255, 128, 0.8)';
        this.ctx.shadowBlur = 30;
        this.ctx.fillText('ALIEN INVASION!', this.canvas.width / 2, 100);
        this.ctx.shadowBlur = 0;

        this.ctx.font = '30px "Creepster", sans-serif';
        this.ctx.fillStyle = 'rgba(0, 191, 255, 1)';
        this.ctx.shadowColor = 'rgba(0, 191, 255, 0.8)';
        this.ctx.shadowBlur = 20;
        this.ctx.fillText('Press "I" for Instructions', this.canvas.width / 2, 300);
        this.ctx.fillText('Press "S" for Story', this.canvas.width / 2, 350);
        this.ctx.fillText('Press "Enter" to Start', this.canvas.width / 2, 400);
        this.ctx.shadowBlur = 0;
    }

    drawInstructions() {
        this.ctx.font = '28px "Creepster", sans-serif';
        this.ctx.fillStyle = 'rgba(0, 255, 128, 1)';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = 'rgba(0, 255, 128, 0.8)';
        this.ctx.shadowBlur = 20;

        const instructions = [
            'INSTRUCTIONS:',
            '- Use Arrow Keys to Move',
            '- Press Spacebar to Shoot',
            '- Press "P" to Pause the Game',
            '- Press "C" to Continue the Game',
            '- Press "Enter" to Start the Game',
            '',
            'Press "B" to go back to the Main Menu',
        ];
        instructions.forEach((line, index) => {
            this.ctx.fillText(line, this.canvas.width / 2, 150 + index * 40);
        });
        this.ctx.shadowBlur = 0;
    }

    drawStory() {
        this.ctx.font = '28px "Creepster", sans-serif';
        this.ctx.fillStyle = 'rgba(0, 255, 128, 1)';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = 'rgba(0, 255, 128, 0.8)';
        this.ctx.shadowBlur = 20;

        const story = [
            'STORY:',
            "The year is 2523. Earth stands on the brink of annihilation.",
            "Alien creatures have invaded, spreading terror and destruction.",
            "Level 1: Your mission is to collect money and prepare for battle.",
            "Level 2: Upgrade your weapons and face the Final Boss.",
            "Defeat the Final Boss, and the aliens will retreat.",
            "Save humanity and restore peace to Earth!",
            '',
            'Press "B" to go back to the Main Menu',
        ];
        story.forEach((line, index) => {
            this.ctx.fillText(line, this.canvas.width / 2, 150 + index * 40);
        });
        this.ctx.shadowBlur = 0;
    }

    update(sprites, keys) {
        if (!this.showing) return true;

        if (keys['Enter'] && this.currentState === 'main') {
            this.showing = false;
            if (this.onMenuExit) {
                this.onMenuExit();
            }
            return true;
        }

        if (keys['i'] && this.currentState === 'main') {
            this.click.play().catch(err => console.error("Audio error:", err));
            this.currentState = 'instructions';
        } else if (keys['s'] && this.currentState === 'main') {
            this.click.play().catch(err => console.error("Audio error:", err));
            this.currentState = 'story';
        } else if (keys['b'] && (this.currentState === 'instructions' || this.currentState === 'story')) {
            this.click.play().catch(err => console.error("Audio error:", err));
            this.currentState = 'main';
        }

        return false;
    }
}
