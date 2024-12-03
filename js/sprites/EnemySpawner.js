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

        const x = Math.random() * (this.game.canvas.width - 30);
        const enemy = new Enemy(x, 0, 30, 30, 1, this.level);
        this.game.addSprite(enemy);
        console.log('Regular enemy spawned!');

        this.spawnInterval = Math.max(30, this.spawnInterval - 1);
        return false;
    }
}

class AdvancedEnemySpawner extends Sprite {
    constructor(game) {
        super();
        this.game = game;
        this.spawnInterval = 80;
        this.currentCooldown = this.spawnInterval;
        this.miniBossSpawnedCount = 0;
        this.maxMiniBosses = 8;
        this.miniBossSpawnCooldown = 200;
        this.miniBossCooldown = this.miniBossSpawnCooldown;
        this.enemiesSpawned = 0;
        this.maxEnemies = 60;
        this.asteroidSpawnCooldown = 400;
        this.currentAsteroidCooldown = this.asteroidSpawnCooldown;
    }

    update() {
        if (this.enemiesSpawned >= this.maxEnemies && this.miniBossSpawnedCount >= this.maxMiniBosses) {
            return false;
        }

        if (this.currentCooldown > 0) {
            this.currentCooldown--;
        } else {
            this.spawnNormalEnemy();
            this.currentCooldown = this.spawnInterval;
        }

        if (this.miniBossSpawnedCount < this.maxMiniBosses) {
            if (this.miniBossCooldown > 0) {
                this.miniBossCooldown--;
            } else {
                this.spawnMiniBoss();
                this.miniBossCooldown = this.miniBossSpawnCooldown;
            }
        }

        if (this.currentAsteroidCooldown > 0) {
            this.currentAsteroidCooldown--;
        } else {
            this.spawnAsteroid();
            this.currentAsteroidCooldown = this.asteroidSpawnCooldown;
        }

        return false;
    }

    allSpawningComplete() {
        return (
            this.enemiesSpawned >= this.maxEnemies &&
            this.miniBossSpawnedCount >= this.maxMiniBosses
        );
    }

    spawnNormalEnemy() {
        const x = Math.random() * (this.game.canvas.width - 30);
        const enemy = new Enemy(x, 0, 30, 30, 1);
        this.game.addSprite(enemy);
        this.enemiesSpawned++;
        console.log("Normal enemy spawned!");
    }

    spawnMiniBoss() {
        const x = Math.random() * (this.game.canvas.width - 200) + 100;
        const miniBoss = new BossAlien(
            x,
            -100,
            80,
            80,
            0.5,
            this.game
        );

        miniBoss.amplitude = 30;
        miniBoss.frequency = 0.02;

        this.game.addSprite(miniBoss);
        this.miniBossSpawnedCount++;
        console.log("Mini-boss spawned!");
    }

    spawnAsteroid() {
        const x = Math.random() * (this.game.canvas.width - 132);
        const asteroid = new Asteroid(x, -100, this.game);
        this.game.addSprite(asteroid);
        console.log("Asteroid spawned!");
    }
}


