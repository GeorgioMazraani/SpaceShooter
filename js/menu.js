class Menu {
    constructor(canvas, ctx, game) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.game = game; // Reference to the game instance
        this.showing = true; // Boolean to determine if the menu is active
        this.bindEvents();

        // Add a background image
        this.backgroundImage = new Image();
        this.backgroundImage.src = '../assets/bgmenu.jpg'; // Replace with your updated image path

    }

    draw() {
        if (!this.showing) return;

        // Draw background
        if (this.backgroundImage.complete) {
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); // Fallback color
        }

        // Title
        this.ctx.fillStyle = 'red'; // Bright red
        this.ctx.font = '70px "Creepster", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = 'black';
        this.ctx.shadowBlur = 10;
        this.ctx.fillText('ALIEN INVASION!', this.canvas.width / 2, 120);
        this.ctx.shadowBlur = 0; // Reset shadow

        // Story text
        this.ctx.font = '24px "Creepster", sans-serif';
        const storyGradient = this.ctx.createLinearGradient(
            this.canvas.width / 2 - 200,
            0,
            this.canvas.width / 2 + 200,
            0
        );
        storyGradient.addColorStop(0, 'white'); // White base
        storyGradient.addColorStop(1, 'lightgray'); // Light gray at the end
        this.ctx.fillStyle = storyGradient;
        this.ctx.shadowColor = 'red';
        this.ctx.shadowBlur = 5;

        const story = [
            "The year is 2523. Earth stands on the brink of annihilation.",
            "Alien creatures have spread terror and destruction.",
            "Their mission: To erase humanity.",
            "You are our last hope. The future depends on you.",
        ];
        story.forEach((line, index) => {
            this.ctx.fillText(line, this.canvas.width / 2, 280 + index * 40);
        });
        this.ctx.shadowBlur = 0; // Reset shadow

        // Instructions
        this.ctx.font = '20px "Creepster", sans-serif';
        this.ctx.fillStyle = 'red'; // Cyan for instructions
        this.ctx.shadowColor = 'white';
        this.ctx.shadowBlur = 10;

        const instructions = [
            'Instructions:',
            '- Arrow keys to move',
            '- Spacebar to shoot',
            '- Press "P" to pause',
            '- Press "C" to continue',
        ];
        instructions.forEach((line, index) => {
            this.ctx.fillText(line, this.canvas.width / 2, 450 + index * 30);
        });
        this.ctx.shadowBlur = 0; // Reset shadow

        // Play Button
        this.ctx.shadowColor = 'red';
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = 'rgba(128, 128, 128, 0.5)'; // Semi-transparent gray
        this.ctx.fillRect(this.canvas.width / 2 - 100, 600, 200, 60);
        this.ctx.shadowBlur = 0; // Reset shadow for text
        this.ctx.fillStyle = 'red'; // Bold red text
        this.ctx.font = '30px "Creepster", sans-serif';
        this.ctx.fillText('PLAY', this.canvas.width / 2, 640);

    }

    bindEvents() {
        // Event listener for handling menu clicks
        this.canvas.addEventListener('click', (e) => {
            if (!this.showing) return;

            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Check if the "Play" button is clicked
            if (
                x >= this.canvas.width / 2 - 100 &&
                x <= this.canvas.width / 2 + 100 &&
                y >= 600 &&
                y <= 660
            ) {
                this.showing = false; // Hide the menu
            }
        });
    }
}
