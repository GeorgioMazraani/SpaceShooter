class LevelManager {
    constructor(game) {
        this.game = game;
        this.currentLevel = 1; // Start at level 1
        this.levels = [this.setupLevel1.bind(this), this.setupLevel2.bind(this)];
        this.frameCounter = 0; // Track time in frames
        this.framesPerSecond = 60; // Game runs at 60 FPS
        this.levelDurationFrames = 30 * this.framesPerSecond; // 30 seconds for Level 1
        this.money = 0; // Player's money
        this.bossCreated = false; // Track if the boss has been created
        this.miniBossSpawned = false; // Track if mini-boss has been spawned
        this.finalBossSpawned = false; // Track if final boss has been spawned
        this.advancedSpawner = null; // Reference for advanced enemy spawner
    }

    /**
     * Starts the specified level
     * @param {number} level - The level number to start
     */
    startLevel(level, selectedBullet = "Default", shieldPurchased = false) {
        console.log(`Starting Level ${level}`);
        this.currentLevel = level;
        this.frameCounter = 0; // Reset frame counter
        this.game.sprites = []; // Clear previous sprites
        this.bossCreated = false; // Reset bossCreated for each level
        this.levels[level - 1](selectedBullet, shieldPurchased); // Setup the selected level
    }

    /**
     * Sets up Level 1
     */
    setupLevel1() {
        console.log("Setting up Level 1: Basic enemies");

        // Add the background
        const background = new Background('../assets/bg.png', 1, this.game.canvas);
        this.game.addSprite(background);

        // Add the player's plane
        const plane = new Plane(200, 400, 2, this.game);
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
        const timer = new Timer(this.game.canvas.width - 60, 30, 30, this.game); // Timer at top-right
        this.game.addSprite(timer);

        // Track the timer and money tracker
        this.timer = timer;
        this.moneyTracker = moneyTracker;
    }

    /**
     * Sets up Level 2
     */
    setupLevel2(selectedBullet, shieldPurchased) {
        console.log("Setting up Level 2 with advanced enemies and mini-bosses.");

        // Add the background
        const background = new Background('../assets/bg.png', 1, this.game.canvas);
        this.game.addSprite(background);

        // Add the player's plane
        const plane = new Plane(200, 500, 3, this.game);
        plane.bulletType = selectedBullet || "Default";
        plane.hasShield = shieldPurchased || false;
        this.game.addSprite(plane);

        // Add advanced enemy spawner for Level 2
        this.advancedSpawner = new AdvancedEnemySpawner(this.game);
        this.game.addSprite(this.advancedSpawner);

        console.log("Level 2 setup complete.");
    }

    /**
     * Transition to Level 2 Menu and Start Level 2
     */
    transitionToLevel2Menu() {
        this.game.paused = true; // Pause the game
        this.money = this.moneyTracker.money; // Retrieve collected money

        const menu = new lv2Menu(this.game, this.money);

        const drawMenu = () => {
            if (this.game.paused) {
                menu.draw(); // Draw the menu
                requestAnimationFrame(drawMenu);
            }
        };

        // Handle "Play" button or "Enter" to start Level 2
        const startLevel2 = () => {
            this.game.paused = false; // Resume the game
            this.startLevel(2, menu.selectedBullet, menu.shieldPurchased); // Pass upgrades
            window.removeEventListener("keydown", handleKeydown);
        };

        const handleKeydown = (e) => {
            menu.handleInput(e.key); // Navigate menu
            if (e.key === "Enter") {
                startLevel2();
            }
        };

        window.addEventListener("keydown", handleKeydown);
        drawMenu();
    }

    /**
     * Updates the level state
     */
    updateLevel() {
        // Find remaining entities
        const enemies = this.game.sprites.filter(sprite => sprite instanceof Enemy);
        const asteroids = this.game.sprites.filter(sprite => sprite instanceof Asteroid);
        const miniBoss = this.game.sprites.find(sprite => sprite instanceof BossAlien);
        const plane = this.game.sprites.find(sprite => sprite instanceof Plane);

        // Increment the frame counter
        this.frameCounter++;

        // **Level 1 Completion Logic**
        if (this.currentLevel === 1) {
            if (this.frameCounter >= this.levelDurationFrames) {
                console.log("Level 1 complete! Transitioning to Level 2 Menu...");
                this.transitionToLevel2Menu();
                return;
            }
        }

        // **Mini-Boss Spawning**
        if (
            this.currentLevel === 2 &&
            this.advancedSpawner &&
            this.advancedSpawner.miniBossSpawnedCount < this.advancedSpawner.maxMiniBosses
        ) {
            // Mini-bosses are spawned by the spawner, so no additional logic here
        }

        // **Final Boss Spawning**
        if (
            this.currentLevel === 2 &&
            this.advancedSpawner &&
            this.advancedSpawner.miniBossSpawnedCount >= this.advancedSpawner.maxMiniBosses && // All mini-bosses spawned
            !miniBoss && // All mini-bosses defeated
            enemies.length === 0 && // All regular enemies cleared
            asteroids.length === 0 && // All asteroids cleared
            !this.finalBossSpawned // Final boss not yet spawned
        ) {
            this.spawnFinalBoss();
        }

        // **Level 2 Completion: Check if the player has won**
        const finalBoss = this.game.sprites.find(sprite => sprite instanceof FinalBoss);
        if (this.currentLevel === 2 && this.finalBossSpawned && !finalBoss) {
            console.log("You won the game!");
            this.game.paused = true;
            alert("Congratulations! You won!");
            return;
        }

        // **Check if the player has lost**
        if (!plane || !plane.isActive) {
            console.log("You lost the game!");
            this.game.paused = true;
            alert("Game Over! Try again.");
            return;
        }
    }

    /**
     * Spawn the final boss
     */
    spawnFinalBoss() {
        const finalBoss = new FinalBoss(
            this.game,
            this.game.canvas.width / 2 - 75,
            20, // Top of the screen
            150, // Boss width
            50, // Boss height
            200 // Boss health
        );
        this.game.addSprite(finalBoss);
        this.finalBossSpawned = true;
        console.log("Final Boss spawned!");
    }
}
