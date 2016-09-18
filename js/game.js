// Initialise Phaser
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'gameDiv');

// Add all of the states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

// Start the boot state
game.state.start('boot');
