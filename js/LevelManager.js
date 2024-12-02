class LevelManager {
    constructor(game) {
        this.game = game;
        this.currentLevel = 1; // Start at level 1
        this.frameCounter = 0; // Track time in frames
        this.framesPerSecond = 60; // Game runs at 60 FPS
        this.levelDurationFrames = 40 * this.framesPerSecond; // 40 seconds for Level 1
        this.money = 0; // Player's money
        this.finalBossSpawned = false; // Track if final boss has been spawned
        this.selectedBullet = "Default"; // Default bullet type
        this.shieldPurchased = false; // Default shield status
    }

    /**
     * Starts the specified level.
     * @param {number} level - The level number to start.
     * @param {string} selectedBullet - The selected bullet type.
     * @param {boolean} shieldPurchased - Whether a shield is purchased.
     */
    startLevel(level, selectedBullet = "Default", shieldPurchased = false) {
        console.log(`Starting Level ${level}`);
        this.currentLevel = level;
        this.frameCounter = 0; // Reset frame counter
        this.finalBossSpawned = false;
        this.selectedBullet = selectedBullet;
        this.shieldPurchased = shieldPurchased;
        this.game.sprites = []; // Clear sprites
        this[`setupLevel${level}`](); // Dynamically setup the level
    }

    /**
     * Sets up Level 1.
     */
    setupLevel1() {
        console.log("Setting up Level 1: Basic enemies");

        // Add the background
        const background = new Background("../assets/bg.png", 1, this.game.canvas);
        this.game.addSprite(background);

        // Add the player's plane
        const plane = new Plane(200, 400, 3, this.game);
        this.game.addSprite(plane);

        // Add the enemy spawner for Level 1
        const enemySpawner = new EnemySpawner(this.game, 1);
        this.game.addSprite(enemySpawner);

        // Add money tracker and score tracker
        const moneyTracker = new MoneyTracker(10, 40);
        this.game.addSprite(moneyTracker);

        const score = new Score(10, 10);
        this.game.addSprite(score);

        // Add timer for Level 1
        const timer = new Timer(this.game.canvas.width - 60, 30, 40, this.game); // Timer at top-right
        this.game.addSprite(timer);

        // Track the timer and money tracker
        this.timer = timer;
        this.moneyTracker = moneyTracker;
    }

    /**
     * Sets up Level 2.
     */
    setupLevel2() {
        console.log("Setting up Level 2 with advanced enemies and upgrades.");

        // Add the background
        const background = new Background("../assets/bg.png", 1, this.game.canvas);
        this.game.addSprite(background);

        // Add the player's plane with selected upgrades
        const plane = new Plane(
            200,
            500,
            3,
            this.game,
            this.selectedBullet,
            this.shieldPurchased
        );
        this.game.addSprite(plane);

        // Add advanced enemy spawner for Level 2
        this.advancedSpawner = new AdvancedEnemySpawner(this.game);
        this.game.addSprite(this.advancedSpawner);

        console.log("Level 2 setup complete.");
    }

    /**
     * Transition to Level 2 Menu and start Level 2.
     */
    transitionToLevel2Menu() {
        this.game.paused = true;
        this.money = this.moneyTracker.money;

        const menu = new lv2Menu(this.game, this.money);

        const drawMenu = () => {
            if (this.game.paused) {
                menu.draw();
                requestAnimationFrame(drawMenu);
            }
        };

        const startLevel2 = () => {
            this.game.paused = false;
            this.startLevel(2, menu.selectedBullet, menu.shieldPurchased);
            window.removeEventListener("keydown", handleKeydown);
        };

        const handleKeydown = (e) => {
            menu.handleInput(e.key);
            if (e.key === "Enter") {
                startLevel2();
            }
        };

        window.addEventListener("keydown", handleKeydown);
        drawMenu();
    }

    /**
     * Updates the level state.
     */
    updateLevel() {
        // Increment the frame counter
        this.frameCounter++;

        // Find relevant entities
        const enemies = this.game.sprites.filter(sprite => sprite instanceof Enemy);
        const asteroids = this.game.sprites.filter(sprite => sprite instanceof Asteroid);
        const plane = this.game.sprites.find(sprite => sprite instanceof Plane);

        // Level 1 Completion Logic
        if (this.currentLevel === 1) {
            if (this.frameCounter >= this.levelDurationFrames) {
                console.log("Level 1 complete! Transitioning to Level 2 Menu...");
                this.transitionToLevel2Menu();
                return;
            }
        }

        // Final Boss Spawning Logic
        if (
            this.currentLevel === 2 &&
            this.advancedSpawner &&
            this.advancedSpawner.allSpawningComplete() && // Ensure all spawning is complete
            enemies.length === 0 && // Ensure no remaining enemies
            asteroids.length === 0 && // Ensure no remaining asteroids
            !this.finalBossSpawned
        ) {
            this.clearScreenForFinalBoss();
            this.spawnFinalBoss();
        }

        // Check if the player has lost
        if (!plane || !plane.isActive) {
            console.log("You lost the game!");
            this.game.paused = true;
            alert("Game Over! Try again.");
            return;
        }

        // Check if the player has won
        const finalBoss = this.game.sprites.find(sprite => sprite instanceof FinalBoss);
        if (this.currentLevel === 2 && this.finalBossSpawned && !finalBoss) {
            console.log("You won the game!");
            this.game.paused = true;
            alert("Congratulations! You won!");
        }
    }

    /**
     * Spawn the final boss.
     */
    spawnFinalBoss() {
        const finalBoss = new FinalBoss(
            this.game,
            this.game.canvas.width / 2 - 75,
            20, // Top of the screen
            150, // Boss width
            100, // Boss height
            500 // Boss health
        );
        this.game.addSprite(finalBoss);
        this.finalBossSpawned = true;
        console.log("Final Boss spawned!");
    }

    /**
     * Clear the screen for the final boss.
     */
    clearScreenForFinalBoss() {
        console.log("Clearing screen for final boss...");
        this.game.sprites = this.game.sprites.filter(
            sprite => sprite instanceof Background || sprite instanceof Plane
        );
    }
}
