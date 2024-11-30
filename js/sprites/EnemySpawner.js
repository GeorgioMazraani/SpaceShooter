class EnemySpawner extends Sprite {
    constructor(game, config, spawnRate) {
        super();
        this.game = game;
        this.config = config;
        this.spawnInterval = spawnRate;
        this.currentCooldown = spawnRate;
    }

    update() {
        if (this.currentCooldown > 0) {
            this.currentCooldown--;
            return false;
        }
        this.currentCooldown = this.spawnInterval;

        const x = Math.random() * (this.game.canvas.width - 30);
        const enemy = new Enemy(x, 0, 30, 30, this.config.speed);
        if (this.config.shooting) {
            enemy.shoot = true; // Enable shooting enemies
        }
        if (this.config.elite) {
            enemy.health = 5; // Increase health for elite enemies
        }
        this.game.addSprite(enemy);
        return false;
    }
}

class AsteroidSpawner extends Sprite {
    constructor(game, config) {
        super();
        this.game = game;
        this.config = config;
        this.spawnInterval = 200;
        this.currentCooldown = 200;
    }

    update() {
        if (this.currentCooldown > 0) {
            this.currentCooldown--;
            return false;
        }
        this.currentCooldown = this.spawnInterval;

        const x = Math.random() * (this.game.canvas.width - this.config.size);
        const asteroid = new Asteroid(x, 0, this.game);
        asteroid.speed = this.config.speed;
        if (this.config.special) {
            asteroid.special = true; // Add special behavior
        }
        this.game.addSprite(asteroid);
        return false;
    }
}
