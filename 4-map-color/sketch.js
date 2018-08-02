'use strict';

var bg = {
	h: 0,
	s: 50,
	l: 50
};
var legendHue = 'color hue: ',
    legendLum = 'luminosity: ',
    legendSat = 'saturation (scroll) : ';
var legend = void 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(bg.h, bg.s, bg.l);
	colorMode(HSB, 360, 100, 100, 1);
	var pHue = createElement('p', legendHue + Math.round(bg.h));
	var pLum = createElement('p', legendLum + Math.round(bg.l));
	var pSat = createElement('p', legendSat + Math.round(bg.s));
	legend = createElement('div');
	legend.child(pHue);
	legend.child(pLum);
	legend.child(pSat);
	legend.position(width / 2 - 260, height / 2 - 200);
	legend.style('font-size: 20px; font-family: Helvetica');
}

function draw() {
	bg.h = map(mouseX, 0, width, 0, 360);
	bg.l = map(mouseY, 0, height, 100, 0);
	background(bg.h, bg.s, bg.l);
	fill(0, 0, 100 - bg.l);
	legend.style('color: hsl(0,0%,' + map(bg.l, 0, 100, 100, 0) + '%)');
}

function mouseWheel(event) {
	bg.s -= event.delta / 30;
	if (bg.s > 100) bg.s = 100;
	if (bg.s < 0) bg.s = 0;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}