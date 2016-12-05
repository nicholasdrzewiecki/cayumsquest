var CAYUMSQUEST = CAYUMSQUEST || {}; // Define namespace

CAYUMSQUEST.LoadState = {

    preload: function() {
        this.progressBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loading');
        this.progressBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.progressBar);

        // General assets
        this.load.image('tileset', 'assets/images/tiles/tileset.png'); // Map tileset
        this.load.image('healthBar', 'assets/images/icons/healthbar.png');
        this.load.image('doorTop', 'assets/images/icons/doortop.png');
        this.load.image('doorBottom', 'assets/images/icons/doorbottom.png');
        this.load.image('blackTeleport', 'assets/images/icons/blackteleport.png');
        this.load.image('stairTeleport', 'assets/images/icons/stairteleport.png');
        this.load.image('heart', 'assets/images/icons/heart.png');
        this.load.image('arrow', 'assets/images/icons/arrow.png');
        this.load.image('bow', 'assets/images/icons/bow.png');

        // Title Screen
        this.load.image('logo', 'assets/images/interface/logo.jpg');

        // Quest items
        this.load.image('boots', 'assets/images/icons/boots.png');
        this.load.image('scroll', 'assets/images/icons/scroll.png');

        // Enemies
        this.load.spritesheet('wolf', 'assets/images/enemies/wolf.png', 15, 17);
        this.load.spritesheet('ramin', 'assets/images/enemies/ramin.png', 48, 80);
        this.load.spritesheet('hapoo', 'assets/images/enemies/hapoo.png', 32, 34);
        this.load.spritesheet('darkLord', 'assets/images/enemies/darklord.png', 17, 30);
        this.load.spritesheet('goblin', 'assets/images/enemies/goblin.png', 19, 26);
        this.load.spritesheet('goblinboss', 'assets/images/enemies/goblinBoss.png', 38, 52);
        this.load.spritesheet('skeleton', 'assets/images/enemies/skeleton.png', 19, 33);
        this.load.spritesheet('illusion', 'assets/images/enemies/illusion.png', 27, 37);

        // Npcs
        this.load.spritesheet('villager', 'assets/images/npcs/villager.png', 17, 30);
        this.load.spritesheet('fisherman', 'assets/images/npcs/fisherman.png', 17, 30);
        this.load.spritesheet('farmer', 'assets/images/npcs/farmer.png', 17, 30);
        this.load.spritesheet('greenFemale', 'assets/images/npcs/greenfemale.png', 17, 30);
        this.load.spritesheet('purpleFemale', 'assets/images/npcs/purplefemale.png', 17, 30);

        // Tilemap
        this.load.tilemap('nWorld', 'assets/tiled/nWorld.json', null, Phaser.Tilemap.TILED_JSON); // Map json data

        // Load player spritesheets:
        this.load.spritesheet('player', 'assets/images/npcs/player.png', 19, 30);

        // Audio
        this.game.load.audio('hit', ['assets/audio/hit.wav']);
        this.game.load.audio('menuMusic', ['assets/audio/MenuMusic.mp3']);
        this.game.load.audio('gameMusic', ['assets/audio/GameMusic.mp3']);
    },

    create: function() {
        this.state.start('menu');
    }

};
