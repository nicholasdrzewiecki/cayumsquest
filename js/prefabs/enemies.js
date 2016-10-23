// Enemy information will go here so we don't have a massive game.js file
var CAYUMSQUEST = CAYUMSQUEST || {};

CAYUMSQUEST.Enemy = function(state, x, y, key, data) {
    Phaser.Sprite.call(this, state.game, x, y, key);

    // Setting context for arguments
    this.state = state;
    this.data = data;
    this.game = state.game;
    this.anchor.setTo(0.5);

    this.data.attack = +this.data.attack;
    this.data.defense = +this.data.defense;
    this.data.health = +this.data.health;
    this.data.hasBow = +this.data.hasBow;

    this.game.physics.arcade.enable(this);
    this.body.immovable = true;
};

CAYUMSQUEST.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
CAYUMSQUEST.Enemy.prototype.constructor = CAYUMSQUEST.Enemy;
