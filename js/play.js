var playState = {
    
	create: function() { 
		this.cursor = game.input.keyboard.createCursorKeys();
		game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
		this.wasd = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D)
            
		};
        
        game.world.setBounds(0, 0, 4480, 704);
        this.createWorld();
		game.global.score = 0;
	
		this.player = game.add.sprite(40, game.world.centerY, 'player');
		game.physics.arcade.enable(this.player); 
		this.player.anchor.setTo(0.5, 0.5);
		this.player.body.gravity.y = 500;
		this.player.animations.add('right', [1, 2], 8, true);
		this.player.animations.add('left', [3, 4], 8, true);
       
        this.enemies = game.add.group();
		this.enemies.enableBody = true;
		this.enemies.createMultiple(10, 'enemy');
        
        this.enemiesfast = game.add.group();
		this.enemiesfast.enableBody = true;
		this.enemiesfast.createMultiple(1, 'enemyfast');

		this.coin = game.add.sprite(60, 140, 'coin');
		game.physics.arcade.enable(this.coin); 
		this.coin.anchor.setTo(0.5, 0.5);

		this.scoreLabel = game.add.text(30, 30, 'score: 0', { font: '18px Arial', fill: '#ffffff' });	

		this.emitter = game.add.emitter(0, 0, 15);
		this.emitter.makeParticles('pixel');
		this.emitter.setYSpeed(-150, 150);
		this.emitter.setXSpeed(-150, 150);
		this.emitter.gravity = 0;
        
        game.add.tween(this.coin).to({angle: -20}, 500).to({angle:20}, 500).loop().start();

		this.jumpSound = game.add.audio('jump');
		this.coinSound = game.add.audio('coin');
		this.deadSound = game.add.audio('dead');
        this.bsoSound = game.add.audio('bso'); 
        
        this.bsoSound.play();
		
		this.nextEnemy = 0;
	},

	update: function() {
		game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
        game.physics.arcade.overlap(this.player, this.enemiesfast, this.playerDie, null, this);
		game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        game.physics.arcade.collide(this.player, this.layer);
        game.physics.arcade.collide(this.enemies, this.layer);
        game.physics.arcade.collide(this.enemiesfast, this.layer);
        
		if (!this.player.inWorld) {
			this.playerDie();
		}
        this.scoreLabel.x = this.player.position.x;
		this.movePlayer();

		if (this.nextEnemy < game.time.now) {
			var start = 4000, end = 1000, score = 100;
			var delay = Math.max(start - (start-end)*game.global.score/score, end);
            
			  
			this.addEnemy();
            this.addEnemyFast();
			this.nextEnemy = game.time.now + delay;
		}
	},

	movePlayer: function() {
		if (this.cursor.left.isDown || this.wasd.left.isDown) {
			this.player.body.velocity.x = -200;
			this.player.animations.play('left');
            
		}
		else if (this.cursor.right.isDown || this.wasd.right.isDown) {
			this.player.body.velocity.x = 200;
			this.player.animations.play('right');
            
            //game.camera.x += 4;
            game.camera.x = this.player.body.position.x;
		}
		else {
			this.player.body.velocity.x = 0;
 			this.player.animations.stop(); 
	        this.player.frame = 0; 
		}
		
		if ((this.cursor.up.isDown || this.wasd.up.isDown) && this.player.body.onFloor()) {
			this.jumpSound.play();
			this.player.body.velocity.y = -320;
		}
	},

	addEnemy: function() {
		var enemy = this.enemies.getFirstDead();
		if (!enemy) {
			return;
		}

		enemy.anchor.setTo(0.5, 1);
		enemy.reset(game.world.centerX, 0);
		enemy.body.gravity.y = 500;
		enemy.body.bounce.x = 1;
		enemy.body.velocity.x = 100 * Phaser.Math.randomSign();
		enemy.checkWorldBounds = true;
		enemy.outOfBoundsKill = true;
	},
    
    addEnemyFast: function() {
		var enemyfast = this.enemiesfast.getFirstDead();
		if (!enemyfast) {
			return;
		}

		enemyfast.anchor.setTo(0.5, 1);
		enemyfast.reset(game.world.centerX, 0);
		enemyfast.body.gravity.y = 500;
		enemyfast.body.bounce.x = 1;
		enemyfast.body.velocity.x = 200 * Phaser.Math.randomSign();

		enemyfast.checkWorldBounds = true;
		enemyfast.outOfBoundsKill = true;
	},

	takeCoin: function(player, coin) {
		game.global.score += 5;
        
        game.add.tween(this.scoreLabel.scale).to({x:1.3, y:1.3}, 50).to({x:1, y:1}, 150).start();
		this.scoreLabel.scale.setTo(0, 0);
		game.add.tween(this.scoreLabel.scale).to({x: 1, y:1}, 300).start();
        
        this.emitter.x = this.scoreLabel.x;
		this.emitter.y = this.scoreLabel.y;
		this.emitter.start(true, 600, null, 15);
		this.scoreLabel.text = 'score: ' + game.global.score;
		this.updateCoinPosition();
		this.coinSound.play();
        
		game.add.tween(this.player.scale).to({x:1.3, y:1.3}, 50).to({x:1, y:1}, 150).start();
		this.coin.scale.setTo(0, 0);
		game.add.tween(this.coin.scale).to({x: 1, y:1}, 300).start();
	},

	updateCoinPosition: function() {
		var coinPosition = [
			{x: 140, y: 60}, {x: 360, y: 60}, 
			{x: 60, y: 140}, {x: 440, y: 140}, 
			{x: 130, y: 300}, {x: 370, y: 300} 
		];

		for (var i = 0; i < coinPosition.length; i++) {
			if (coinPosition[i].x === this.coin.x) {
				coinPosition.splice(i, 1);
			}
		}
        
		var newPosition = coinPosition[game.rnd.integerInRange(0, coinPosition.length-1)];
		this.coin.reset(newPosition.x, newPosition.y);
	},

	playerDie: function() {
		if (!this.player.alive) {
			return;
		}
		
		this.player.kill();

		this.deadSound.play();
		this.emitter.x = this.player.x;
		this.emitter.y = this.player.y;
		this.emitter.start(true, 600, null, 15);
        this.bsoSound.stop();
        
		game.time.events.add(1000, this.startMenu, this);
	},

	startMenu: function() {
        align: "center"
		game.state.start('menu');
	},
        
	createWorld: function() {     
        console.log("MAP");
        this.map = game.add.tilemap('map');
        this.map.addTilesetImage('tileset');
        this.layer = this.map.createLayer('Tile Layer 1');
       
        //Suelo
        this.map.setCollision(1);
        //Caja
        this.map.setCollision(2);
        //Cofre
        this.map.setCollision(3);
        //Diamante Rojo
        //this.map.setCollision(4);
        //Diamante azul
        //this.map.setCollision(5);
        //Rocas
        this.map.setCollision(6);
        //Trampa
        this.map.setCollision(7);
    
        //this.map.setTileIndexCallback(8, this.trap, this);
     

	},
    
    trap: function() {
        console.log("Muerte");
        //this.playerDie();
    }
};