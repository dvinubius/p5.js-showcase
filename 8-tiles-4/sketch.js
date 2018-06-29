"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var backgroundCol = [10, 10, 10];
// const basicStrokeCol = [40,210,90];
var basicStrokeCol = [210, 110, 130];
var circleStrokeCol = [75, 167, 0];
// const fillCol = [210,90,30];
var fillCol = [240, 219, 210];
var fillColInside = [10, 10, 10];

var minStrokeWeightEdge = 0.33;
var minStrokeWeightCircle = 0.33;
var scaleStrokeWeight = 3;
var minCircleRad = 5;
var minCircleRadInside = 0.5;
var scaleCircleRad = 2.5;
var scaleCircleRadInside = 12;
var perspectiveScaleFactor = 5;

var tileSize = 80;
var noOfTiles = 11;
var canvasSize = tileSize * noOfTiles;
var diagonal = canvasSize * Math.sqrt(2);
var tileGrid = void 0;
var config = new TileGridConfig(noOfTiles + 1, // gridSize - # of tiles per side 
tileSize // length of the side of one tile
);

var distXToOrigin = 0.01;
var distYToOrigin = 0.01;

function setup() {
	createCanvas(canvasSize, canvasSize);
	createMyTileGrid();
	colorMode(RGB, 255, 255, 255, 1);
}

function draw() {
	background.apply(undefined, backgroundCol);
	tileGrid.applyEach(drawTileLayer1);
	tileGrid.applyEach(drawTileLayer2);
	tileGrid.applyEach(drawTileLayer3);
}

function createMyTileGrid() {
	tileGrid = TileGrid.createInstance(config);
	tileGrid.applyEach(function (tile) {
		return tile.strokeCol = basicStrokeCol;
	});
}

function drawTileLayer1(tile) {
	var ts = tile.size;
	var tl = { x: tile.x, y: tile.y },
	    tr = { x: tile.x + ts, y: tile.y },
	    bl = { x: tile.x, y: tile.y + ts },
	    br = { x: tile.x + ts, y: tile.y + ts };


	var scale1 = map(distYToOrigin, 0, height, 1, scaleStrokeWeight);
	var scaleP = scalePerspectiveForTile(tile);

	strokeWeight(minStrokeWeightEdge * scale1 * scaleP);
	stroke.apply(undefined, _toConsumableArray(tile.strokeCol));
	line(tl.x, tl.y, tr.x, tr.y);
	line(tl.x, tl.y, bl.x, bl.y);
}

function drawTileLayer2(tile) {

	var scale1 = map(distXToOrigin, 0, width, 1, scaleCircleRad);
	var scaleP = scalePerspectiveForTile(tile);

	strokeWeight(minStrokeWeightCircle * scale1 * scaleP);
	stroke.apply(undefined, circleStrokeCol);
	fill.apply(undefined, fillCol);
	ellipse(tile.x, tile.y, minCircleRad * scale1 * scaleP);
}

function drawTileLayer3(tile) {

	var scale1 = map(distXToOrigin, 0, width, 1, scaleCircleRadInside);
	var scaleP = scalePerspectiveForTile(tile);

	noStroke();
	fill.apply(undefined, fillColInside);
	ellipse(tile.x, tile.y, 5, minCircleRadInside * scale1 * scaleP);
}

function scalePerspectiveForTile(tile) {
	var distTileToOrigin = dist(tile.x, tile.y, tileGrid.x, tileGrid.y);
	return map(distTileToOrigin, 0, diagonal, 1, perspectiveScaleFactor);
}

function mouseMoved() {
	if (insideCanvas()) {
		distXToOrigin = mouseX - tileGrid.x;
		distYToOrigin = mouseY - tileGrid.y;
	} else {
		return;
	}
}

function insideCanvas() {
	return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function windowResized() {
	resizeCanvas(canvasSize, canvasSize);
	createMyTileGrid();
}