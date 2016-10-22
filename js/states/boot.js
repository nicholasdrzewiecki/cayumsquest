var CAYUMSQUEST = CAYUMSQUEST || {};

CAYUMSQUEST.BootState = {
    init: function() {
        this.game.stage.backgroundColor = '#1a1a1a';
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    },

    preload: function() {
        this.load.image('progressBar', 'assets/images/loadingBar.png');
    },

    create: function() {
        this.state.start('preload');
    }
};
