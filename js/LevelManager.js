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
        this.activeMenu = null;
    }

    startGame() {
        console.log("Starting the game...");
        this.backgroundMusic.play();

        this.game.addSprite(this);
        console.log("Added LevelManager to sprites.");

        const background = new Background('../assets/bg.png', 1, this.game.canvas);
        this.game.addSprite(background);

        const score = new Score(0, 0);
        this.game.addSprite(score);

        this.startLevel(1);

    }

    startLevel(level, selectedBullet = "Default", shieldPurchased = false) {
        console.log(`Starting Level ${level}`);
        this.currentLevel = level;
        this.frameCounter = 0;
        this.finalBossSpawned = false;
        this.selectedBullet = selectedBullet;
        this.shieldPurchased = shieldPurchased;

        this.game.sprites = this.game.sprites.filter(sprite => sprite instanceof LevelManager);
        this.game.addSprite(this);


        this[`setupLevel${level}`]();
    }

    setupLevel1() {
        console.log("Setting up Level 1: Basic enemies");

        const background = new Background("../assets/bg.png", 1, this.game.canvas);
        this.game.addSprite(background);
        const displayLevel = new DisplayLevel(this.game, this.currentLevel);
        this.game.addSprite(displayLevel);
        const plane = new Plane(canvas.width / 2, canvas.height / 2, 3, this.game);
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
        console.log(this.game.sprites)
    }

    setupLevel2() {
        const background = new Background("../assets/bg.png", 1, this.game.canvas);
        this.game.addSprite(background);
        const displayLevel = new DisplayLevel(this.game, this.currentLevel);
        this.game.addSprite(displayLevel);
        const plane = new Plane(
            canvas.width / 2,
            canvas.height / 2,
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
        this.money = this.moneyTracker.money;

        this.backgroundMusic.pause();
        this.game.sprites = this.game.sprites.filter(sprite =>
            sprite instanceof MoneyTracker || sprite instanceof lv2Menu
        );
        const menu = new lv2Menu(this.game, this.money);
        this.activeMenu = menu;

        menu.onMenuExit = () => {
            this.activeMenu = null;
            this.startLevel(2, menu.selectedBullet, menu.shieldPurchased);
            this.backgroundMusic.play();
        };

        this.game.addSprite(menu);
    }




    update() {
        if (this.activeMenu) {
            this.activeMenu.update(this.game.sprites, this.game.keys);
            return;
        }

        this.frameCounter++;

        const timer = this.game.sprites.find(sprite => sprite instanceof Timer);
        const enemies = this.game.sprites.filter(sprite => sprite instanceof Enemy);
        const asteroids = this.game.sprites.filter(sprite => sprite instanceof Asteroid);
        const plane = this.game.sprites.find(sprite => sprite instanceof Plane);

        if (this.currentLevel === 1) {
            if (!timer) {
                console.log("Level 1 complete! Transitioning to Level 2 Menu...");
                this.transitionToLevel2Menu();
                return;
            }
        }

        if (this.currentLevel === 2) {
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

        if (!plane || !plane.isActive) {
            console.log("Game Over! Restarting...");

            this.game.addSprite(new GameOver(this.game, this, this.backgroundMusic, false));
            return;
        }

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

class DisplayLevel extends Sprite {
    constructor(game, level) {
        super();
        this.game = game;
        this.level = level; // Current level to display
    }

    setLevel(level) {
        this.level = level; // Update the level text
    }

    update() {
        // No updates needed for static display
        return false;
    }

    draw(ctx) {
        // Draw a semi-transparent overlay at the top for better visibility
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Black with 50% transparency
        ctx.fillRect(0, 0, this.game.canvas.width, 40); // Adjust height to fit text

        // Draw the level text
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`Level ${this.level}`, this.game.canvas.width / 2, 30);
    }
}
