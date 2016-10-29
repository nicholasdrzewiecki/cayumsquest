// Combat information will go here so we don't have a massive game.js file
var CAYUMSQUEST = CAYUMSQUEST || {};

CAYUMSQUEST.Battle = function(game) {
    // Setting context for arguments
    this.game = game;
};

CAYUMSQUEST.Battle.prototype.attack = function(attacker, attacked) {
    var damage = Math.max(0, attacker.data.attack - attacked.data.defense);

    attacked.data.health -= damage;
    attacked.refreshHealth();

    if (attacked.data.health <= 0) {
        attacked.kill();
    }
};
