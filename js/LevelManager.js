class LevelManager extends Sprite {
    constructor(game, backgroundMusic) {
        super();
        this.game = game;
        this.backgroundMusic = backgroundMusic;
        this.currentLevel = 1;
        this.frameCounter = 0;
        this.framesPerSecond = 60;
        this.levelDurationFrames = 40 * this.framesPerSecond;
        this.money = 0;
        this.finalBossSpawned = false;
        this.selectedBullet = "Default";
        this.shieldPurchased = false;
    }

    startGame() {
        console.log("Starting the game...");
        this.backgroundMusic.play();

        // Add LevelManager to game sprites for updates
        this.game.addSprite(this);
        console.log("Added LevelManager to sprites.");

        // Initialize the background and score
        const background = new Background('../assets/bg.png', 1, this.game.canvas);
        this.game.addSprite(background);

        const score = new Score(0, 0);
        this.game.addSprite(score);

        // Start Level 1
        this.startLevel(1);

        // Add key event listener
        window.addEventListener('keydown', (event) => this.handleKeyInput(event));
    }

    handleKeyInput(event) {
        const menu = this.game.sprites.find(sprite => sprite instanceof lv2Menu);
        if (menu) {
            menu.handleInput(event.key);
        }
    }

    startLevel(level, selectedBullet = "Default", shieldPurchased = false) {
        console.log(`Starting Level ${level}`);
        this.currentLevel = level;
        this.frameCounter = 0;
        this.finalBossSpawned = false;
        this.selectedBullet = selectedBullet;
        this.shieldPurchased = shieldPurchased;

        // Clear previous sprites
        this.game.sprites = [];
        this.game.addSprite(this);

        // Setup the specific level
        this[`setupLevel${level}`]();
    }

    setupLevel1() {
        console.log("Setting up Level 1: Basic enemies");

        const background = new Background("../assets/bg.png", 1, this.game.canvas);
        this.game.addSprite(background);

        const plane = new Plane(200, 400, 3, this.game);
        this.game.addSprite(plane);

        const enemySpawner = new EnemySpawner(this.game, 1);
        this.game.addSprite(enemySpawner);

        const moneyTracker = new MoneyTracker(10, 40);
        this.game.addSprite(moneyTracker);

        const score = new Score(10, 10);
        this.game.addSprite(score);

        const timer = new Timer(this.game.canvas.width - 60, 30, 40, this.game);
        this.game.addSprite(timer);

        this.timer = timer;
        this.moneyTracker = moneyTracker;
    }

    setupLevel2() {
        console.log("Setting up Level 2 with advanced enemies and upgrades.");

        const background = new Background("../assets/bg.png", 1, this.game.canvas);
        this.game.addSprite(background);

        const plane = new Plane(
            200,
            500,
            3,
            this.game,
            this.selectedBullet,
            this.shieldPurchased
        );
        this.game.addSprite(plane);

        this.advancedSpawner = new AdvancedEnemySpawner(this.game);
        this.game.addSprite(this.advancedSpawner);

        const score = new Score(10, 10);
        this.game.addSprite(score);

        console.log("Level 2 setup complete.");
    }

    transitionToLevel2Menu() {
        console.log("Transitioning to Level 2 Menu...");
        this.game.paused = true;
        this.money = this.moneyTracker.money;

        const menu = new lv2Menu(this.game, this.money);

        menu.onMenuExit = () => {
            this.game.paused = false;
            this.startLevel(2, menu.selectedBullet, menu.shieldPurchased);
        };

        this.game.addSprite(menu); // Add the menu to the sprites
    }

    update() {
        this.frameCounter++;

        const timer = this.game.sprites.find(sprite => sprite instanceof Timer);
        const enemies = this.game.sprites.filter(sprite => sprite instanceof Enemy);
        const asteroids = this.game.sprites.filter(sprite => sprite instanceof Asteroid);
        const plane = this.game.sprites.find(sprite => sprite instanceof Plane);

        // Level 1 logic
        if (this.currentLevel === 1) {
            if (!timer) {
                console.log("Level 1 complete! Transitioning to Level 2 Menu...");
                this.transitionToLevel2Menu();
                return;
            }
        }

        // Level 2 logic
        if (this.currentLevel === 2) {
            console.log(this.advancedSpawner)
            if (
                this.advancedSpawner &&
                this.advancedSpawner.allSpawningComplete() &&
                enemies.length === 0 &&
                asteroids.length === 0 &&
                !this.finalBossSpawned
            ) {
                this.spawnFinalBoss();
            }
        }

        // Check for Game Over
        if (!plane || !plane.isActive) {
            console.log("Game Over! Restarting...");
            this.game.addSprite(new GameOver(this.game, this, this.backgroundMusic, false));
            return;
        }

        // Check for victory (Final Boss defeated)
        const finalBoss = this.game.sprites.find(sprite => sprite instanceof FinalBoss);
        if (this.currentLevel === 2 && this.finalBossSpawned && !finalBoss) {
            console.log("You won the game!");
            this.game.addSprite(new GameOver(this.game, this, this.backgroundMusic, true));
            return;
        }
    }


    spawnFinalBoss() {
        console.log("Spawning Final Boss...");
        const finalBoss = new FinalBoss(
            this.game,
            this.game.canvas.width / 2 - 75,
            20,
            150,
            100,
            10000
        );
        this.game.addSprite(finalBoss);
        this.finalBossSpawned = true;
        console.log("Final Boss added to sprites.");
    }


}
