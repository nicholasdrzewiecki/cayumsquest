var CAYUMSQUEST = CAYUMSQUEST || {}; // Define namespace

CAYUMSQUEST.MenuState = {

    create: function() {
        // Game stage default background color
        this.game.stage.backgroundColor = "#1a1a1a";

        // Style for title font
        this.instrStyle = {
            font: "14pt Press Start 2P",
            fill: "#f2f2f2",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        // Style for title font
        this.startStyle = {
            font: "14pt Press Start 2P",
            fill: "#f2f2f2",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        
        // Style for credits
        this.creditStyle = {
            font: "10pt",
            fill: "#f2f2f2",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        // Music for the menu
        this.menuSound = this.game.add.audio('menuMusic');
        this.menuSound.loop = true;
        this.menuSound.volume = 0.1;
        this.menuSound.play();

        // Splash art for our logo
        this.legendSplash = this.game.add.image(0, 20, 'legend');
        this.legendSplash.scale.set(0.33);
        this.legendSplash.centerX = this.game.width / 2;
        this.game.add.tween(this.legendSplash).to({
                alpha: 0.7
            }, 1000).to({
                alpha: 1
            }, 1000).loop().start();

        // Brief game instructions
        this.instructions = this.game.add.text(0, 0, "WASD TO MOVE", this.instrStyle);
        this.instructions.setTextBounds(0, this.game.height * 0.80, this.game.width);

        // How to switch to game state
        this.startText = this.game.add.text(0, 0, "PRESS UP OR CLICK TO START", this.startStyle);
        this.startText.setTextBounds(0, this.game.height * 0.70, this.game.width);
        this.game.add.tween(this.startText).to({
                alpha: 0.3
            }, 500).to({
                alpha: 1
            }, 500).loop().start();
        
        // Credits
        this.credits = this.game.add.text(0, 0, "Game created by Nick Drzewiecki & Dylan Warrington", this.creditStyle);
        this.credits.setTextBounds(0, this.game.height * 0.90, this.game.width);
        this.game.add.tween(this.credits).to({
                alpha: 0.8
            }, 1000).to({
                alpha: 1
            }, 1000).loop().start();

        // Keys to switch to game state
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.upKey.onDown.addOnce(this.start, this);
        this.game.input.onTap.add(this.start, this);
    },

    start: function() {
        this.game.state.start('game');
        this.menuSound.stop();
    },

};
