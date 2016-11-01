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

    this.healthBar = new Phaser.Sprite(state.game, this.x, this.y, 'healthBar');
    this.game.add.existing(this.healthBar);
    this.healthBar.anchor.setTo(0.5);
    this.refreshHealth();

    this.game.physics.arcade.enable(this);
    this.game.physics.arcade.enable(this.healthBar);
    this.body.immovable = true;
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
};

CAYUMSQUEST.Enemy.prototype.kill = function() {
    Phaser.Sprite.prototype.kill.call(this);
    this.healthBar.kill();
};
