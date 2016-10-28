// Player information will go here so we don't stuff everything into game.js
var CAYUMSQUEST = CAYUMSQUEST || {};

CAYUMSQUEST.Player = function(state, x, y, data) {
    Phaser.Sprite.call(this, state.game, x, y, 'player');

    // Setting context for arguments
    this.state = state;
    this.data = data;
    this.game = state.game;
    this.anchor.setTo(0.5);

    // Walking animations(animation name, frames, frames per second, autoplay)
    this.animations.add('down', [0, 2], 6, false); // Spritesheet animates from frame 0-2
    this.animations.add('up', [3, 5], 6, false); // Spritesheet animates from frame 3-5
    this.animations.add('left', [6, 8], 6, false); // Spritesheet animates from frame 6-8
    this.animations.add('right', [9, 11], 6, false); // Spritesheet animates from frame 9-11

    // Enable physics for collision, velocity etc.
    this.game.physics.arcade.enable(this);
};

CAYUMSQUEST.Player.prototype = Object.create(Phaser.Sprite.prototype);
CAYUMSQUEST.Player.prototype.constructor = CAYUMSQUEST.Player;
CAYUMSQUEST.Player.prototype.collectItem = function(item) {

    if (item.data.isQuestItem) {
        this.data.speed += item.data.speed ? item.data.speed : 0;
        this.data.items.push(item);
        this.checkQuestCompletion(item);
        this.state.refreshStats();
    } else {
        this.data.health += item.data.health ? item.data.health : 0;
        this.data.attack += item.data.attack ? item.data.attack : 0;
        this.data.defense += item.data.defense ? item.data.defense : 0;
        this.data.gold += item.data.gold ? item.data.gold : 0;
        this.data.hasBow += item.data.hasBow ? item.data.hasBow : 0;
        this.state.refreshStats();
    }

    if (this.data.health > 100) {
        this.data.health = 100;
        this.state.refreshStats();
    }

    item.kill();
};

CAYUMSQUEST.Player.prototype.checkQuestCompletion = function(item) {
    var i = 0;

    while (i < this.data.quests.length) {
        if (this.data.quests[i].questCode == item.data.questCode) {
            this.data.quests[i].questCompleted = true;

            this.style = {
                font: "18px bitmap",
                fill: "#fff",
                boundsAlignH: "center",
                boundsAlignV: "middle"
            };

            this.bar = this.game.add.graphics();
            this.bar.beginFill(0x000000, 0.25);
            this.bar.drawRect(0, 0, this.game.width, 100);
            this.bar.fixedToCamera = true;

            this.text = this.game.add.text(0, 200, this.data.quests[i].questName, this.style);
            this.text.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
            this.text.fixedToCamera = true;
            this.text.setTextBounds(0, 0, this.game.width, 100);

            this.game.time.events.add(3000, this.bar.destroy, this.bar);
            this.game.time.events.add(3000, this.text.destroy, this.text);
            console.log(this.data.quests[i].questName);
            break;
        }
        i++;
    }
};
