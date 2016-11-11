var CAYUMSQUEST = CAYUMSQUEST || {};

CAYUMSQUEST.GameState = {

    init: function(currentLevel) {
        this.currentLevel = currentLevel ? currentLevel : 'nWorld';
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

        // Ranged attack
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
        this.game.physics.arcade.collide(this.player, this.npcs);
        this.game.physics.arcade.collide(this.player, this.enemies, this.attack, null, this);
        this.game.physics.arcade.collide(this.arrows, this.collisionLayer, this.killArrows, null, this);
        this.game.physics.arcade.overlap(this.arrows, this.enemies, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);

        this.player.body.collideWorldBounds = true;

        // Enemy movement
        this.enemies.forEach(function(enemy) {
            if (!enemy.alive) { // If there are no enemies alive, do not execute the rest of this statement (enemy movement)
                return;
            }
            this.game.physics.arcade.moveToObject(enemy, this.player, enemy.speed);
        }, this);

        // Fire in direction of mouse pointer
        if (this.game.input.activePointer.isDown) {
            this.fire();
        }

        this.movement();
        this.enemyHandler();
        this.npcHandler();
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
        this.player.kill();
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        this.emitter.start(true, 600, null, 15);
        this.game.time.events.add(1000, this.gameOver, this);
    },

    enemyHandler: function() {
        var enemy = this.enemies.getFirstExists();

        if (!enemy) {
            return;
        }

        this.enemies.forEachAlive(function(enemy) {
            if (enemy.visible && enemy.inCamera) {
                this.game.physics.arcade.moveToObject(enemy, this.player, enemy.speed);
                this.enemyMovementHandler(enemy);
            }
        }, this);
    },

    enemyMovementHandler: function(enemy) {
        enemy.animations.add('down', [0, 2], 10, true); // Spritesheet animates from frame 0-2
        enemy.animations.add('left', [3, 5], 10, true); // Spritesheet animates from frame 3-5
        enemy.animations.add('right', [6, 8], 10, true); // Spritesheet animates from frame 6-8
        enemy.animations.add('up', [9, 11], 10, true); // Spritesheet animates from frame 9-11

        if (enemy.body.velocity.x < 0 && enemy.body.velocity.x <= -Math.abs(enemy.body.velocity.y)) { // Absolute distance between two values
            enemy.animations.play('left');
        } else if (enemy.body.velocity.x > 0 && enemy.body.velocity.x >= Math.abs(enemy.body.velocity.y)) {
            enemy.animations.play('right');
        } else if (enemy.body.velocity.y < 0 && enemy.body.velocity.y <= -Math.abs(enemy.body.velocity.x)) {
            enemy.animations.play('up');
        } else {
            enemy.animations.play('down');
        }
    },

    npcHandler: function() {
        var npc = this.npcs.getFirstExists();

        if (!npc) {
            return;
        }

        this.npcs.forEachAlive(function(npc) {
            if (npc.visible && npc.inCamera) {
                this.npcPositionHandler(npc);
            }
        }, this);
    },

    npcPositionHandler: function(npc) {
        npc.animations.add('down', [0], 1, true);
        npc.animations.add('left', [1], 1, true);
        npc.animations.add('right', [2], 1, true);
        npc.animations.add('up', [3], 1, true);

        if (this.player.x < npc.x) { // Absolute distance between two values
            npc.animations.play('left');
        } else if (this.player.x > npc.x) {
            npc.animations.play('right');
        } else if (this.player.y < npc.y) {
            npc.animations.play('up');
        } else {
            npc.animations.play('down');
        }
    },

    loadWorld: function() {
        this.world = this.add.tilemap(this.currentLevel);
        this.world.addTilesetImage('tileset', 'tileset');
        this.backgroundLayer = this.world.createLayer('backgroundLayer');
        this.collisionLayer = this.world.createLayer('collisionLayer');
        this.foregroundLayer = this.world.createLayer('foregroundLayer');
        this.world.setCollisionBetween(1, 10000, true, 'collisionLayer');
        this.backgroundLayer.renderSettings.enableScrollDelta = false;
        this.game.world.sendToBack(this.backgroundLayer);
        this.collisionLayer.resizeWorld();

        // Create player
        var playerData = {
            items: [],
            quests: [{
                questName: 'Found a pair of running boots',
                questCode: 'getBoots',
                questCompleted: false
            }, {
                questName: 'Found a bow ',
                questCode: 'getBow',
                questCompleted: false
            }, {
                questName: 'You have found the first scroll.\nSomebody may be interested in this item.',
                questCode: 'getScroll',
                questCompleted: false
            }],
            health: 50,
            attack: 10,
            defense: 5,
            speed: 50,
            hasBow: 0
        };

        this.player = new CAYUMSQUEST.Player(this, 150, 150, playerData);
        this.player.anchor.setTo(0.5, 0.5);
        this.player.direction = 0;
        this.game.camera.follow(this.player);
        this.add.existing(this.player);

        // Group of items
        this.items = this.add.group();

        // Group of enemies
        this.enemies = this.add.group();

        // Group of npcs
        this.npcs = this.add.group();

        this.battle = new CAYUMSQUEST.Battle(this.game);

        this.loadItems();

        this.loadEnemies();

        this.loadNpcs();

        this.initInterface();

        this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.healthRegen, this);
    },

    healthRegen: function() {
        if (this.player.data.health >= 50) {
            this.player.data.health = 49;
        }
        this.player.data.health += 1;
        this.refreshStats();
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
        this.game.add.tween(player.scale).to({
                x: 1.2,
                y: 1.2
            }, 50).to({
                x: 1,
                y: 1
            }, 100)
            .start();
    },

    initHud: function() {
        var style = {
            font: "12px Press Start 2P",
            fill: "#e5e5e5",
        };

        var questStyle = {
            font: '8px Press Start 2P',
            fill: '#e5e5e5'
        };

        this.healthIcon = this.add.sprite(30, 30, 'heart');
        this.healthIcon.fixedToCamera = true;

        this.healthLabel = this.add.text(55, 30, this.player.data.health, style);
        this.healthLabel.fixedToCamera = true;
        this.healthLabel.stroke = "#000000";
        this.healthLabel.strokeThickness = 2;

        this.speedIcon = this.add.sprite(90, 30, 'boots');
        this.speedIcon.fixedToCamera = true;

        this.speedLabel = this.add.text(110, 30, this.player.data.speed, style);
        this.speedLabel.fixedToCamera = true;
        this.speedLabel.stroke = "#000000";
        this.speedLabel.strokeThickness = 2;

        this.questIcon = this.add.sprite(this.game.width - 35, 20, 'scroll');
        this.questIcon.fixedToCamera = true;

        this.overlay = this.add.bitmapData(this.game.width, this.game.height);
        this.overlay.ctx.fillStyle = '#1a1a1a';
        this.overlay.ctx.fillRect(0, 0, this.game.width, this.game.height);

        this.questHudGroup = this.add.group();
        this.questHudGroup.y = this.game.height;

        this.questHud = new Phaser.Sprite(this.game, 0, 0, this.overlay);
        this.questHud.fixedToCamera = true;
        this.questHud.alpha = 0.5;
        this.questHudGroup.add(this.questHud);

        this.questDescription = new Phaser.Text(this.game, 50, 50, '', questStyle);
        this.questDescription.fixedToCamera = true;
        this.questHudGroup.add(this.questDescription);

        this.questHud.inputEnabled = true;
        this.questHud.events.onInputDown.add(this.hideQuests, this);

        this.questIcon.inputEnabled = true;
        this.questIcon.events.onInputDown.add(this.showQuests, this);
    },

    showQuests: function() {
        this.hudBlocked = true;

        this.showPanelTween = this.add.tween(this.questHudGroup);
        this.showPanelTween.to({
            y: 0
        }, 100);

        this.showPanelTween.onComplete.add(function() {
            var questText = 'Quests:\n\n';

            this.player.data.quests.forEach(function(quest) {
                questText += quest.questName + (quest.questCompleted ? ' has been completed' : '') + '\n\n';
            }, this);

            this.questDescription.text = questText;
        }, this);

        this.showPanelTween.start();
    },

    hideQuests: function() {
        this.hudBlocked = false;
        this.questHudGroup.y = this.game.height;
        this.questDescription.text = '';
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

    loadEnemies: function() {
        var enemiesArray = this.findObjectsByType('enemy', this.world, 'objectsLayer');
        var enemiesObject;

        enemiesArray.forEach(function(enemy) {
            enemiesObject = new CAYUMSQUEST.Enemy(this, enemy.x, enemy.y, enemy.properties.asset, enemy.properties);
            this.enemies.add(enemiesObject);
        }, this);
    },

    loadNpcs: function() {
        var npcsArray = this.findObjectsByType('npc', this.world, 'objectsLayer');
        var npcsObject;

        npcsArray.forEach(function(npc) {
            npcsObject = new CAYUMSQUEST.Npcs(this, npc.x, npc.y, npc.properties.asset, npc.properties);
            this.npcs.add(npcsObject);
        }, this);
    },

    attack: function(player, enemy) {
        this.battle.attack(player, enemy);
        this.battle.attack(enemy, player);

        this.game.add.tween(enemy.scale).to({
                x: 1.2,
                y: 1.2
            }, 50).to({
                x: 1,
                y: 1
            }, 100)
            .start();

        this.game.add.tween(enemy).to({
                tint: 0xf44b42
            }, 50).to({
                tint: 0xffffff
            }, 100)
            .start();

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

        if (player.data.health <= 0) {
            this.gameOver();
        }

        this.soundHit = this.game.add.audio('hit');
        this.soundHit.volume = 0.5;
        this.soundHit.play();

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
