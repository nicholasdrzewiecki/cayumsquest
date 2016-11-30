// Item information will go here so we don't have a massive game.js file
var CAYUMSQUEST = CAYUMSQUEST || {};

// Data is an object that will contain different Item properties such as health and damage
CAYUMSQUEST.Item = function(state, x, y, key, data) {
    Phaser.Sprite.call(this, state.game, x, y, key); // Not every item will be the same so we will pass the key

    this.state = state;
    this.data = Object.create(data);
    this.game = state.game;
    this.anchor.setTo(0.5);

    this.data.health = +this.data.health;
    this.data.attack = +this.data.attack;
    this.data.speed = +this.data.speed;
    this.data.hasBow = +this.data.hasBow;
    this.data.i = data.i;
    this.game.physics.arcade.enable(this);
    console.log(this.data, data);
};

CAYUMSQUEST.Item.prototype = Object.create(Phaser.Sprite.prototype);

CAYUMSQUEST.Item.prototype.constructor = CAYUMSQUEST.Item;
