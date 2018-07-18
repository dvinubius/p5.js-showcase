"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var backgroundCol = [10, 60, 110];
var basicStrokeCol = [250, 110, 50];
var circleStrokeCol = [80, 0, 0];
// const fillCol = [220,140,80];
// const fillCol2 = [240,110,40];
var fillCol = [220, 230, 210];
var minStrokeWeight = 1;
var maxStrokeWeight = 6;
var minCircleRad = 5;
var maxScaleCursorDist = 3;
var maxScaleTileDist = 3;

var tileSize = 80;
var noOfTiles = 11;
var canvasSize = tileSize * noOfTiles;
var halfDiag = Math.round(canvasSize / Math.sqrt(2));
var tileGrid = void 0;
var config = new TileGridConfig(noOfTiles + 1, // gridSize - # of tiles per side 
tileSize // length of the side of one tile
);

var distXToCenter = 0; // current distance of mouse pointer to canvas center
var distYToCenter = 0; // current distance of mouse pointer to canvas center


function setup() {
	createCanvas(canvasSize, canvasSize);
	createMyTileGrid();
	colorMode(RGB, 255, 255, 255, 1);
}

function draw() {
	background.apply(undefined, backgroundCol);
	tileGrid.applyEach(drawTileLayer1);
	tileGrid.applyEach(drawTileLayer2);
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


	var sw = map(distYToCenter, 0, height / 2, maxStrokeWeight, minStrokeWeight);
	var distToCenterTile = dist(tile.x, tile.y, width / 2, height / 2);
	var alpha = map(distToCenterTile, 0, halfDiag, 1, 0.4);
	var scaleFactor2 = map(distToCenterTile, 0, halfDiag, maxScaleCursorDist, 1);

	strokeWeight(sw * scaleFactor2);
	stroke.apply(undefined, _toConsumableArray(tile.strokeCol).concat([alpha]));
	line(tl.x, tl.y, tr.x, tr.y);
	line(tl.x, tl.y, bl.x, bl.y);
}

function drawTileLayer2(tile) {
	var scaleFactor1 = map(distXToCenter, 0, width / 2, maxScaleTileDist, 1);
	var distToCenterTile = dist(tile.x, tile.y, width / 2, height / 2);
	var scaleFactor2 = map(distToCenterTile, 0, halfDiag, maxScaleCursorDist, 1);
	var rad = minCircleRad * scaleFactor1 * scaleFactor2;
	var alpha = map(distToCenterTile, 0, halfDiag, 1, 0.4);

	strokeWeight(scaleFactor2);
	stroke.apply(undefined, circleStrokeCol.concat([alpha]));
	fill.apply(undefined, fillCol);
	ellipse(tile.x, tile.y, rad);
}

function mouseMoved() {
	distXToCenter = dist(width / 2, mouseY, mouseX, mouseY);
	distYToCenter = dist(mouseX, height / 2, mouseX, mouseY);
}

function insideCanvas() {
	return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function windowResized() {
	resizeCanvas(canvasSize, canvasSize);
	createMyTileGrid();
}