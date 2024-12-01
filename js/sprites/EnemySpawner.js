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
        this.spawnInterval = 200;
        this.currentCooldown = this.spawnInterval;
        this.enemiesSpawned = 0;
        this.bossSpawnThreshold = 5; // Spawn a boss every 5 enemies
        this.asteroidSpawnThreshold = 10; // Spawn asteroids after 10 enemies
    }

    update() {
        if (this.currentCooldown > 0) {
            this.currentCooldown--;
            return false;
        }
        this.currentCooldown = this.spawnInterval;

        // Spawn regular enemies
        const x = Math.random() * (this.game.canvas.width - 30);
        const enemy = new Enemy(x, 0, 30, 30, 1);
        this.game.addSprite(enemy);
        console.log('Regular enemy spawned!');

        // Spawn boss
        if (this.enemiesSpawned > 0 && this.enemiesSpawned % this.bossSpawnThreshold === 0) {
            const boss = new BossAlien(
                this.game.canvas.width / 2 - 50,
                -100,
                100,
                100,
                0.5,
                this.game
            );
            this.game.addSprite(boss);
            console.log('BossAlien spawned!');
        }

        // Spawn asteroids
        if (this.enemiesSpawned >= this.asteroidSpawnThreshold) {
            const asteroidX = Math.random() * (this.game.canvas.width - 132);
            const asteroidY = -137; // Spawn above the canvas
            const asteroid = new Asteroid(asteroidX, asteroidY, this.game);
            this.game.addSprite(asteroid);
            console.log('Asteroid spawned!');
        }

        this.enemiesSpawned++;
        this.spawnInterval = Math.max(30, this.spawnInterval - 1); // Reduce spawn interval over time
        return false;
    }
}
