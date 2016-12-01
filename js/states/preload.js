var CAYUMSQUEST = CAYUMSQUEST || {}; // Define namespace

CAYUMSQUEST.LoadState = {

    preload: function() {

        this.progressBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'progressBar');
        this.progressBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.progressBar);

        // General assets
        this.load.image('tileset', 'assets/images/tileset.png?v=1'); // Map tileset
        this.load.image('healthBar', 'assets/images/healthBar.png?v=1');
        this.load.image('portal', 'assets/images/portal.png?v=1');
        this.load.image('heart', 'assets/images/heart.png?v=1');
        this.load.image('arrow', 'assets/images/arrow.png?v=1');
        this.load.image('bomb', 'assets/images/bomb.png?v=1');
        this.load.image('bow', 'assets/images/bow.png?v=1');

        // Title Screen
        this.load.image('legend', 'assets/images/LEGEND_8_BIT.jpg');

        // Quest items
        this.load.image('boots', 'assets/images/boots.png?v=1');
        this.load.image('scroll', 'assets/images/scroll.png?v=1');

        // Enemies
        this.load.spritesheet('dogSpritesheet', 'assets/images/dogSpritesheet.png?v=1', 15, 17);
        this.load.spritesheet('raminSpritesheet', 'assets/images/raminSpritesheet.png', 48, 80);

        // Npcs
        this.load.spritesheet('npcDefaultSpritesheet', 'assets/images/npcDefaultSpritesheet.png?v=1', 17, 30);
        this.load.spritesheet('npcFishermanSpritesheet', 'assets/images/npcFishermanSpritesheet.png?v=1', 17, 30);

        // Tilemap
        this.load.tilemap('nWorld', 'assets/tiled/nWorld.json?v=1', null, Phaser.Tilemap.TILED_JSON); // Map json data

        // Load player spritesheets:
        this.load.spritesheet('player', 'assets/images/spritesheet.png?v=1', 19, 30);

        // Audio
        this.game.load.audio('hit', ['assets/audio/hit.wav']);
        this.game.load.audio('menuMusic', ['assets/audio/MenuMusic.mp3']);
        this.game.load.audio('gameMusic', ['assets/audio/GameMusic.mp3']);

    },

    create: function() {
        this.state.start('menu');
    }

};
