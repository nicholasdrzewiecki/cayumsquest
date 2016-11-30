// Enemy information will go here so we don't have a massive game.js file
var CAYUMSQUEST = CAYUMSQUEST || {};

CAYUMSQUEST.Portals = function(state, x, y, key, data) {
    Phaser.Sprite.call(this, state.game, x, y, key);

    this.state = state;
    this.data = Object.create(data);
    this.game = state.game;
    this.anchor.setTo(0.5);

    this.data.x = +this.data.x;
    this.data.y = +this.data.y;

    this.game.physics.arcade.enable(this);
    this.body.immovable = true;
};

CAYUMSQUEST.Portals.prototype = Object.create(Phaser.Sprite.prototype);

CAYUMSQUEST.Portals.prototype.constructor = CAYUMSQUEST.Portals;
