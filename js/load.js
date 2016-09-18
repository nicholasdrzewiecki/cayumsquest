var loadState = {

    preload: function() {

        // Load labels for loading state:
        var loadingLabel = game.add.text(game.world.centerX, game.world.centerY - 100, 'Loading', {
            font: '30px Arial',
            fill: '#222229'
        });
        loadingLabel.anchor.setTo(0.5, 0.5);

        // Loading bar:
        var progressBar = game.add.sprite(game.world.centerX, game.world.centerY + 100, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);

        // Load images:
        game.load.image('tileset', 'assets/tiles/tileset.png'); // Map tileset
        game.load.tilemap('map', 'assets/tiles/map.json', null, Phaser.Tilemap.TILED_JSON); // Map json data
        game.load.image('enemy', 'assets/images/enemy.png');
        game.load.image('deathParticle', 'assets/images/deathParticle.png');


        // Load player spritesheets:
        game.load.spritesheet('player', 'assets/images/spritesheet.png', 14, 32);

        /* Future audio:
        game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);
        game.load.audio('coin', ['assets/coin.ogg', 'assets/coin.mp3']);
        game.load.audio('dead', ['assets/dead.ogg', 'assets/dead.mp3']);
        Future music: game.load.audio('music', ['assets/audio/music.ogg', 'assets/audio/music.mp3']);
        */
    },

    create: function() {
        game.state.start('menu'); // Load menu state when load state is finished:
    }

};
