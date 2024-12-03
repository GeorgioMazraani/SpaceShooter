// Initialize the game instance
const game = new Game();
const backgroundMusic = new Audio('../assets/Sounds/music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

const levelManager = new LevelManager(game, backgroundMusic);
game.levelManager = levelManager;

const menu = new Menu(game.canvas, game.ctx, game);
menu.onMenuExit = () => levelManager.startGame();
game.addSprite(menu);

game.animate();
