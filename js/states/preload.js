var CAYUMSQUEST = CAYUMSQUEST || {};

CAYUMSQUEST.LoadState = {
    preload: function() {
        // Turn off antialiasing to disable blurriness
        this.game.antialias = false;
        this.game.stage.smoothed = false;

        this.progressBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'progressBar');
        this.progressBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.progressBar);

        // General assets
        this.load.image('tileset', 'assets/images/tilesheet.png?v=1'); // Map tileset
        this.load.image('tiles', 'assets/images/tiles.png?v=1'); // Map tileset
        this.load.image('healthBar', 'assets/images/healthBar.png?v=1');
        this.load.image('heart', 'assets/images/heart.png?v=1');
        this.load.image('arrow', 'assets/images/arrow.png?v=1');
        this.load.image('bomb', 'assets/images/bomb.png?v=1');
        this.load.image('bow', 'assets/images/bow.png?v=1');

        // Quest items
        this.load.image('boots', 'assets/images/boots.png?v=1');
        this.load.image('scroll', 'assets/images/scroll.png?v=1');

        // Enemies
        this.load.image('wolf', 'assets/images/wolf.png?v=1');

        // Tilemap
        this.load.tilemap('world', 'assets/tiled/world.json?v=1', null, Phaser.Tilemap.TILED_JSON); // Map json data
        this.load.tilemap('nWorld', 'assets/tiled/nWorld.json?v=1', null, Phaser.Tilemap.TILED_JSON); // Map json data

        // Load player spritesheets:
        this.load.spritesheet('player', 'assets/images/spritesheet.png?v=1', 14, 32);

        // Audio
        this.game.load.audio('bgm', ['assets/audio/AmbientKingdom.mp3']);
        this.game.load.audio('hit', ['assets/audio/hit.wav']);
    },

    create: function() {
        this.state.start('menu');
    }
};
