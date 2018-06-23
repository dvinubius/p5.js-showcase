"use strict";

var bg = {
	h: 0,
	s: 50,
	l: 50
};

function setup() {
	createCanvas(windowWidth - 45, windowHeight);
	background(bg.h, bg.s, bg.l);

	colorMode(HSB, 100);
}

function draw() {
	bg.h = 100 * (mouseX / width);
	bg.l = 100 * (1 - mouseY / height);
	background(bg.h, bg.s, bg.l);
}

function mouseWheel(event) {
	bg.s -= event.delta / 20;
	if (bg.s > 100) bg.s = 100;
	if (bg.s < 0) bg.s = 0;
}

function windowResized() {
	resizeCanvas(windowWidth - 45, windowHeight);
}