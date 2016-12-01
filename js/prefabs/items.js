var CAYUMSQUEST = CAYUMSQUEST || {}; // Define namespace

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
};

CAYUMSQUEST.Item.prototype = Object.create(Phaser.Sprite.prototype);

CAYUMSQUEST.Item.prototype.constructor = CAYUMSQUEST.Item;
