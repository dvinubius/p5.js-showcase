let bgCol = [84, 200, 158];
let mouseCol = [230,100,150,.9];
let fader = new Fader(bgCol,
											0, /*maxFadeFactor - how transparent should it be in the end? */
											4 /* decayRate*/);
let applyFade = true;
let skipFrames = 0;
let skipCounter = 0;

const addRadMax = 0;
const minRad = 20;


function setup() {
	createCanvas(windowWidth, windowHeight);
	background(...bgCol);
	colorMode(RGB, 255, 255, 255, 1);
	fader.setMaxAlpha(1);
}

function draw() {
	if (mouseIsPressed) {
		fader.reset();
		if (skipCounter === skipFrames) {
			skipCounter = 0;
			lineBetween();
			ellipseFromMovement();
		} else {
			lineBetween();
			skipCounter++;
		}
	} else {
		applyFade ? background(...fader.color()) : background(bgCol);
	}
}

function lineBetween() {
	strokeWeight(2);
	stroke(10,150,110,1);
	line(mouseX, mouseY, pmouseX, pmouseY);
}

function ellipseFromMovement() {
	const dx = mouseX - pmouseX;
	const dy = mouseY - pmouseY;
	const travelled = sqrt(dx * dx + dy * dy);
	const dRad = map(travelled, 0, 60, 0, addRadMax);
	const rad = minRad + dRad;
	strokeWeight(1);
	fill(...mouseCol);
	stroke(50,60,70,.5);
	ellipse(mouseX, mouseY, rad, rad);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
