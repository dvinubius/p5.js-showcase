// $color1: rgba(220, 255, 253, 1);
// $color2: rgba(82, 255, 238, 1);
// $color3: rgba(79, 180, 119, 1);
// $color4: rgba(63, 102, 52, 1);
// $color5: rgba(52, 85, 17, 1);
// color6: rgba(190,20,20,1);

// const bgCol = [220, 255, 253];
const bgCol = [52, 85, 17];
const strokeCol = [190,20,20];
const fillCol = [82, 255, 238];


let bigR = 250;
let rotation = 0;
let rotationInc = 0.01;
let iterations = 160;
let decoObjects = [];
const radVariationFactorMax = 1.61;
const radVariationFactorMin = 1/1.61;
const radVariationInc = 0.01;
let radVariationFactor = 1.61;
let radVariationDirection = 1;



function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(RGB, 255, 255, 255, 1);
	rectMode(CENTER);
	smooth();

	buildDeco();
	background(bgCol);
}

function draw() {

	background(bgCol);

	translate(width/2,height/2);

	// --- Draw along big circle

	rotate(rotation);

	stroke(...strokeCol, 0.1);
	// noFill();
	fill(...fillCol, 0.1);

	decoObjects.forEach((obj,index) => {
		push();
			translate(obj.x, obj.y);
			rotate(rotation*1.61*index/decoObjects.length*2);
			rect(
				0, 
				0, 
				obj.width*radVariationFactor, 
				obj.height*radVariationFactor
			);
		pop();
	});

	// radVariationFactor += radVariationDirection*radVariationInc;
	// if (radVariationFactor >= radVariationFactorMax) {
	// 	radVariationDirection = -1;
	// } else if (radVariationFactor <= radVariationFactorMin) {
	// 	radVariationDirection = 1;
	// }
	rotation -= rotationInc;
}


function buildDeco() {
	const step = TWO_PI/(iterations/2);
	for (let i = 0; i < iterations; i++) {
		const vx = cos(i*step);
		const vy = sin(i*step);
		const dist = bigR * i/iterations;
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

class DecoObject {
	constructor(x, y, w, h, op) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.opacity = op;
	}
}

function windowResized() {
	createCanvas(windowWidth, windowHeight);
	decoObjects = [];
	buildDeco();
}