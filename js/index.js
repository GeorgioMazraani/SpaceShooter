// Initialize the game instance
const game = new Game();
const backgroundMusic = new Audio('../assets/Sounds/music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

// Initialize the menu
const menu = new Menu(game.canvas, game.ctx, game);

const levelManager = new LevelManager(game, backgroundMusic);
game.levelManager = levelManager;

function animateMenu() {
    if (menu.showing) {
        menu.draw();
        requestAnimationFrame(animateMenu);
    } else {
        startGame();
    }
}

function startGame() {
    backgroundMusic.play();

    const background = new Background('../assets/bg.png', 1, game.canvas);
    game.addSprite(background);

    const plane = new Plane(200, 500, 2, game);
    game.addSprite(plane);

    const score = new Score(0, 0);
    game.addSprite(score);

    levelManager.startLevel(1);

    game.animate = function () {
        if (!this.paused) {
            this.update();
            this.draw();
            levelManager.updateLevel();
        }
        requestAnimationFrame(() => this.animate());
    };

    game.animate();
}

animateMenu();
