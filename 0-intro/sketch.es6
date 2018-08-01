'use strict';
var xoff = 0.00;
let counterX;
let counterXMax;
let counterXDir = 1;
let counterXStep = 1;


function setup() {
	createCanvas(windowWidth, windowHeight);
	// background(245,245,245);
  background(0,0,0);
	colorMode(RGB, 255, 255, 255, 1);
  counterX = width/2;
	counterXMax = width;
}

function draw() {
	if (counterX > counterXMax) {
		counterXDir = -1;
	}
	if (counterX < 0) {
		counterXDir = 1;
	}
	counterX += counterXDir * counterXStep;

	const n1 = noiseVal(); // between 0 and 1
	const n2 = noiseVal();
  const green1 = map(n1,0,1,0,255);
	const green2 = map(n2,0,1,0,255);
	const alpha1 = map(n1,0,1,0.2,0.6);
	const alpha2 = map(n2,0,1,0.2,0.6);
	const posX1 = counterX;
	const posX2 = width - counterX;
  const posY = random(0,height);
  noStroke();
	fill(0, green1, 0, alpha1);
	ellipse(posX1, posY, 30,30);
	fill(0, green2, 0, alpha2);
	ellipse(posX2, posY, 30,30);
}


function noiseVal() {
	xoff += 0.01;
	return noise(xoff);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	background(0,0,0);
	counterX = width/2;
	counterXMax = width;
	xoff = 0;
}