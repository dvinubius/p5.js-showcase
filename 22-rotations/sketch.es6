// $color1: rgba(219, 43, 57, 1);
// $color2: rgba(41, 51, 92, 1);
// $color3: rgba(243, 167, 18, 1);
// $color4: rgba(240, 206, 160, 1);
// $color5: rgba(83, 77, 65, 1);

// const bgCol = [41, 51, 92];
const bgCol = [240, 206, 160];
const strokeCol = [41, 51, 92];
const fillCol = [219, 43, 57];


let creationCounter = 1;

let bigR = 500;
let rotation = 0;
let rotationInc = -0.01;
let rotationObj = 0;
let rotationIncObj = 0.1;
let lengthInc = 2;
let opacityDec = 0.0008;
let initialOpacity = 0.2; 
let decoObjects = [];
let creationRareness = 7;


function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(RGB, 255, 255, 255, 1);
	rectMode(CENTER);
	smooth();
}

function draw() {
	if (creationCounter % creationRareness === 1) {
		createDecoObj();
	}

	// --- Draw 
	translate(width/2,height/2);
	background(bgCol);

	rotate(rotation);

	const rotStep = TWO_PI/decoObjects.length;
	decoObjects.forEach((obj,index) => {		
		obj.decoDraw();
		obj.update();
	});


	// ---- Update state
	const lastIndex = decoObjects.length - 1;
	if (decoObjects[lastIndex].opacity <= 0) {
		decoObjects.splice(lastIndex, 1);
	}

	rotation -= rotationInc;
	creationCounter += 1;
}


function createDecoObj() {
	const rad = bigR / 50;
	const obj = new DecoObject(
		rad,
		rad,
		initialOpacity,
		rotationObj
	);
	decoObjects.push(obj);
	rotationObj += rotationIncObj;
}

class DecoObject {
	constructor(w, h, op, rot) {
		this.width = w;
		this.height = h;
		this.opacity = op;
		this.rotation = rot;
	}

	decoDraw() {
		push();
			rotate(this.rotation);
			fill(...fillCol, this.opacity);
			stroke(...strokeCol, min(this.opacity, 0.3));
			rect(
				0, 
				0, 
				this.width, 
				this.height
			);
		pop();
	}

	update() {
		this.opacity -= opacityDec;
		this.width += lengthInc;
		this.height += lengthInc;
	}
}

function windowResized() {
	createCanvas(windowWidth, windowHeight);
	decoObjects = [];
	buildDeco();
}