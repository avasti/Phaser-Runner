var game = new Phaser.Game(1000, 700, Phaser.AUTO, 'gameDiv');

game.global = {
	score: 0
};

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('boot');