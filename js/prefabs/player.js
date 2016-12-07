var CAYUMSQUEST = CAYUMSQUEST || {}; // Define namespace

CAYUMSQUEST.Player = function(state, x, y, data) {
    Phaser.Sprite.call(this, state.game, x, y, 'player');

    this.state = state;
    this.data = Object.create(data);
    this.game = state.game;
    this.anchor.setTo(0.5);

    // Walking animations
    this.animations.add('down', [0, 2], 6, false);
    this.animations.add('up', [3, 5], 6, false);
    this.animations.add('left', [6, 8], 6, false);
    this.animations.add('right', [9, 11], 6, false);

    // Health bar, health regeneration, and refreshing the health bar
    this.healthBar = new Phaser.Sprite(state.game, this.x, this.y, 'healthBar');
    this.game.add.existing(this.healthBar);
    this.healthBar.anchor.setTo(0.5);
    this.game.time.events.loop(Phaser.Timer.SECOND * 1, this.healthRegeneration, this);
    this.refreshHealth();

    this.game.physics.arcade.enable(this);
    this.game.physics.arcade.enable(this.healthBar);
};

CAYUMSQUEST.Player.prototype = Object.create(Phaser.Sprite.prototype);

CAYUMSQUEST.Player.prototype.constructor = CAYUMSQUEST.Player;

CAYUMSQUEST.Player.prototype.collectItem = function(item) {
    if (item.data.isQuestItem) {
        this.data.items.push(item);
        this.checkQuestCompletion(item);
        this.state.refreshStats();
        this.refreshHealth();
    }

    this.data.health += item.data.health ? item.data.health : 0;
    this.data.attack += item.data.attack ? item.data.attack : 0;
    this.data.defense += item.data.defense ? item.data.defense : 0;
    this.data.speed += item.data.speed ? item.data.speed : 0;
    this.data.hasBow += item.data.hasBow ? item.data.hasBow : 0;

    this.state.refreshStats();
    this.refreshHealth();
    item.kill();
};

CAYUMSQUEST.Player.prototype.checkQuestCompletion = function(item) {
    var i = 0;

    while (i < this.data.quests.length) {

        if (this.data.quests[i].questCode == item.data.questCode) {
            this.data.quests[i].questCompleted = true;

            this.style = {
                font: "8px Press Start 2P",
                fill: "#e5e5e5",
                boundsAlignH: "center",
                boundsAlignV: "middle"
            };

            this.text = this.game.add.text(0, 100, this.data.quests[i].questName, this.style);
            this.text.stroke = "#000000";
            this.text.strokeThickness = 2;
            this.text.fixedToCamera = true;
            this.text.setTextBounds(0, 0, this.game.width, this.game.height);

            this.game.time.events.add(3000, this.text.destroy, this.text);
            break;

        }

        i++;
    }

};

CAYUMSQUEST.Player.prototype.refreshHealth = function() {
    this.healthBar.scale.setTo(this.data.health, 5);
};

CAYUMSQUEST.Player.prototype.update = function() {
    this.healthBar.x = this.x;
    this.healthBar.y = this.y - 25;
    this.healthBar.body.velocity = this.body.velocity;
    this.refreshHealth();
};

CAYUMSQUEST.Player.prototype.healthRegeneration = function() {
    if (this.data.health >= 50) {
        this.data.health = 49;
    }

    this.data.health += 1;
    this.state.refreshStats();
};
