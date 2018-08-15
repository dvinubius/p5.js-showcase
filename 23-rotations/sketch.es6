// $color1: rgba(187, 216, 179, 1);
// $color2: rgba(243, 182, 31, 1);
// $color3: rgba(162, 159, 21, 1);
// $color4: rgba(81, 13, 10, 1);
// $color5: rgba(25, 17, 2, 1);

const bgCol = [25, 17, 2];
const strokeCol = [81, 13, 10];
const fillCol = [243, 182, 31];
const fillCol2 = [162, 159, 21];

let bigR = 400;
let rotation = 0;
let rotationInc = -0.008;
let initialOpacity = 0.1; 
let scaffoldObjects = [];


const staticIterations = 8;

let slider;


function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(RGB, 255, 255, 255, 1);
	rectMode(CENTER);
	smooth();
	createScaffolds();

	slider = createSlider(0, TWO_PI, 0, 0.1);
  slider.position(width*0.1, height*0.1);
  slider.size(width*0.07);
  slider.style('outline', 'none');

  background(bgCol);	
}

function draw() {
	// --- Draw 
	translate(width/2,height/2);
	background(...bgCol, 0.001);

	rotate(rotation);
	rotation -= rotationInc;


	scaffoldObjects.forEach((obj,index) => {
		obj.rotation = (1-index/scaffoldObjects.length)*slider.value();
		obj.decoDraw();
	});	

}

function createScaffolds() {
	scaffoldObjects = [];
	for (let i = 0; i < staticIterations; i++) {
		const rad = 40 + i*50;		
		scaffoldObjects.push(new Scaffold(
			rad,
			initialOpacity,
			0
		));
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

function createCornersRegPoly(cx,cy,rad,sides) {
	const res = [];
	const step = TWO_PI / sides;
	for (let i = 0; i < sides; i++) {
		const x = cos(i*step)*rad;
		const y = sin(i*step)*rad;
		res.push(new Point(x, y));
	}
	return res;
}

class Scaffold {
	constructor(size, opacity, rot) {
		this.scaffold = createCornersRegPoly(0,0,size,3);
		this.size = size;
		this.opacity = opacity;
		this.rotation = rot;
	}

	decoDraw() {
		push();
			rotate(this.rotation);
			fill(...fillCol, this.opacity);
			stroke(...strokeCol, 0.1);
			this.scaffold.forEach( corner => {
					push();
						translate(corner.x, corner.y);
						rotate(rotation*1.61*3.14);
						regPolygon(0,0,this.size/4,3);
						regPolygon(0,0,this.size/12,5);
					pop();
				});			
		pop();
	}
}

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

function windowResized() {
	createCanvas(windowWidth, windowHeight);
	createScaffolds();
	slider.position(width*0.1, height*0.1);
  slider.size(width*0.07);
  background(bgCol);	
}