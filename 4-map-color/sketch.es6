let bg = {
	h: 0,
	s: 50,
	l: 50
};
let legendHue = 'color hue: ';
let legendLum = 'luminosity: ';
let legendSat = 'saturation (scroll) : ';

function setup() {
	createCanvas(windowWidth-45, windowHeight);
	background(bg.h, bg.s, bg.l);
	textSize(14);
	colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
	bg.h = map(mouseX, 0, width, 0, 360);
	bg.l = map(mouseY, 0, height, 100, 0);
	background(bg.h, bg.s, bg.l);
	fill(0, 0, 100 - bg.l);
	text(legendHue + Math.round(bg.h), 20, 30);
	text(legendLum + Math.round(bg.l), 20, 50);
	text(legendSat + Math.round(bg.s), 20, 70);
}

function mouseWheel(event) {
	bg.s -= event.delta/30;
	if (bg.s > 100) bg.s = 100;
	if (bg.s < 0) bg.s = 0;
}

function windowResized() {
	resizeCanvas(windowWidth-45, windowHeight);
}