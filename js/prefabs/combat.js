var CAYUMSQUEST = CAYUMSQUEST || {}; // Define namespace

CAYUMSQUEST.Battle = function(game) {
    this.game = game;
};

CAYUMSQUEST.Battle.prototype.attack = function(attacker, attacked) {
    var damage = Math.max(0, attacker.data.attack - attacked.data.defense);
    attacked.data.health -= damage;

    if (attacked.refreshHealth) {
        attacked.refreshHealth();
    }

    if (attacked.data.health <= 0) {
        attacked.kill();
    }
};
