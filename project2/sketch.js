"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var bgCol = [84, 200, 158];
var mouseCol = [230, 100, 150, .9];
var fader = new Fader(bgCol, 0 /*baseFade*/);
var applyFade = true;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background.apply(undefined, bgCol);
	colorMode(RGB, 255, 255, 255, 1);
	fader.setMaxAlpha(1);
}

function draw() {
	if (mouseIsPressed) {
		fader.reset();
		fill.apply(undefined, mouseCol);
		stroke(10, 20, 30, .5);
		ellipse(mouseX, mouseY, 15, 15);
		stroke(100, 100, 100, .5);
		line(mouseX, mouseY, pmouseX, pmouseY);
	} else {
		applyFade ? background.apply(undefined, _toConsumableArray(fader.color())) : background(bgCol);
	}
}