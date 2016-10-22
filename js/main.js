var CAYUMSQUEST = CAYUMSQUEST || {};

CAYUMSQUEST.dimensions = CAYUMSQUEST.getGameLandscapeDimensions(900, 540);

// Arguments are width, height and renderer between canvas or webgl
CAYUMSQUEST.game = new Phaser.Game(CAYUMSQUEST.dimensions.width, CAYUMSQUEST.dimensions.height, Phaser.WEBGL);

CAYUMSQUEST.game.state.add('boot', CAYUMSQUEST.BootState);
CAYUMSQUEST.game.state.add('preload', CAYUMSQUEST.LoadState);
CAYUMSQUEST.game.state.add('menu', CAYUMSQUEST.MenuState);
CAYUMSQUEST.game.state.add('game', CAYUMSQUEST.GameState);

CAYUMSQUEST.game.state.start('boot');
