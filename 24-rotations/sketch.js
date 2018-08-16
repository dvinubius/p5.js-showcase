"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// $color1: rgba(220, 255, 253, 1);
// $color1: rgba(255, 255, 255, 1);
// $color2: rgba(0, 167, 225, 1);
// $color3: rgba(0, 23, 31, 1);
// $color4: rgba(0, 52, 89, 1);
// $color5: rgba(0, 126, 167, 1);

// const bgCol = [220, 255, 253];
var bgCol = [0, 23, 31];
var strokeCol = [220, 255, 253];
var fillCol = [0, 167, 225];

var bigR = 250;
var rotation = 0;
var rotationInc = 0.01;
var iterations = 80;
var decoObjects = [];
var radVariationFactorMax = 1.61;
var radVariationFactorMin = 1 / 1.61;
var radVariationInc = 0.01;
var radVariationFactor = 1.61;
var radVariationDirection = 1;

var tracking = false;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(RGB, 255, 255, 255, 1);
	rectMode(CENTER);
	smooth();

	buildDeco();
	updateAllDecoPos(0, 0);
	background(bgCol);
}

function draw() {

	background.apply(undefined, bgCol);

	translate(width / 2, height / 2);

	if (tracking) {
		var currX = mouseX - width / 2;
		var currY = mouseY - height / 2;
		updateAllDecoPos(currX, currY);
	}

	stroke.apply(undefined, strokeCol.concat([0.1]));
	// noFill();
	fill.apply(undefined, fillCol.concat([0.2]));

	decoObjects.forEach(function (obj, index) {
		push();
		translate(obj.x, obj.y);
		rotate(rotation * 1.61 * (0.3 + index / decoObjects.length * 2));
		rect(0, 0, obj.width * radVariationFactor, obj.height * radVariationFactor);
		// regPolygon(0,0,obj.width*radVariationFactor, 5);
		pop();
	});

	rotation -= rotationInc;
}

function buildDeco() {
	var step = TWO_PI / iterations;
	for (var i = 0; i < iterations; i++) {
		var vx = cos(i * step);
		var vy = sin(i * step);
		var dist = bigR * (i / iterations);
		var rad = bigR / 1.61 * i / iterations;
		var obj = new DecoObject(vx * dist, vy * dist, rad, rad, 1);
		decoObjects.push(obj);
	}
}

function updateAllDecoPos(currX, currY) {
	decoObjects.forEach(function (obj, index) {
		obj.updateDecoPos(currX, currY, index);
	});
}

var DecoObject = function () {
	function DecoObject(x, y, w, h, op) {
		_classCallCheck(this, DecoObject);

		this.initialX = x;
		this.initialY = y;
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.opacity = op;
	}

	_createClass(DecoObject, [{
		key: "updateDecoPos",
		value: function updateDecoPos(currX, currY, index) {
			var diffX = currX - this.initialX;
			var diffY = currY - this.initialY;
			var amount = index / (decoObjects.length - 1);
			this.x = this.initialX + amount * diffX;
			this.y = this.initialY + amount * diffY;
		}
	}]);

	return DecoObject;
}();

function regPolygon(cx, cy, rad, sides) {
	beginShape();
	var step = TWO_PI / sides;
	for (var i = 0; i <= sides; i++) {
		var x = cos(i * step) * rad;
		var y = sin(i * step) * rad;
		vertex(x, y);
	}
	endShape();
}

function mouseMoved() {
	tracking = true;
}

function windowResized() {
	createCanvas(windowWidth, windowHeight);
	decoObjects = [];
	buildDeco();
	updateAllDecoPos(0, 0);
}