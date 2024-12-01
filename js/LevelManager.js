class LevelManager {
    constructor(game) {
        this.game = game;
        this.currentLevel = 1; // Start at level 1
        this.levels = [this.setupLevel1.bind(this), this.setupLevel2.bind(this)];
        this.frameCounter = 0; // Track time
        this.framesPerSecond = 60; // Game runs at 60 FPS
        this.levelDurationFrames = 120 * this.framesPerSecond; // 120 seconds for Level 1
        this.money = 0; // Player's money
        this.bossCreated = false; // Track if the boss has been created
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
        const timer = new Timer(this.game.canvas.width - 60, 30, 120, this.game); // Timer at top-right
        this.game.addSprite(timer);

        // Track the timer and money tracker
        this.timer = timer;
        this.moneyTracker = moneyTracker;
    }

    /**
     * Sets up Level 2
     */
    setupLevel2(selectedBullet, shieldPurchased) {
        console.log("Setting up Level 2: Harder enemies, asteroids, and a boss");

        // Add the background
        const background = new Background('../assets/bg.png', 1, this.game.canvas);
        this.game.addSprite(background);

        // Add the player's plane
        const plane = new Plane(200, 500, 2, this.game);
        plane.bulletType = selectedBullet || "Default"; // Default to "Default" if none selected
        plane.hasShield = shieldPurchased || false; // Default to false if no shield purchased
        this.game.addSprite(plane);

        // Add the enemy spawner
        const enemySpawner = new AdvancedEnemySpawner(this.game);
        this.game.addSprite(enemySpawner);

        // Add asteroids
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * (this.game.canvas.width - 132);
            const y = -137; // Spawn off-screen
            this.game.addSprite(new Asteroid(x, y, this.game));
        }

        // Add the final boss
        const boss = new BossAlien(
            this.game.canvas.width / 2 - 75, // Center horizontally
            -100, // Spawn off-screen
            150, // Boss width
            150, // Boss height
            0.5, // Speed
            this.game
        );
        this.game.addSprite(boss);
        this.bossCreated = true; // Mark the boss as created

        console.log("Level 2 setup complete");
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
        const boss = this.game.sprites.find(sprite => sprite instanceof BossAlien);
        const plane = this.game.sprites.find(sprite => sprite instanceof Plane);

        // Level 1: End after duration
        if (this.currentLevel === 1) {
            this.frameCounter++;
            if (this.frameCounter >= this.levelDurationFrames) {
                console.log("Level 1 complete! Transitioning to Level 2 Menu...");
                this.transitionToLevel2Menu();
                return;
            }
        }

        // Level 2: Check if the player has won (boss defeated)
        if (this.currentLevel === 2 && this.bossCreated && !boss) {
            console.log("You won the game!");
            this.game.paused = true;
            alert("Congratulations! You won!");
            return;
        }

        // Check if the player has lost (Plane destroyed)
        if (!plane || !plane.isActive) {
            console.log("You lost the game!");
            this.game.paused = true;
            alert("Game Over! Try again.");
            return;
        }
    }
}
