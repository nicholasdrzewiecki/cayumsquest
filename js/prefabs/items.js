// Item information will go here so we don't have a massive game.js file
var CAYUMSQUEST = CAYUMSQUEST || {};

// Data is an object that will contain different Item properties such as health and damage
CAYUMSQUEST.Item = function(state, x, y, key, data) {
    Phaser.Sprite.call(this, state.game, x, y, key); // Not every item will be the same so we will pass key

    // Setting context for arguments
    this.state = state;
    this.data = data;
    this.game = state.game;
    this.anchor.setTo(0.5);

    // Data for stats
    this.data.health = +this.data.health;
    this.data.attack = +this.data.attack;
    this.data.hasBow = +this.data.hasBow;
    this.data.speed = +this.data.speed;

    // Enable physics for collision, velocity etc.
    this.game.physics.arcade.enable(this);
};

CAYUMSQUEST.Item.prototype = Object.create(Phaser.Sprite.prototype);
CAYUMSQUEST.Item.prototype.constructor = CAYUMSQUEST.Item;
