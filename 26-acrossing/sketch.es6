// $color1: rgba(255, 205, 178, 1);
// $color2: rgba(255, 180, 162, 1);
// $color3: rgba(229, 152, 155, 1);
// $color4: rgba(181, 131, 141, 1);
// $color5: rgba(109, 104, 117, 1);
// $color6: rgba(36, 15, 4,1);

// const bgCol = [109, 104, 117];
const bgCol = [255, 205, 178];
const strokeColors = [[36, 15, 4],[181, 131, 141], [109, 104, 117],[255, 180, 162],[229, 152, 155], [255, 180, 162],[229, 152, 155]];

const basicLength = 60;
const lengthVariation = 30;
const weightRange = [1,2];
const howMany = 65;
const initialOpacity = 0.7;
const dottedLength = 16;

let crossers;

function setup() {
	createCanvas(windowWidth*0.7, windowHeight*0.6);
	background(bgCol);
	colorMode(RGB, 255, 255, 255, 1);

	createCrossers();	
}

function draw() {
	crossers.forEach(crosser => {
		crosser.draw();
		crosser.update();
	});
}

function windowResized() {
	resizeCanvas(windowWidth*0.6, windowHeight*0.6);
	background(bgCol);
	createCrossers();
}

function reset() {
	background(bgCol);
	createCrossers();
}

function createCrossers() {
	crossers = [];
	for (let i = 0; i < howMany; i++) {
		crossers.push(new Crosser(random(width), random(height)));
	}
}


class Crosser {
	constructor(x,y) {
		this.scaled = 1;
		this.x = x;
		this.y = y;
		this.vx = random([-this.scaled,this.scaled]);
		this.vy = random([-1,1]);
		this.remaining = basicLength + floor(random(-lengthVariation,lengthVariation+1));
		this.strokeWeight = random(weightRange);
		this.opacity = initialOpacity + random(0,1-initialOpacity);
		this.color = random(strokeColors);
	}


	draw() {
		stroke(...this.color, this.opacity);
		strokeWeight(this.strokeWeight);
		if (this.remaining >= dottedLength) {
			line(this.x, this.y, this.x + this.vx, this.y + this.vy);
		} else if (this.remaining % 3 === 0) {
			noFill();
			point(this.x, this.y);
		}
	}

	update() {
		this.x = this.x + this.vx;
		this.y = this.y + this.vy;
		this.remaining -= 1;

		if (this.remaining <= 0) {
			this.goAgain();
		}
	}

	goAgain() {
		const distBack = floor(random(5,19));
		this.x -= this.vx*distBack;
		this.y -= this.vy*distBack;
		
		if (random(1) > 0.5) {
			this.vx = -this.vx;
		} else {
			this.vy = -this.vy;
		}

		this.remaining = basicLength + floor(random(-lengthVariation,lengthVariation+1));
		this.strokeWeight = random(weightRange);
		this.opacity = (random(0,1) > 0.95) ? 0 
																			 : (initialOpacity + random(0,1-initialOpacity));
		this.color = random(strokeColors);
		



		if (this.x < 0) {
			this.vx = 1*this.scaled;
		}
		if (this.x > width) {
			this.vx = -1*this.scaled;
		}
		if (this.y < 0) {
			this.vy = 1;
		}
		if (this.y > height) {
			this.vy = -1;
		}

		this.update();
		this.update();
		this.update();
	}
}