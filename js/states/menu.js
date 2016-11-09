var CAYUMSQUEST = CAYUMSQUEST || {};

CAYUMSQUEST.MenuState = {

    create: function() {
        this.game.stage.backgroundColor = "#1a1a1a";

        // Style for title font
        this.titleStyle = {
            font: "36px Press Start 2P",
            fill: "#f2f2f2",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        this.titleText = this.game.add.text(0, 0, "Cayum's Quest", this.titleStyle);
        this.titleText.stroke = "#e5e5e5";
        this.titleText.strokeThickness = 2;
        this.titleText.setTextBounds(0, this.game.height / 2, this.game.width);

        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.upKey.onDown.addOnce(this.start, this);
        this.game.input.onTap.add(this.start, this);
    },

    start: function() {
        this.game.state.start('game');
    },

};
