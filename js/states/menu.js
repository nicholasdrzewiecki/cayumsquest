var CAYUMSQUEST = CAYUMSQUEST || {};

CAYUMSQUEST.MenuState = {

    create: function() {
        this.game.stage.backgroundColor = "#1a1a1a";

        // Style for title font
        this.instrStyle = {
            font: "12pt Press Start 2P",
            fill: "#f2f2f2",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        // Style for title font
        this.startStyle = {
            font: "12pt Press Start 2P",
            fill: "#f2f2f2",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        this.menuSound = this.game.add.audio('menuMusic');
        this.menuSound.loop = true;
        this.menuSound.volume = 0.1;
        this.menuSound.play();

        this.legendSplash = this.game.add.image(0, 20, 'legend');
        this.legendSplash.scale.set(0.33);
        this.legendSplash.centerX = this.game.width / 2;

        this.instructions = this.game.add.text(0, 0, "WASD to Move", this.instrStyle);
        this.instructions.setTextBounds(0, this.game.height * 0.75 , this.game.width);

        this.startText = this.game.add.text(0, 0, "Press Up or Click to Start", this.startStyle);
        this.startText.setTextBounds(0, this.game.height * 0.85 , this.game.width);

        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.upKey.onDown.addOnce(this.start, this);
        this.game.input.onTap.add(this.start, this);
    },

    start: function() {
        this.game.state.start('game');
        this.menuSound.stop();
    },

};
