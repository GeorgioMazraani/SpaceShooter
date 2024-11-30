class LevelManager {
    constructor(game) {
        this.game = game;
        this.currentLevel = 1;
        this.levels = {
            1: {
                name: "New Frontier",
                spawnRate: 200,
                enemyConfig: { speed: 1, health: 1 },
                asteroidConfig: { speed: 0.5, size: 50 },
                duration: 30000, // Level duration in milliseconds
                difficulty: "Low",
            },
            2: {
                name: "The Swarm",
                spawnRate: 150,
                enemyConfig: { speed: 2, health: 2, shooting: true },
                asteroidConfig: { speed: 1, size: 75 },
                duration: 45000,
                difficulty: "Medium",
            },
            3: {
                name: "Chaos Rising",
                spawnRate: 100,
                enemyConfig: { speed: 3, health: 3, elite: true },
                asteroidConfig: { speed: 1.5, size: 100, special: true },
                duration: 60000,
                difficulty: "High",
            },
        };
        this.levelTimer = 0; // Time elapsed in the current level
    }

    // Start a specific level
    startLevel(level) {
        this.currentLevel = level;
        const config = this.levels[level];
        if (!config) {
            console.error(`Level ${level} configuration not found`);
            return;
        }

        console.log(`Starting Level ${level}: ${config.name}`);
        this.game.sprites = []; // Reset all sprites for the new level
        this.levelTimer = 0;

        // Add background and static elements
        const background = new Background("../assets/bg.png", 1, this.game.canvas);
        this.game.addSprite(background);

        const plane = new Plane(200, 500, 2, this.game);
        this.game.addSprite(plane);

        const score = new Score(0, 0);
        this.game.addSprite(score);

        // Spawn level-specific enemies and obstacles
        this.spawnEnemies(config.enemyConfig, config.spawnRate);
        this.spawnAsteroids(config.asteroidConfig);

        // Display level name or transition screen
        this.displayLevelStartMessage(config.name);
    }

    // Spawn enemies based on configuration
    spawnEnemies(config, spawnRate) {
        const enemySpawner = new EnemySpawner(this.game, config, spawnRate);
        this.game.addSprite(enemySpawner);
    }

    // Spawn asteroids based on configuration
    spawnAsteroids(config) {
        const asteroidSpawner = new AsteroidSpawner(this.game, config);
        this.game.addSprite(asteroidSpawner);
    }

    // Progress to the next level
    nextLevel() {
        if (this.currentLevel < Object.keys(this.levels).length) {
            this.startLevel(this.currentLevel + 1);
        } else {
            this.completeGame();
        }
    }

    // Update the level's timer and check for completion
    update(deltaTime) {
        const config = this.levels[this.currentLevel];
        this.levelTimer += deltaTime;

        if (this.levelTimer >= config.duration) {
            console.log(`Level ${this.currentLevel} completed!`);
            this.nextLevel();
        }
    }

    // Display level start message
    displayLevelStartMessage(levelName) {
        const ctx = this.game.ctx;
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`Level: ${levelName}`, this.game.canvas.width / 2, this.game.canvas.height / 2);

        setTimeout(() => {
            ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        }, 3000); // Display message for 3 seconds
    }

    // Handle game completion
    completeGame() {
        console.log("Game Completed! You win!");
        const ctx = this.game.ctx;
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Congratulations! You Completed the Game!", this.game.canvas.width / 2, this.game.canvas.height / 2);

        setTimeout(() => {
            this.resetGame();
        }, 5000); // Wait 5 seconds and reset the game
    }

    // Reset the game to the main menu or first level
    resetGame() {
        this.currentLevel = 1;
        this.startLevel(1);
    }
}
