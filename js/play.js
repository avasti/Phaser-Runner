var EnemiesCount = 4;
var EnemiesFastCount = 2;
var DiamondsCount = 6;
var ChestWin = 1;

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
        
        this.player2 = game.add.sprite(40, game.world.centerY, 'player2');
		game.physics.arcade.enable(this.player2); 
		this.player2.anchor.setTo(0.5, 0.5);
		this.player2.body.gravity.y = 500;
		this.player2.animations.add('right', [1, 2], 8, true);
		this.player2.animations.add('left', [3, 4], 8, true);
        
        this.diamonds = game.add.group();
        this.diamonds.enableBody = true; 
        this.diamonds.createMultiple(6, 'diamond');
        
        this.addDiamond();
       
        this.enemies = game.add.group();
		this.enemies.enableBody = true;
		this.enemies.createMultiple(4, 'enemy');
        
        this.addEnemy();
        
        this.enemiesfast = game.add.group();
		this.enemiesfast.enableBody = true;
		this.enemiesfast.createMultiple(2, 'enemyfast');
        
        this.addEnemyFast();
        
        this.chests = game.add.group();
        this.chests.enableBody = true;
        this.chests.createMultiple(1, 'chest');
        
        this.addChest();

		this.coin = game.add.sprite(200, 580, 'coin');
		game.physics.arcade.enable(this.coin); 
		this.coin.anchor.setTo(0.5, 0.5);
        
		this.scoreLabel = game.add.text(30, 30, 'score: 0', { font: '18px Arial', fill: '#ffffff' });
        
        this.intro = game.add.text(50, 100, 'Phaser Runner', { font: '30px Arial', fill: '#ffffff' });
        
        this.tutorial = game.add.text(50, 150, 'Arrow up to jump', { font: '30px Arial', fill: '#ffffff' });


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
        game.physics.arcade.overlap(this.player, this.diamonds, this.takeDiamond, null, this);
        game.physics.arcade.overlap(this.player, this.chests, this.takeChest, null, this);
		game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        game.physics.arcade.collide(this.player, this.layer);
        
        game.physics.arcade.overlap(this.player2, this.enemies, this.playerDie, null, this);
        game.physics.arcade.overlap(this.player2, this.enemiesfast, this.playerDie, null, this);
        game.physics.arcade.overlap(this.player2, this.diamonds, this.takeDiamond, null, this);
        game.physics.arcade.overlap(this.player2, this.chests, this.takeChest, null, this);
		game.physics.arcade.overlap(this.player2, this.coin, this.takeCoin, null, this);
        game.physics.arcade.collide(this.player2, this.layer);
        
        game.physics.arcade.collide(this.enemies, this.layer);
        game.physics.arcade.collide(this.enemiesfast, this.layer);
                
		if (!this.player.inWorld) {
			this.playerDie();
		}
        
        if (!this.player2.inWorld) {
			this.playerDie();
		}
        
        this.scoreLabel.x = this.player.position.x;
		this.movePlayer();
        this.movePlayer2();

		if (this.nextEnemy < game.time.now) {
			var start = 4000, end = 1000, score = 100;
			var delay = Math.max(start - (start-end)*game.global.score/score, end);
            
			this.nextEnemy = game.time.now + delay;
		}
	},

	movePlayer: function() {
		if (this.cursor.left.isDown) {
			this.player.body.velocity.x = -200;
			this.player.animations.play('left');
            
		}
		else if (this.cursor.right.isDown) {
			this.player.body.velocity.x = 200;
			this.player.animations.play('right');
		    game.camera.follow(this.player);
        }
		else {
			this.player.body.velocity.x = 0;
 			this.player.animations.stop(); 
	        this.player.frame = 0; 
		}
		
		if ((this.cursor.up.isDown) && this.player.body.onFloor()) {
			this.jumpSound.play();
			this.player.body.velocity.y = -320;
		}
	},
    
    movePlayer2: function() {
		if (this.wasd.left.isDown) {
			this.player2.body.velocity.x = -200;
			this.player2.animations.play('left');
            
		}
		else if (this.wasd.right.isDown) {
			this.player2.body.velocity.x = 200;
			this.player2.animations.play('right');
		    game.camera.follow(this.player);
        }
		else {
			this.player2.body.velocity.x = 0;
 			this.player2.animations.stop(); 
	        this.player2.frame = 0; 
		}
		
		if ((this.wasd.up.isDown) && this.player2.body.onFloor()) {
			this.jumpSound.play();
			this.player2.body.velocity.y = -320;
		}
	},

	addEnemy: function() {
        var posX = [2700,2800,3900,4000,5000];
        
		for (var i = 0; i < EnemiesCount; i++) {
             
        enemy = this.enemies.create(posX[i],450,'enemy');
            
	    enemy.body.gravity.y = 500;
	    enemy.body.bounce.x = 1;
	    enemy.body.velocity.x = 100 * Phaser.Math.randomSign();
	    enemy.checkWorldBounds = true;
	    enemy.outOfBoundsKill = true;	
        }
	},
    
    addEnemyFast: function() {
        var FastposX = [1800,3800];
        
        for (var i = 0; i < EnemiesFastCount; i++) {
            
        enemyfast = this.enemiesfast.create(FastposX[i],450,'enemyfast');    
        
		enemyfast.body.gravity.y = 500;
		enemyfast.body.bounce.x = 1;
		enemyfast.body.velocity.x = 200 * Phaser.Math.randomSign();
		enemyfast.checkWorldBounds = true;
		enemyfast.outOfBoundsKill = true;
        }    
	},
    
    addDiamond: function(diamantes) {    
         var DiamondposX = [320,510,1212,1410,1478,1538,2000];
        
         for (var i = 0; i < DiamondsCount; i++) {
         diamond = this.diamonds.create(DiamondposX[i],450,'diamond'); 
         }
    },
    
    addChest: function() {
        var ChestposX = [4160];
        
         for (var i = 0; i < ChestWin; i++) {
         chest = this.chests.create(ChestposX[i],450,'chest'); 
         }    
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
    
    takeDiamond: function(player, diamond) {
        game.global.score += 5; 
        
        this.emitter.x = this.scoreLabel.x;
		this.emitter.y = this.scoreLabel.y;
		this.emitter.start(true, 600, null, 15);
        this.scoreLabel.text = 'score: ' + game.global.score;
        this.coinSound.play();
        
        diamond.kill();
    },
    
    takeChest: function(player, chest) {
        this.game.state.start('menu');
        this.bsoSound.stop();
        this.mensaje = game.add.text(50, 150, 'LEVEL COMPLETED', { font: '50px Arial', fill: '#ffffff' }); 
     },

	updateCoinPosition: function() {
        var coinPosition = [
			{x: 988, y: 550}, {x: 1248, y: 555},
			{x: 2110, y: 480},{x: 3100, y: 600},
            {x: 3200, y: 600},{x: 3300, y: 600},
            {x: 3400, y: 600}
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
		game.state.start('menu');
	},
    
    trampa: function() {
		this.player.kill();
        this.deadSound.play();
		this.emitter.x = this.player.x;
		this.emitter.y = this.player.y;
		this.emitter.start(true, 600, null, 15);
        this.bsoSound.stop();
        
		game.time.events.add(1000, this.startMenu, this);
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
        this.map.setTileIndexCallback(7, this.trampa, this);
	},
};