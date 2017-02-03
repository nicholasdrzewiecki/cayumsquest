var CAYUMSQUEST = CAYUMSQUEST || {}; // Define namespace

// Pass on dimensions to scale.js
CAYUMSQUEST.dimensions = CAYUMSQUEST.getGameLandscapeDimensions(640, 480);

// Arguments are width, height and renderer between canvas or webgl
CAYUMSQUEST.game = new Phaser.Game(CAYUMSQUEST.dimensions.width, CAYUMSQUEST.dimensions.height, Phaser.CANVAS);

// Add the various game states
CAYUMSQUEST.game.state.add('boot', CAYUMSQUEST.BootState);
CAYUMSQUEST.game.state.add('preload', CAYUMSQUEST.LoadState);
CAYUMSQUEST.game.state.add('menu', CAYUMSQUEST.MenuState);
CAYUMSQUEST.game.state.add('game', CAYUMSQUEST.GameState);

// Start boot state in boot.js
CAYUMSQUEST.game.state.start('boot');
