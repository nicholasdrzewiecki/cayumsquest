var playState = {

    create: function() {
        // Create world:
        this.createWorld();

        // Create player sprite and movement animations:
        game.world.setBounds(0, 0, 1280, 960); // Set outer bounds of the world
        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player'); // Spawn location of sprite is the center of the world
        this.player.anchor.setTo(0.5, 0.5); // Anchors the player to the middle
        this.game.camera.follow(this.player); // Camera will follow player
        this.player.direction = 2; // Default resting player direction set to frame 2
        this.player.animations.add('down', [0, 2], 8, true); // Spritesheet animates from frame 0-2
        this.player.animations.add('up', [3, 5], 8, true); // Spritesheet animates from frame 3-5
        this.player.animations.add('left', [6, 8], 8, true); // Spritesheet animates from frame 6-8
        this.player.animations.add('right', [9, 11], 8, true); // Spritesheet animates from frame 9-11

        // Initiate physics engine:
        game.physics.arcade.enable(this.player); // Tell Phaser that the player will use the Arcade physics engine

        // Keyboard controls:
        this.cursor = game.input.keyboard.createCursorKeys();

        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        };

        // Particles emitter:
        this.emitter = game.add.emitter(0, 0, 5); // Create emitter with five particles (x, y, quantity);
        this.emitter.makeParticles('deathParticle'); // Set the image for the particles from load state
        this.emitter.setYSpeed(-100, 100);
        this.emitter.setXSpeed(-100, 100);
        this.emitter.gravity = 0;

        // Enemies
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(5, 'enemy');
        game.time.events.loop(5000, this.addEnemy, this);

        // Spells
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.bullets.createMultiple(50, 'deathParticle');
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);
        this.fireRate = 500;
        this.nextFire = 0;
    },

    update: function() {
        // Update collisions:
        game.physics.arcade.collide(this.player, this.layerTwo); // Player will only collide with second layer in map.json
        game.physics.arcade.collide(this.enemies, this.layerTwo); // Enemy will only collide with second layer in map.json
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this); // If player and enemies overlap: player dies
        this.player.body.collideWorldBounds = true; // Collision for world boundaries

        // Enemy follows player
        this.enemies.forEach(function(enemy) {
            if (!enemy.alive) {
                return;
            }
            game.physics.arcade.moveToObject(enemy, this.player, enemy.speed);
        }, this);

        // Fire in direction of mouse pointer
        if (game.input.activePointer.isDown) {
            this.fire();
        }

        this.movePlayer();
        this.addEnemy();
        
        // Test for collision
        game.physics.arcade.overlap(this.bullets, this.enemies, this.collisionHandler, null, this);
    },

    fire: function() {
        if (game.time.now > this.nextFire && this.bullets.countDead() > 0) {
            this.nextFire = game.time.now + this.fireRate;
            this.bullet = this.bullets.getFirstDead();
            this.bullet.reset(this.player.x - 8, this.player.y - 8);
            game.physics.arcade.moveToPointer(this.bullet, 500);
        }
    },

    movePlayer: function() {
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        if (!this.player.alive) {
            return;
        }

        var speed = 100; // Overall speed modifier

        if (this.cursor.left.isDown) {
            this.player.body.velocity.x = -speed;
            this.player.direction = 3;
            this.player.animations.play('left');
        } else if (this.cursor.right.isDown) {
            this.player.body.velocity.x = speed;
            this.player.direction = 4;
            this.player.animations.play('right');
        } else if (this.cursor.up.isDown) {
            this.player.body.velocity.y = -speed;
            this.player.direction = 2;
            this.player.animations.play('up');
        } else if (this.cursor.down.isDown) {
            this.player.body.velocity.y = speed;
            this.player.direction = 1;
            this.player.animations.play('down');
        } else {
            if (this.player.direction == 1)
                this.player.frame = 1;
            else if (this.player.direction == 2)
                this.player.frame = 5;
            else if (this.player.direction == 3)
                this.player.frame = 7;
            else if (this.player.direction == 4)
                this.player.frame = 9;
            this.player.animations.stop();
        }
    },

    createWorld: function() {
        this.map = game.add.tilemap('map'); // Create tilemap from map.json
        this.map.addTilesetImage('tileset'); // Create
        this.layer = this.map.createLayer('Tile Layer 1');
        this.layerTwo = this.map.createLayer('Tile Layer 2');
        this.layer.resizeWorld();
        this.map.setCollisionBetween(2, 100, true, this.layerTwo);
    },

    playerDie: function() {
        if (!this.player.alive) {
            return;
        }
        this.player.kill();
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        this.emitter.start(true, 600, null, 15);
        game.time.events.add(1000, this.startMenu, this);
    },

    addEnemy: function() {
        // Get the first dead enemy of the group
        var enemy = this.enemies.getFirstDead();
        // If there isn't any dead enemy, do nothing
        if (!enemy) {
            return;
        }
        // Initialise the enemy
        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.world.randomX, game.world.randomY);
        enemy.body.velocity.x = 20 * Phaser.Utils.randomChoice(1, -1);
        enemy.body.velocity.y = 20 * Phaser.Utils.randomChoice(1, -1);
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
        game.physics.arcade.moveToObject(enemy, this.player, 50);
    },

    startMenu: function() {
        game.state.start('menu');
    },
    
    collisionHandler: function(bullets, enemies) {
        bullets.kill();
        enemies.kill();
    }

};
