var CAYUMSQUEST = CAYUMSQUEST || {}; // Define namespace

CAYUMSQUEST.GameState = {

    init: function(currentLevel) {
        this.currentLevel = currentLevel ? currentLevel : 'nWorld';
        this.game.physics.arcade.gravity.y = 0;

        // Define the controls
        this.wasd = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
        };
    },

    create: function() {
        // Particle emitter for arrows
        this.emitter = this.game.add.emitter(0, 0, 1);
        this.emitter.makeParticles('arrow');

        // Add arrows group
        this.arrows = this.game.add.group();
        this.arrows.enableBody = true;
        this.arrows.physicsBodyType = Phaser.Physics.ARCADE;
        this.arrows.createMultiple(100, 'arrow');
        this.arrows.setAll('checkWorldBounds', true);
        this.arrows.setAll('outOfBoundsKill', true);
        this.fireRate = 1000;
        this.nextFire = 0;

        // Add enemies group
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.vulnerable = null;

        // Music
        this.gameSound = this.game.add.audio('gameMusic');
        this.gameSound.loop = true;
        this.gameSound.volume = 0.1;
        this.gameSound.play();

        // Set event triggers
        this.triggers = {
            scrollOne: 0,
            scrollTwo: 0,
        };

        // Container for children
        this.scrollObject = {};

        // Add mobile controls plugin
        this.game.mobileControls = this.game.plugins.add(Phaser.Plugin.mobileControls);

        // Load the world
        this.loadWorld();
    },

    update: function() {
        // Set collision and overlap handlers
        this.game.physics.arcade.collide(this.enemies, this.collisionLayer);
        this.game.physics.arcade.collide(this.player, this.collisionLayer);
        this.game.physics.arcade.collide(this.player, this.npcs);
        this.game.physics.arcade.collide(this.player, this.enemies, this.attack, null, this);
        this.game.physics.arcade.collide(this.arrows, this.collisionLayer, this.killArrows, null, this);
        this.game.physics.arcade.overlap(this.arrows, this.enemies, this.collisionHandler, null, this);
        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
        this.game.physics.arcade.overlap(this.player, this.portals, this.teleport, null, this);

        // Player can't pass world edges
        this.player.body.collideWorldBounds = true;

        // Fire in direction of mouse pointer
        if (this.game.input.activePointer.isDown) {
            this.fire();
        }

        // Camera for smartphones: avoids constantly re-drawing the screen every pixel of movement
        if (!this.game.device.desktop) {
            var camera = this.game.camera;
            var player = this.player;

            var horizontalEdge = player.x - camera.x;
            var verticalEdge = player.y - camera.y;

            if (horizontalEdge < this.cameraDeadzone.left || horizontalEdge > this.cameraDeadzone.right || verticalEdge < this.cameraDeadzone.top || verticalEdge > this.cameraDeadzone.bottom) {
                var cameraCenter = {
                    x: camera.x + (camera.width / 2),
                    y: camera.y + (camera.height / 2)
                };
                var difference = Phaser.Point.subtract(player, cameraCenter);
                camera.x += difference.x * 1.8;
                camera.y += difference.y * 1.8;
            }
        }

        this.movement();
        this.enemyHandler();
        this.npcHandler();
        this.checkTrigger();
    },

    checkTrigger: function() {
        if (this.triggers.scrollOne == 1) {
            this.scrollObject.scrollOne.visible = true;
            this.triggers.scrollOne++;
        }

        if (this.triggers.scrollTwo == 1) {
            this.scrollObject.scrollTwo.visible = true;
            this.triggers.scrollTwo++;
        }
    },

    movement: function() {
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.speed = this.player.data.speed;

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.A) || this.player.buttonsPressed.left) {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.F)) {
                this.player.body.velocity.x = -this.speed * 5; // F for FAST!
            } else {
                this.player.body.velocity.x = -this.speed;
            }
            this.player.direction = 3;
            this.player.animations.play('left');
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D) || this.player.buttonsPressed.right) {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.F)) {
                this.player.body.velocity.x = this.speed * 5; // F for FAST!
            } else {
                this.player.body.velocity.x = this.speed;
            }
            this.player.direction = 4;
            this.player.animations.play('right');
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.W) || this.player.buttonsPressed.up) {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.F)) {
                this.player.body.velocity.y = -this.speed * 5; // F for FAST!
            } else {
                this.player.body.velocity.y = -this.speed;
            }
            this.player.direction = 2;
            this.player.animations.play('up');
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S) || this.player.buttonsPressed.down) {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.F)) {
                this.player.body.velocity.y = this.speed * 5; // F for FAST!
            } else {
                this.player.body.velocity.y = this.speed;
            }
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

    teleport: function(player, portal) {
        player.x = portal.data.x;
        player.y = portal.data.y;
    },

    fire: function() {
        if (this.game.time.now > this.nextFire && this.arrows.countDead() > 0 && this.player.data.hasBow === 1) {
            this.nextFire = this.game.time.now + this.fireRate;
            this.arrow = this.arrows.getFirstDead();
            this.arrow.data.attack = 12; // Arrow damage value
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
                this.game.physics.arcade.moveToObject(enemy, this.player, enemy.data.speed);
                this.enemyDirection(enemy);
            }
        }, this);
    },

    enemyDirection: function(enemy) {
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
        player = this.player;

        if (!npc) {
            return;
        }

        this.npcs.forEachAlive(function(npc) {
            if (npc.visible && npc.inCamera) {
                this.game.physics.arcade.moveToObject(npc, this.player, npc.data.speed);
                this.npcDirection(npc);

                if (this.game.physics.arcade.distanceBetween(player, npc) < 50) {
                    this.dialogueTextStyle = {
                        font: "8px Press Start 2P",
                        fill: "#e5e5e5",
                        wordWrap: true,
                        wordWrapWidth: 300
                    };

                    this.dialogueText = this.game.add.text(npc.x, npc.y - 55, npc.data.dialogue, this.dialogueTextStyle);
                    this.dialogueText.stroke = "#000000";
                    this.dialogueText.strokeThickness = 2;
                    this.dialogueText.anchor.setTo(0.5);
                    this.game.time.events.add(1000, this.dialogueText.destroy, this.dialogueText);

                    if (npc.data.name === "Villager" && this.triggers.scrollOne === 0) {
                        this.triggers.scrollOne = 1;
                    }

                    if (npc.data.name === "Fisherman Dylan" && this.triggers.scrollTwo === 0) {
                        this.triggers.scrollTwo = 1;
                    }
                }
            }

        }, this);
    },

    npcDirection: function(npc) {
        if (npc.body.velocity.x < 0 && npc.body.velocity.x <= -Math.abs(npc.body.velocity.y)) { // Absolute distance between two values
            npc.animations.play('left');
        } else if (npc.body.velocity.x > 0 && npc.body.velocity.x >= Math.abs(npc.body.velocity.y)) {
            npc.animations.play('right');
        } else if (npc.body.velocity.y < 0 && npc.body.velocity.y <= -Math.abs(npc.body.velocity.x)) {
            npc.animations.play('up');
        } else {
            npc.animations.play('down');
        }
    },

    loadWorld: function() {
        // Create world from tiled layers
        this.world = this.add.tilemap(this.currentLevel);
        this.world.addTilesetImage('tileset', 'tileset');
        this.backgroundLayer = this.world.createLayer('backgroundLayer');
        this.collisionLayer = this.world.createLayer('collisionLayer');
        this.foregroundLayer = this.world.createLayer('foregroundLayer');
        this.foregroundLayerTwo = this.world.createLayer('foregroundLayerTwo');
        this.treeTopsLayer = this.world.createLayer('treeTopsLayer');
        this.backgroundLayer.renderSettings.enableScrollDelta = false;
        this.game.world.sendToBack(this.backgroundLayer);
        this.game.world.bringToTop(this.arrows);
        this.world.setCollisionBetween(1, 10000, true, 'collisionLayer');
        this.collisionLayer.resizeWorld();

        // Player data
        var playerData = {
            items: [],
            quests: [{
                questName: 'Found a pair of running boots',
                questCode: 'getBoots',
                questCompleted: false
            }, {
                questName: 'Found a bow',
                questCode: 'getBow',
                questCompleted: false
            }, {
                questName: 'Found the first scroll',
                questCode: 'getFirstScroll',
                questCompleted: false
            }, {
                questName: 'Found the second scroll',
                questCode: 'getSecondScroll',
                questCompleted: false
            }],
            health: 50,
            attack: 10,
            defense: 5,
            speed: 50,
            hasBow: 0
        };

        // Create player
        this.player = new CAYUMSQUEST.Player(this, 150, 150, playerData);
        this.player.anchor.setTo(0.5, 0.5);
        this.player.direction = 0;
        this.add.existing(this.player);

        // Set player camera for mobile devices
        var distanceFromEdge = 128;
        this.cameraDeadzone = new Phaser.Rectangle(distanceFromEdge, distanceFromEdge, this.game.camera.width - (distanceFromEdge * 2), this.game.camera.height - (distanceFromEdge * 2));
        this.game.camera.focusOn(this.player);

        // Set player camera for desktop
        if (this.game.device.desktop) {
            this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
        }

        // Group of items
        this.items = this.add.group();

        // Group of enemies
        this.enemies = this.add.group();

        // Group of npcs
        this.npcs = this.add.group();

        // Group of portals
        this.portals = this.add.group();

        // Battle reference
        this.battle = new CAYUMSQUEST.Battle(this.game);

        this.loadItems();
        this.loadEnemies();
        this.loadNpcs();
        this.loadPortals();
        this.game.world.bringToTop(this.treeTopsLayer);
        this.initInterface();

        for (var i = 0; i < this.items.children.length; i++) {
            if (this.items.children[i].key === "scroll") {
                this.items.children[i].visible = false;
                this.scrollObject[this.items.children[i].data.i] = this.items.children[i];
            }
        }
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

        this.game.add.tween(player.scale)
            .to({
                x: 1.2,
                y: 1.2
            }, 50)
            .to({
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

        // Health icon
        this.healthIcon = this.add.sprite(30, 30, 'heart');
        this.healthIcon.fixedToCamera = true;

        // Health value text
        this.healthLabel = this.add.text(55, 30, this.player.data.health, style);
        this.healthLabel.fixedToCamera = true;
        this.healthLabel.stroke = "#000000";
        this.healthLabel.strokeThickness = 2;

        // Speed icon
        this.speedIcon = this.add.sprite(90, 30, 'boots');
        this.speedIcon.fixedToCamera = true;

        // Speed value text
        this.speedLabel = this.add.text(110, 30, this.player.data.speed, style);
        this.speedLabel.fixedToCamera = true;
        this.speedLabel.stroke = "#000000";
        this.speedLabel.strokeThickness = 2;

        // Quest icon
        this.questIcon = this.add.sprite(this.game.width - 35, 20, 'scroll');
        this.questIcon.fixedToCamera = true;

        // Style for quest backdrop
        this.overlay = this.add.bitmapData(this.game.width, this.game.height);
        this.overlay.ctx.fillStyle = '#1a1a1a';
        this.overlay.ctx.fillRect(0, 0, this.game.width, this.game.height);

        // Add group for quest hud
        this.questHudGroup = this.add.group();
        this.questHudGroup.y = this.game.height;

        // Add quest backdrop
        this.questHud = new Phaser.Sprite(this.game, 0, 0, this.overlay);
        this.questHud.fixedToCamera = true;
        this.questHud.alpha = 0.5;
        this.questHudGroup.add(this.questHud);

        // Quest descriptions
        this.questDescription = new Phaser.Text(this.game, 50, 50, '', questStyle);
        this.questDescription.fixedToCamera = true;
        this.questHudGroup.add(this.questDescription);


        this.questHud.inputEnabled = true;
        this.questHud.events.onInputDown.add(this.hideQuests, this);

        this.questIcon.inputEnabled = true;
        this.questIcon.events.onInputDown.add(this.showQuests, this);
    },

    showQuests: function() {
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

            if (enemy.properties.name == "Wolf") {
                enemiesObject.animations.add('down', [0, 2], 10, true);
                enemiesObject.animations.add('left', [3, 5], 10, true);
                enemiesObject.animations.add('right', [6, 8], 10, true);
                enemiesObject.animations.add('up', [9, 11], 10, true);
            } else if (enemy.properties.name == "Ramin") {
                enemiesObject.animations.add('down', [0, 3], 6, true);
                enemiesObject.animations.add('left', [0, 3], 6, true);
                enemiesObject.animations.add('right', [0, 3], 6, true);
                enemiesObject.animations.add('up', [0, 3], 6, true);
            }

        }, this);
    },

    loadNpcs: function() {
        var npcsArray = this.findObjectsByType('npc', this.world, 'objectsLayer');
        var npcsObject;

        npcsArray.forEach(function(npc) {
            npcsObject = new CAYUMSQUEST.Npcs(this, npc.x, npc.y, npc.properties.asset, npc.properties);
            this.npcs.add(npcsObject);
            npcsObject.animations.add('down', [0], 1, true);
            npcsObject.animations.add('left', [1], 1, true);
            npcsObject.animations.add('right', [2], 1, true);
            npcsObject.animations.add('up', [3], 1, true);
        }, this);
    },

    loadPortals: function() {
        var portalsArray = this.findObjectsByType('portal', this.world, 'objectsLayer');
        var portalsObject;

        portalsArray.forEach(function(portal) {
            portalsObject = new CAYUMSQUEST.Portals(this, portal.x, portal.y, portal.properties.asset, portal.properties);
            this.portals.add(portalsObject);
        }, this);
    },

    attack: function(player, enemy) {
        if ((this.game.time.now - this.vulnerable > 500) || this.vulnerable === null) {
            this.battle.attack(player, enemy);
            this.battle.attack(enemy, player);

            this.game.add.tween(enemy.scale)
                .to({
                    x: 1.2,
                    y: 1.2
                }, 50)
                .to({
                    x: 1,
                    y: 1
                }, 100)
                .start();

            this.game.add.tween(enemy)
                .to({
                    tint: 0xf44b42
                }, 50)
                .to({
                    tint: 0xffffff
                }, 100)
                .start();

            /* Temporary fix for knockback, player is overlapping collisionLayer every time
               for some reason but the difference in coordinates makes it so character
               doesn't clip through things anymore */

            if (player.body.touching.up) {
                player.y += 25;
                if (this.game.physics.arcade.overlap(this.player, this.collisionLayer)) {
                    player.y -= 16;
                }
            }

            if (player.body.touching.down) {
                player.y -= 25;
                if (this.game.physics.arcade.overlap(this.player, this.collisionLayer)) {
                    player.y += 16;
                }
            }

            if (player.body.touching.left) {
                player.x += 25;
                if (this.game.physics.arcade.overlap(this.player, this.collisionLayer)) {
                    player.x -= 16;
                }
            }

            if (player.body.touching.right) {
                player.x -= 25;
                if (this.game.physics.arcade.overlap(this.player, this.collisionLayer)) {
                    player.x += 16;
                }
            }

            if (player.data.health <= 0) {
                this.gameOver();
            }

            this.vulnerable = this.game.time.now;

            // Sound effect for combat collision
            this.soundHit = this.game.add.audio('hit');
            this.soundHit.volume = 0.5;
            this.soundHit.play();

            // We want to see the updated stats after combat
            this.refreshStats();
        }
    },

    killArrows: function(arrows) {
        arrows.kill();
    },

    collisionHandler: function(arrows, enemies) {
        this.attack(arrows, enemies);
        arrows.kill();
    },

    gameOver: function() {
        this.game.state.start('game', true, false, this.currentLevel);
    }

};
