var menuState = {

    create: function() {
        // Game information:
        var nameLabel = "";
        nameLabel = game.add.text(0, 0, 'CAYUMS QUEST', {
            font: '48pt VT323',
            fill: '#ffffff',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });
        nameLabel.setTextBounds(0, 0, 800, 50); // Change 800 to whatever canvas width is
        game.add.tween(nameLabel).to({
                y: 80
            }, 1000).easing(Phaser.Easing.Bounce.Out)
            .start();

        // How to start the adventure:
        var startLabel = game.add.text(0, 400,
            'Press the up arrow key to begin your journey', {
                font: '18pt VT323',
                fill: '#ffffff',
                boundsAlignH: "center",
                boundsAlignV: "middle"
            });
        startLabel.setTextBounds(0, 0, 800, 100); // Change 800 to whatever canvas width is
        game.add.tween(startLabel).to({
                alpha: 0.3
            }, 500).to({
                alpha: 1
            }, 500).loop()
            .start();

        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.addOnce(this.start, this);
    },

    start: function() {
        // Start the actual game
        game.state.start('play');
    },
};
