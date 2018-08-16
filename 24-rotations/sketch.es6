// $color1: rgba(250, 25, 13, 1);
// $color1: rgba(255, 255, 255, 1);
// $color2: rgba(0, 167, 225, 1);
// $color3: rgba(0, 23, 31, 1);
// $color4: rgba(0, 52, 89, 1);
// $color5: rgba(0, 126, 167, 1);

// const bgCol = [220, 255, 253];
const bgCol = [0, 23, 31];
const strokeCol = [250, 25, 13];
const fillCol = [0, 167, 225];


let bigR = 150;
let rotation = 0;
let rotationInc = 0.01;
let iterations = 80;
let decoObjectGroups = [];
let radVariationFactor = 1.61;
const initialOp = 0.2;

let tracking = false;


class Point {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}
}

const sourcePoints = [
	new Point(-300,-400),
	// new Point(350,350),
	new Point(-120, 400),
	new Point(350, -100),
	// new Point(-390,0)
];

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(RGB, 255, 255, 255, 1);
	rectMode(CENTER);
	smooth();
	
	buildDeco();
	updateAllDecoPos(-80,-120);
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
	fill(...fillCol, 0.1);
	
	decoObjectGroups.forEach((g, g_index) => g.forEach((obj,index) => {
		push();
			translate(
				sourcePoints[g_index].x,
				sourcePoints[g_index].y
			);
			translate(obj.x, obj.y);
			rotate(rotation*1.61*(0.3+index/g.length*2));
			fill(...fillCol, obj.opacity);			
			stroke(...strokeCol, obj.opacity);
			rect(
				0, 
				0, 
				obj.width*radVariationFactor, 
				obj.height*radVariationFactor
			);
		pop();
	}));


	rotation -= rotationInc;
}


function buildDeco() {
	sourcePoints.forEach(p => {
		const decoObjects = [];
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
				initialOp*0.05 + map(
					i/(iterations-1), 
					0, 1,
					initialOp*0.95, 0)
			);
			decoObjects.push(obj);
		}
		decoObjectGroups.push(decoObjects);
	});
}

function updateAllDecoPos(currX, currY) {	
	decoObjectGroups.forEach((g,g_index) => g.forEach((obj,index) => {
		const origin = sourcePoints[g_index];
		const groupX = currX - origin.x;
		const groupY = currY - origin.y;
		obj.updateDecoPos(groupX, groupY, index, g.length);
	}));
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

	updateDecoPos(currX, currY, index, total) {
		const diffX = currX - this.initialX;
		const diffY = currY - this.initialY;
		const amount = index/(total-1);
		this.x = this.initialX + amount*diffX;
		this.y = this.initialY + amount*diffY;
	}
}

function mouseMoved() {
	tracking = true;
}

function windowResized() {
	createCanvas(windowWidth, windowHeight);
	decoObjectGroups = [];
	buildDeco();
	updateAllDecoPos(-80,-120);
}