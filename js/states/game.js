var CAYUMSQUEST = CAYUMSQUEST || {};

CAYUMSQUEST.GameState = {

    init: function(currentLevel) {
        this.currentLevel = currentLevel ? currentLevel : 'world';
        this.game.physics.arcade.gravity.y = 0;

        this.wasd = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
        };
    },

    create: function() {
        // Particles emitter
        this.emitter = this.game.add.emitter(0, 0, 3); // Create emitter with five particles (x, y, quantity);
        this.emitter.makeParticles('heart');
        this.emitter.makeParticles('arrow');
        this.emitter.setYSpeed(-100, 100);
        this.emitter.setXSpeed(-100, 100);
        this.emitter.gravity = 0;

        // Enemies
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(5, 'wolf');
        this.game.time.events.loop(10000, this.spawnMonster, this);

        // Spells
        this.arrows = this.game.add.group();
        this.arrows.enableBody = true;
        this.arrows.physicsBodyType = Phaser.Physics.ARCADE;
        this.arrows.createMultiple(50, 'arrow');
        this.arrows.setAll('checkWorldBounds', true);
        this.arrows.setAll('outOfBoundsKill', true);

        this.fireRate = 500;
        this.nextFire = 0;

        // Add mobile controls from our plugin
        this.game.mobileControls = this.game.plugins.add(Phaser.Plugin.mobileControls);

        this.loadWorld();
    },

    update: function() {
        this.game.physics.arcade.collide(this.enemies, this.collisionLayer);
        this.game.physics.arcade.collide(this.player, this.collisionLayer);
        this.game.physics.arcade.collide(this.player, this.enemies, this.attack, null, this);
        this.game.physics.arcade.overlap(this.arrows, this.enemies, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this); // Collect items
        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);

        this.player.body.collideWorldBounds = true;

        // Enemy follows player
        this.enemies.forEach(function(enemy) {
            if (!enemy.alive) {
                return;
            }
            this.game.physics.arcade.moveToObject(enemy, this.player, enemy.speed);
        }, this);

        // Fire in direction of mouse pointer
        if (this.game.input.activePointer.isDown) {
            this.fire();
        }

        this.movement();
        this.spawnMonster();
    },

    movement: function() {
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.speed = this.player.data.speed;

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.A) || this.player.buttonsPressed.left) {
            this.player.body.velocity.x = -this.speed;
            this.player.direction = 3;
            this.player.animations.play('left');
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D) || this.player.buttonsPressed.right) {
            this.player.body.velocity.x = this.speed;
            this.player.direction = 4;
            this.player.animations.play('right');
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.W) || this.player.buttonsPressed.up) {
            this.player.body.velocity.y = -this.speed;
            this.player.direction = 2;
            this.player.animations.play('up');
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S) || this.player.buttonsPressed.down) {
            this.player.body.velocity.y = this.speed;
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

    fire: function() {
        if (this.game.time.now > this.nextFire && this.arrows.countDead() > 0 && this.player.data.hasBow === 1) {
            this.nextFire = this.game.time.now + this.fireRate;
            this.arrow = this.arrows.getFirstDead();
            this.arrow.reset(this.player.x - 8, this.player.y - 8);
            this.arrow.rotation = this.game.physics.arcade.moveToPointer(this.arrow, 500);
        }
    },

    playerDie: function() {
        if (!this.player.alive) {
            return;
        }
        this.player.kill();
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        this.emitter.start(true, 600, null, 15);
        this.game.time.events.add(1000, this.gameOver, this);
    },

    spawnMonster: function() {
        var enemy = this.enemies.getFirstDead();

        if (!enemy) {
            return;
        }

        enemy.anchor.setTo(0.5, 0.5);
        enemy.body.velocity.x = 20;
        enemy.body.velocity.y = 20;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;

        this.game.physics.arcade.moveToObject(enemy, this.player, 50);
    },

    loadWorld: function() {
        this.world = this.add.tilemap(this.currentLevel);
        this.world.addTilesetImage('tileset', 'tileset');
        this.backgroundLayer = this.world.createLayer('backgroundLayer');
        this.collisionLayer = this.world.createLayer('collisionLayer');
        this.world.setCollisionBetween(1, 512, true, 'collisionLayer');
        this.game.world.sendToBack(this.backgroundLayer);
        this.collisionLayer.resizeWorld();

        // Create player
        var playerData = {
            items: [],
            quests: [{
                questName: 'These boots are rough in shape but will help to traverse the world.',
                questCode: 'getBoots',
                questCompleted: false
            }, {
                questName: 'You have found the first scroll. Somebody may be interested in this item.',
                questCode: 'getScroll',
                questCompleted: false
            }],
            health: 100,
            attack: 20,
            defense: 12,
            speed: 50,
            gold: 0,
            hasBow: 0
        };

        this.player = new CAYUMSQUEST.Player(this, 150, 150, playerData);
        this.player.anchor.setTo(0.5, 0.5);
        this.player.direction = 0;

        this.game.camera.follow(this.player);

        // Add player to the world
        this.add.existing(this.player);

        // Group of items
        this.items = this.add.group();

        // Group of enemies
        this.enemies = this.add.group();

        this.enemy = new CAYUMSQUEST.Enemy(this, 400, 300, 'wolf', {
            attack: 15,
            defense: 10,
            health: 50
        });
        this.enemies.add(this.enemy);

        this.battle = new CAYUMSQUEST.Battle(this.game);

        this.loadItems();

        this.initInterface();
    },

    initInterface: function() {
        this.game.mobileControls.setup(this.player, {
            up: true,
            down: true,
            left: true,
            right: true,
        });
        this.initHud();
    },

    collect: function(player, item) {
        this.player.collectItem(item);
    },

    initHud: function() {
        var style = {
            font: '18px bitmap',
            fill: '#f2f2f2'
        };

        this.healthIcon = this.add.sprite(30, 30, 'heart');
        this.healthIcon.fixedToCamera = true;

        this.healthLabel = this.add.text(55, 30, this.player.data.health, style);
        this.healthLabel.fixedToCamera = true;

        this.speedIcon = this.add.sprite(90, 30, 'boots');
        this.speedIcon.fixedToCamera = true;

        this.speedLabel = this.add.text(110, 30, this.player.data.speed, style);
        this.speedLabel.fixedToCamera = true;
    },

    refreshStats: function() {
        this.healthLabel.text = this.player.data.health;
        this.speedLabel.text = this.player.data.speed;
    },

    findObjectsByType: function(type, tilemap, layer) {
        var result = [];

        tilemap.objects[layer].forEach(function(item) {
            if (item.properties.type === type) {
                item.y -= tilemap.tileHeight / 2;
                item.x += tilemap.tileHeight / 2;
                result.push(item);
            }
        }, this);
        return result;
    },

    loadItems: function() {
        var itemsArray = this.findObjectsByType('item', this.world, 'objectsLayer');
        var itemsObject;

        itemsArray.forEach(function(item) {
            itemsObject = new CAYUMSQUEST.Item(this, item.x, item.y, item.properties.asset, item.properties);
            this.items.add(itemsObject);
        }, this);
    },

    attack: function(player, enemy) {
        this.battle.attack(player, enemy);
        this.battle.attack(enemy, player);

        if (player.body.touching.up) {
            player.y += 25;
        }
        if (player.body.touching.down) {
            player.y -= 25;
        }
        if (player.body.touching.left) {
            player.x += 25;
        }
        if (player.body.touching.right) {
            player.x -= 25;
        }

        this.refreshStats();
    },

    collisionHandler: function(arrows, enemies) {
        arrows.kill();
        enemies.kill();
    },

    killArrows: function(arrows) {
        arrows.kill();
    },

    startMenu: function() {
        this.game.state.start('menu');
    },

    gameOver: function() {
        this.game.state.start('game', true, false, this.currentLevel);
    }
};
