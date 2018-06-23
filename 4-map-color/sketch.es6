let bg = {
	h: 0,
	s: 50,
	l: 50
};

function setup() {
	createCanvas(windowWidth-45, windowHeight);
	background(bg.h, bg.s, bg.l);

	colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
	bg.h = map(mouseX, 0, width, 0, 360);
	bg.l = map(mouseY, 0, height, 100, 0);
	background(bg.h, bg.s, bg.l);
}

function mouseWheel(event) {
	bg.s -= event.delta/20;
	if (bg.s > 100) bg.s = 100;
	if (bg.s < 0) bg.s = 0;
}

function windowResized() {
	resizeCanvas(windowWidth-45, windowHeight);
}