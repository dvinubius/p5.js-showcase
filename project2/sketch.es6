let bgCol = [84, 200, 158];
let mouseCol = [230,100,150,.9];
let fader = new Fader(bgCol, 0 /*baseFade*/);
let applyFade = true;


function setup() {
	createCanvas(windowWidth, windowHeight);
	background(...bgCol);
	colorMode(RGB, 255, 255, 255, 1);
	fader.setMaxAlpha(1);
}

function draw() {
	if (mouseIsPressed) {
		fader.reset();
		fill(...mouseCol);
		stroke(10,20,30,.5);
		ellipse(mouseX, mouseY, 15, 15);
		stroke(100,100,100,.5);
		line(mouseX, mouseY, pmouseX, pmouseY);
	} else {
		applyFade ? background(...fader.color()) : background(bgCol);
	}
}