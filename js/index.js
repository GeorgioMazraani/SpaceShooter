// Initialize the game instance
const game = new Game();
const backgroundMusic = new Audio('../assets/Sounds/music.mp3'); // Replace with your music file path
backgroundMusic.loop = true; // Loop the music
backgroundMusic.volume = 0.5;

// Initialize the menu
const menu = new Menu(game.canvas, game.ctx, game);

// Initialize the LevelManager
const levelManager = new LevelManager(game);

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

    // Add a background that persists across levels
    const background = new Background('../assets/bg.png', 1, game.canvas);
    game.addSprite(background);

    // Add the plane (player character)
    const plane = new Plane(200, 500, 2, game);
    game.addSprite(plane);

    // Add the score display
    const score = new Score(0, 0);
    game.addSprite(score);

    // Start the first level
    levelManager.startLevel(1);

    // Start the game loop
    game.animate();
}

// Monitor level completion
game.onLevelComplete = () => {
    // Check if there is a next level
    if (levelManager.currentLevel < 3) {
        levelManager.nextLevel();
    } else {
        console.log('Game Completed! You win!');
        // Optionally, restart the game or show a win screen
        menu.showing = true;
        animateMenu();
    }
};

// Begin with the menu animation loop
animateMenu();
