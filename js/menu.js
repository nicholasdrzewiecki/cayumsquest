var menuState = {

    create: function() {
        // Game information:
        var nameLabel = game.add.text(game.world.centerX, -50, 'Cayums Quest', {
            font: '48pt VT323',
            fill: '#ffffff'
        });
        nameLabel.anchor.setTo(0.5, 0.5);
        game.add.tween(nameLabel).to({
                y: 80
            }, 1000).easing(Phaser.Easing.Bounce.Out)
            .start();

        // How to start the adventure:
        var startLabel = game.add.text(game.world.centerX, game.world.height - 80,
            'Press the up arrow key to begin your journey', {
                font: '18pt VT323',
                fill: '#ffffff'
            });
        startLabel.anchor.setTo(0.5, 0.5);
        game.add.tween(startLabel).to({
                angle: -2
            }, 500).to({
                angle: 2
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
