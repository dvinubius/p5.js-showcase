// $color1: rgba(220, 255, 253, 1);
// $color1: rgba(255, 255, 255, 1);
// $color2: rgba(0, 167, 225, 1);
// $color3: rgba(0, 23, 31, 1);
// $color4: rgba(0, 52, 89, 1);
// $color5: rgba(0, 126, 167, 1);

// const bgCol = [220, 255, 253];
const bgCol = [0, 23, 31];
const strokeCol = [220, 255, 253];
const fillCol = [0, 167, 225];


let bigR = 250;
let rotation = 0;
let rotationInc = 0.01;
let iterations = 80;
let decoObjects = [];
const radVariationFactorMax = 1.61;
const radVariationFactorMin = 1/1.61;
const radVariationInc = 0.01;
let radVariationFactor = 1.61;
let radVariationDirection = 1;

let tracking = false;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(RGB, 255, 255, 255, 1);
	rectMode(CENTER);
	smooth();

	buildDeco();
	updateAllDecoPos(0,0);
	background(bgCol);
}

function draw() {

	background(...bgCol);

	translate(width/2,height/2);
	
	if (tracking) {
		const currX = mouseX - width/2;
		const currY = mouseY - height/2;
		updateAllDecoPos(currX,currY);
	}

	stroke(...strokeCol, 0.1);
	// noFill();
	fill(...fillCol, 0.2);

	decoObjects.forEach((obj,index) => {
		push();
			translate(obj.x, obj.y);
			rotate(rotation*1.61*(0.3+index/decoObjects.length*2));
			rect(
				0, 
				0, 
				obj.width*radVariationFactor, 
				obj.height*radVariationFactor
			);
			// regPolygon(0,0,obj.width*radVariationFactor, 5);
		pop();
	});

	rotation -= rotationInc;
}


function buildDeco() {
	const step = TWO_PI/iterations;
	for (let i = 0; i < iterations; i++) {
		const vx = cos(i*step);
		const vy = sin(i*step);
		const dist = bigR * (i/iterations);
		const rad = bigR / 1.61 * i/iterations;
		const obj = new DecoObject(
			vx*dist,
			vy*dist,
			rad,
			rad,
			1
		);
		decoObjects.push(obj);
	}
}

function updateAllDecoPos(currX, currY) {	
	decoObjects.forEach((obj,index) => {
		obj.updateDecoPos(currX, currY, index);
	});
}

class DecoObject {
	constructor(x, y, w, h, op) {
		this.initialX = x;
		this.initialY = y;
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.opacity = op;
	}

	updateDecoPos(currX, currY, index) {
		const diffX = currX - this.initialX;
		const diffY = currY - this.initialY;
		const amount = index/(decoObjects.length-1);
		this.x = this.initialX + amount*diffX;
		this.y = this.initialY + amount*diffY;
	}
}

function regPolygon(cx, cy, rad, sides) {
	beginShape();
	const step = TWO_PI / sides;
	for (let i = 0; i <= sides; i++) {
		const x = cos(i*step)*rad;
		const y = sin(i*step)*rad;
		vertex(x, y);
	}
	endShape();
}

function mouseMoved() {
	tracking = true;
}

function windowResized() {
	createCanvas(windowWidth, windowHeight);
	decoObjects = [];
	buildDeco();
	updateAllDecoPos(0,0);
}