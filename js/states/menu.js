var CAYUMSQUEST = CAYUMSQUEST || {};

CAYUMSQUEST.MenuState = {

    create: function() {
        this.backgroundMusic = this.game.add.audio('bgm');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume -= 0.95;
        this.backgroundMusic.play();

        this.game.stage.backgroundColor = "#1a1a1a";

        // Style for title font
        this.titleStyle = {
            font: "48pt bitmap",
            fill: "#f2f2f2",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        this.titleText = this.game.add.text(0, 0, "Cayum's Quest", this.titleStyle);
        this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        this.titleText.setTextBounds(0, this.game.height / 2, this.game.width);

        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.upKey.onDown.addOnce(this.start, this);
        this.game.input.onTap.add(this.start, this);
    },

    start: function() {
        this.game.state.start('game');
    },

};
