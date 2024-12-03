// Initialize the game instance
const game = new Game();
const backgroundMusic = new Audio('../assets/Sounds/music.mp3'); // Replace with your music file path
backgroundMusic.loop = true; // Loop the music
backgroundMusic.volume = 0.5;

// Initialize the menu
const menu = new Menu(game.canvas, game.ctx, game);

// Initialize the level manager
const levelManager = new LevelManager(game, backgroundMusic);
game.levelManager = levelManager;

// Animation loop for the menu
function animateMenu() {
    if (menu.showing) {
        menu.draw(); // Draw the menu
        requestAnimationFrame(animateMenu);
    } else {
        // Start the game once the menu is hidden
        startGame();
    }
}

// Start the game logic after the menu
function startGame() {
    backgroundMusic.play();

    // Add the background
    const background = new Background('../assets/bg.png', 1, game.canvas);
    game.addSprite(background);

    // Add the player's plane
    const plane = new Plane(200, 500, 2, game);
    game.addSprite(plane);

    // Add the score display
    const score = new Score(0, 0);
    game.addSprite(score);

    // Start the first level
    levelManager.startLevel(1);

    // Start the game loop
    game.animate = function () {
        if (!this.paused) {
            this.update();
            this.draw();
            levelManager.updateLevel(); // Check and handle level progression
        }
        requestAnimationFrame(() => this.animate());
    };

    game.animate();
}

// Begin with the menu animation loop
animateMenu();
