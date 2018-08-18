// $color1: rgba(255, 205, 178, 1);
// $color2: rgba(255, 180, 162, 1);
// $color3: rgba(229, 152, 155, 1);
// $color4: rgba(181, 131, 141, 1);
// $color5: rgba(109, 104, 117, 1);
// $color6: rgba(20, 5, 5,1);

// const bgCol = [109, 104, 117];
const bgCol = [20, 5, 5];
const strokeColors = [[181, 131, 141], [255, 180, 162],[229, 152, 155], [255, 205, 178],[229, 152, 155]];

const basicLength = 40;
const lengthVariation = 20;
const dottedLength = 8;
const weightRange = [1,2];
const howMany = 125;
const initialOpacity = 0.9;

let crossers;

const mouseProximity = 20;
const touchedMemoryCapacity = 180;

function setup() {
	const side = min(windowWidth, windowHeight)*0.7;
	createCanvas(side, side);
	background(bgCol);
	colorMode(RGB, 255, 255, 255, 1);
	createCrossers();	
}

function draw() {
	background(...bgCol,0.04);
	noFill();
	stroke(251, 236, 233);
	strokeWeight(1);
	rect(0,0,width-1,height-1);
	crossers.forEach(crosser => {
		crosser.draw();
		crosser.update();
	});
}

function windowResized() {
	const side = min(windowWidth, windowHeight)*0.7;
	resizeCanvas(side, side);
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
		this.touched = 0;
	}


	draw() {
		if (this.inMouseProximity()) {
			this.touched = touchedMemoryCapacity;
		}


		if (this.touched > 0) {
			stroke(250,20,120);
			strokeWeight(this.strokeWeight * 1.5);
			this.touched--;
		} else {
			stroke(...this.color, this.opacity);
			strokeWeight(this.strokeWeight);
		}


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
		this.opacity = initialOpacity + random(0,1-initialOpacity);
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

	inMouseProximity() {
		return dist(this.x,this.y,mouseX,mouseY) <= mouseProximity;
	}
}