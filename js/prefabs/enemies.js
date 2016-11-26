// Enemy information will go here so we don't have a massive game.js file
var CAYUMSQUEST = CAYUMSQUEST || {};

CAYUMSQUEST.Enemy = function(state, x, y, key, data) {
    Phaser.Sprite.call(this, state.game, x, y, key);

    this.state = state;
    this.data = Object.create(data);
    this.game = state.game;
    this.anchor.setTo(0.5);

    this.data.attack = +this.data.attack;
    this.data.defense = +this.data.defense;
    this.data.health = +this.data.health;
    this.data.speed = +this.data.speed;

    this.healthBar = new Phaser.Sprite(state.game, this.x, this.y, 'healthBar');
    this.game.add.existing(this.healthBar);
    this.healthBar.anchor.setTo(0.5);
    this.healthBar.bringToTop();
    this.refreshHealth();

    this.enemyNameStyle = {
        font: "8px Press Start 2P",
        fill: "#e5e5e5",
    };

    this.enemyName = this.game.add.text(0, 0, this.data.name, this.enemyNameStyle);
    this.enemyName.stroke = "#000000";
    this.enemyName.strokeThickness = 2;
    this.enemyName.anchor.setTo(0.5);
    this.enemyName.bringToTop();

    this.game.physics.arcade.enable(this);
    this.game.physics.arcade.enable(this.healthBar);
    this.body.immovable = true;
    this.body.velocity.x = 20;
    this.body.velocity.y = 20;
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
};

CAYUMSQUEST.Enemy.prototype = Object.create(Phaser.Sprite.prototype);

CAYUMSQUEST.Enemy.prototype.constructor = CAYUMSQUEST.Enemy;

CAYUMSQUEST.Enemy.prototype.refreshHealth = function() {
    this.healthBar.scale.setTo(this.data.health, 5);
};

CAYUMSQUEST.Enemy.prototype.update = function() {
    this.healthBar.x = this.x;
    this.healthBar.y = this.y - 25;
    this.healthBar.body.velocity = this.body.velocity;

    this.enemyName.x = this.x;
    this.enemyName.y = this.y - 35;
};

CAYUMSQUEST.Enemy.prototype.kill = function() {
    Phaser.Sprite.prototype.kill.call(this);
    this.healthBar.kill();
    this.enemyName.kill();
};
