var CAYUMSQUEST = CAYUMSQUEST || {};

CAYUMSQUEST.BootState = {

    init: function() {
        this.game.stage.backgroundColor = '#1a1a1a';
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Turn off antialiasing to disable blurriness
        this.game.antialias = false;
        this.game.stage.smoothed = false;
        Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
    },

    preload: function() {
        this.load.image('progressBar', 'assets/images/loadingBar.png');
    },

    create: function() {
        this.state.start('preload');
    }

};
