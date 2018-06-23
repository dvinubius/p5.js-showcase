"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var bgCol = [84, 200, 158];
var baseFade = 0;
var fadeFactor = baseFade;
var mouseCol = [230, 100, 150, .9];
var applyFade = true;
var fader = new Fader(bgCol, baseFade);

function setup() {
	createCanvas(windowWidth, windowHeight);
	background.apply(undefined, bgCol);
	colorMode(RGB, 255, 255, 255, 1);

	console.log(fader);
}

function draw() {
	if (mouseIsPressed) {
		resetFade();
		fader.reset();
		fill.apply(undefined, mouseCol);
		stroke(10, 20, 30, .5);
		ellipse(mouseX, mouseY, 15, 15);
		stroke(100, 100, 100, .5);
		line(mouseX, mouseY, pmouseX, pmouseY);
	} else {
		background.apply(undefined, _toConsumableArray(bgFade()));
		incFade();
		fader.inc();
	}
}

function bgFade() {
	if (!applyFade) {
		return bgCol;
	}
	return [].concat(bgCol, [fadeFactor / 500]);
}
function incFade() {
	if (fadeFactor < 500) {
		fadeFactor++;
	}
}
function resetFade() {
	fadeFactor = baseFade;
}