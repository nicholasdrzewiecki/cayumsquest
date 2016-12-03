var CAYUMSQUEST = CAYUMSQUEST || {}; // Define namespace

CAYUMSQUEST.LoadState = {

    preload: function() {
        this.progressBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'progressBar');
        this.progressBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.progressBar);

        // General assets
        this.load.image('tileset', 'assets/images/tileset.png'); // Map tileset
        this.load.image('healthBar', 'assets/images/healthBar.png');
        this.load.image('portal', 'assets/images/portal.png');
        this.load.image('doorTop', 'assets/images/doorTop.png');
        this.load.image('doorBottom', 'assets/images/doorBottom.png');
        this.load.image('blackTele', 'assets/images/blackTele.png');
        this.load.image('stairTele', 'assets/images/stairTele.png');
        this.load.image('heart', 'assets/images/heart.png');
        this.load.image('arrow', 'assets/images/arrow.png');
        this.load.image('bomb', 'assets/images/bomb.png');
        this.load.image('bow', 'assets/images/bow.png');

        // Title Screen
        this.load.image('legend', 'assets/images/LEGEND_8_BIT.jpg');

        // Quest items
        this.load.image('boots', 'assets/images/boots.png');
        this.load.image('scroll', 'assets/images/scroll.png');

        // Enemies
        this.load.spritesheet('dogSpritesheet', 'assets/images/dogSpritesheet.png', 15, 17);
        this.load.spritesheet('raminSpritesheet', 'assets/images/raminSpritesheet.png', 48, 80);
        this.load.spritesheet('hapooSpritesheet', 'assets/images/hapooSpritesheet.png', 44, 50);

        // Npcs
        this.load.spritesheet('npcDefaultSpritesheet', 'assets/images/npcDefaultSpritesheet.png', 17, 30);
        this.load.spritesheet('npcFishermanSpritesheet', 'assets/images/npcFishermanSpritesheet.png', 17, 30);

        // Tilemap
        this.load.tilemap('nWorld', 'assets/tiled/nWorld.json', null, Phaser.Tilemap.TILED_JSON); // Map json data

        // Load player spritesheets:
        this.load.spritesheet('player', 'assets/images/spritesheet.png', 19, 30);

        // Audio
        this.game.load.audio('hit', ['assets/audio/hit.wav']);
        this.game.load.audio('menuMusic', ['assets/audio/MenuMusic.mp3']);
        this.game.load.audio('gameMusic', ['assets/audio/GameMusic.mp3']);
    },

    create: function() {
        this.state.start('menu');
    }

};
