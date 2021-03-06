var CAYUMSQUEST = CAYUMSQUEST || {}; // Define namespace

CAYUMSQUEST.BootState = {

    init: function() {
        this.game.stage.backgroundColor = '#1a1a1a';
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Disable smoothing and enable crisp pixel rendering
        this.game.antialias = false;
        this.game.stage.smoothed = false;
        Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
    },

    preload: function() {
        this.load.image('loading', 'assets/images/interface/loading.png');
    },

    create: function() {
        this.state.start('preload');
    }

};
