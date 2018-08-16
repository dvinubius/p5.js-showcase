'use strict';

var baseDiam = 1200;
var n = 2;
var d = 5;
var k = n / d;

var step = 0.02;

var pathPoints = void 0;
var index = 0;

var bgCol = [55, 5, 20];
var strokeCol = [60, 203, 80];

var sliderN = void 0;
var sliderD = void 0;
var valLabelN = void 0;
var valLabelD = void 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(RGB, 255, 255, 255, 1);
	smooth();

	initDOM();

	initDrawing();
}

function draw() {

	if (index === 0) {
		beginShape();
	}

	translate(width / 2, height / 2);

	stroke(0, 0, 0, 0.1);
	noFill();

	var v = pathPoints[index++];
	if (!v) {
		background(bgCol.concat(0.2));
		strokeWeight(1);
		stroke(strokeCol);
		endShape(CLOSE);
	} else {
		noStroke();
		fill.apply(undefined, strokeCol.concat([0.6]));
		ellipse(v.x, v.y, 3, 3);
		vertex(v.x, v.y);
	}
}

function buildPath() {
	var res = [];
	for (var i = 0; i < TWO_PI * d; i += step) {
		var r = baseDiam / 4 * cos(k * i);
		var x = r * cos(i);
		var y = r * sin(i);
		stroke(6);
		res.push(createVector(x, y));
	}
	return res;
}

function initDOM() {
	sliderN = createSlider(1, 20, 4, 1);
	sliderN.position(60, 100);
	sliderN.size(100);
	sliderN.style('outline', 'none');
	sliderD = createSlider(1, 20, 2, 1);
	sliderD.position(60, 200);
	sliderD.size(100);
	sliderD.style('outline', 'none');
	sliderN.changed(initDrawing);
	sliderD.changed(initDrawing);
	sliderN.input(function (ev) {
		return valLabelN.html(ev.target.value);
	});
	sliderD.input(function (ev) {
		return valLabelD.html(ev.target.value);
	});

	var labelN = createSpan('n: ');
	valLabelN = createSpan();
	var labelD = createSpan('d: ');
	valLabelD = createSpan();

	labelN.position(80, 140);
	valLabelN.position(110, 140);
	labelN.style('font-size', '20px');
	valLabelN.style('font-size', '20px');
	labelN.style('color', 'whitesmoke');
	valLabelN.style('color', 'whitesmoke');
	labelD.position(80, 240);
	valLabelD.position(110, 240);
	labelD.style('font-size', '20px');
	valLabelD.style('font-size', '20px');
	labelD.style('color', 'whitesmoke');
	valLabelD.style('color', 'whitesmoke');
}

function initDrawing() {
	valLabelN.html(sliderN.value());
	valLabelD.html(sliderD.value());
	n = sliderN.value();
	d = sliderD.value();
	k = n / d;
	index = 0;
	pathPoints = buildPath();
	background(bgCol);
	resetMatrix();
	translate(width / 2, height / 2);
	stroke(strokeCol.concat(0.6));
	noFill();
	ellipse(0, 0, baseDiam / 2, baseDiam / 2);
}

function windowResized() {
	initDrawing();
}