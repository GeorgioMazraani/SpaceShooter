class EnemySpawner extends Sprite {
    constructor(game, level) {
        super();
        this.game = game;
        this.spawnInterval = 100;
        this.currentCooldown = this.spawnInterval;
        this.level = level;
    }

    update() {
        if (this.currentCooldown > 0) {
            this.currentCooldown--;
            return false;
        }
        this.currentCooldown = this.spawnInterval;

        // Spawn regular enemies
        const x = Math.random() * (this.game.canvas.width - 30);
        const enemy = new Enemy(x, 0, 30, 30, 1, this.level);
        this.game.addSprite(enemy);
        console.log('Regular enemy spawned!');

        this.spawnInterval = Math.max(30, this.spawnInterval - 1); // Reduce spawn interval over time
        return false;
    }
}

class AdvancedEnemySpawner extends Sprite {
    constructor(game) {
        super();
        this.game = game;
        this.spawnInterval = 80; // Initial interval for spawning
        this.currentCooldown = this.spawnInterval;
        this.miniBossSpawnedCount = 0; // Track the number of mini-bosses spawned
        this.maxMiniBosses = 8; // Total mini-bosses to spawn
        this.miniBossSpawnCooldown = 200; // Cooldown for mini-boss spawning
        this.miniBossCooldown = this.miniBossSpawnCooldown; // Initialize cooldown
        this.enemiesSpawned = 0; // Total enemies spawned
        this.maxEnemies = 60; // Total enemies to spawn
        this.asteroidSpawnCooldown = 400; // Cooldown for spawning asteroids
        this.currentAsteroidCooldown = this.asteroidSpawnCooldown; // Initialize asteroid cooldown
    }

    update() {
        // Stop spawning when all mini-bosses and enemies are completed
        if (this.enemiesSpawned >= this.maxEnemies && this.miniBossSpawnedCount >= this.maxMiniBosses) {
            return false;
        }

        // Enemy spawning logic
        if (this.currentCooldown > 0) {
            this.currentCooldown--;
        } else {
            this.spawnNormalEnemy();
            this.currentCooldown = this.spawnInterval;
        }

        // Mini-boss spawning logic
        if (this.miniBossSpawnedCount < this.maxMiniBosses) {
            if (this.miniBossCooldown > 0) {
                this.miniBossCooldown--;
            } else {
                this.spawnMiniBoss();
                this.miniBossCooldown = this.miniBossSpawnCooldown;
            }
        }

        // Asteroid spawning logic
        if (this.currentAsteroidCooldown > 0) {
            this.currentAsteroidCooldown--;
        } else {
            this.spawnAsteroid();
            this.currentAsteroidCooldown = this.asteroidSpawnCooldown;
        }

        return false;
    }

    /**
     * Check if all spawning is complete
     * @returns {boolean}
     */
    allSpawningComplete() {
        return (
            this.enemiesSpawned >= this.maxEnemies &&
            this.miniBossSpawnedCount >= this.maxMiniBosses
        );
    }

    /**
     * Spawn a normal enemy
     */
    spawnNormalEnemy() {
        const x = Math.random() * (this.game.canvas.width - 30);
        const enemy = new Enemy(x, 0, 30, 30, 1); // Regular enemy
        this.game.addSprite(enemy);
        this.enemiesSpawned++; // Increment enemy count
        console.log("Normal enemy spawned!");
    }

    /**
     * Spawn a mini-boss using the BossAlien class
     */
    spawnMiniBoss() {
        const x = Math.random() * (this.game.canvas.width - 200) + 100; // Safe horizontal bounds
        const miniBoss = new BossAlien(
            x,
            -100, // Spawn above the screen
            80, // Smaller width
            80, // Smaller height
            0.5, // Slower vertical speed
            this.game
        );

        // Set sine wave properties
        miniBoss.amplitude = 30; // Smaller horizontal range
        miniBoss.frequency = 0.02; // Slow sine wave motion

        this.game.addSprite(miniBoss);
        this.miniBossSpawnedCount++;
        console.log("Mini-boss spawned!");
    }



    /**
     * Spawn an asteroid
     */
    spawnAsteroid() {
        const x = Math.random() * (this.game.canvas.width - 132);
        const asteroid = new Asteroid(x, -100, this.game); // Spawn asteroid above the screen
        this.game.addSprite(asteroid);
        console.log("Asteroid spawned!");
    }
}


