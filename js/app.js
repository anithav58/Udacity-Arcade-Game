const MULTIPLY_FACTOR = 1.5;

const NUMBER_OF_ENEMIES_BLOCKS = 3;
const MAX_NUMBER_OF_ENEMIES = 6;

let playerTimer;

// Enemies our player must avoid
var Enemy = function(y, speed) {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started

	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = 'images/enemy-bug.png'; //height of the image is 170
	this.x = 0;
	this.y = y * 50;
	this.height = 50;
	this.width = 50;
	this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	if (this.x > ctx.canvas.width) {
		this.x = 0;
	} else {
		this.x = this.x + this.speed + dt;
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
let Player = function() {
	this.sprite = 'images/char-cat-girl.png';
	this.x = 200;
	this.y = 380;
	this.height = 50; //use this to to calculate the position
	this.width = 50;
	this.offsetHeight = 80; //to account for difference in position
	this.offsetWidth = 80;
	this.score = 0;
};
Player.prototype.incrementScore = function() {
	this.score = this.score + 10;
	this.updateScore();
	//add more enemies to increase the difficulty level, MAX ENEMIES = 6
	if (allEnemies.length > MAX_NUMBER_OF_ENEMIES) {
		createEnemies(Math.floor(Math.random() * NUMBER_OF_ENEMIES_BLOCKS));
	}
};
Player.prototype.decrementScore = function() {
	this.score = this.score - 5;
	this.updateScore();
};
Player.prototype.updateScore = function() {
	document.getElementById('score').textContent = this.score;
};
Player.prototype.update = function() {};
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.handleInput = function(key) {
	switch (key) {
		case 'left': {
			if (this.x + this.width > this.offsetWidth) {
				this.x = this.x - this.offsetWidth - this.width / 2;
			}
			break;
		}
		case 'up': {
			if (this.y + this.height < ctx.canvas.height) {
				this.y = this.y - this.offsetHeight;
				if (this.y + this.height < this.offsetHeight) {
					setTimeout(() => {
						this.incrementScore();
						this.reset();
					}, 200);
				}
			}
			break;
		}
		case 'right': {
			if (this.x + this.width + this.offsetWidth < ctx.canvas.width) {
				this.x = this.x + this.offsetWidth + this.width / 2;
			}
			break;
		}
		case 'down': {
			if (this.y + this.height + this.offsetHeight * 3 < ctx.canvas.height) {
				this.y = this.y + this.offsetHeight;
			}
			break;
		}
		default: {
		}
	}
};
Player.prototype.reset = function() {
	this.x = 200;
	this.y = 380;
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];
function createEnemies(enemyCount) {
	for (let i = 1; i <= enemyCount; i++) {
		allEnemies.push(new Enemy(i * MULTIPLY_FACTOR, i * enemyCount));
		//using a multiply factor of 1.5 to place the enemy exactly in center of the block
	}
}

createEnemies(NUMBER_OF_ENEMIES_BLOCKS);
let player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down',
	};

	player.handleInput(allowedKeys[e.keyCode]);
});

//call this method in engine.js
function checkCollisions() {
	allEnemies.forEach(enemy => {
		if (
			player.x < enemy.x + enemy.width &&
			player.x + player.width > enemy.x &&
			player.y < enemy.y + enemy.height &&
			player.y + player.height > enemy.y
		) {
			player.decrementScore();
			player.reset();
		}
	});
}
