// Enemy information will go here so we don't have a massive game.js file
var CAYUMSQUEST = CAYUMSQUEST || {};

CAYUMSQUEST.Npcs = function(state, x, y, key, data) {
    Phaser.Sprite.call(this, state.game, x, y, key);

    this.state = state;
    this.data = Object.create(data);
    this.game = state.game;
    this.anchor.setTo(0.5);

    this.npcNameStyle = {
        font: "8pt bitmap",
        fill: "#f2f2f2",
    };

    this.npcName = this.game.add.text(this.x, this.y - 25, this.data.name, this.npcNameStyle);
    this.npcName.setShadow(1, 1, 'rgba(0,0,0,0.8)', 1);
    this.npcName.anchor.setTo(0.5);

    this.game.physics.arcade.enable(this);
    this.body.immovable = true;
};

CAYUMSQUEST.Npcs.prototype = Object.create(Phaser.Sprite.prototype);

CAYUMSQUEST.Npcs.prototype.constructor = CAYUMSQUEST.Npcs;
