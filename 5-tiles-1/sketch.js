"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var gridSize = 50;
var tileGrid = void 0;
var neighbourhoodRad = 4;
var backgroundCol = [30, 0, 10];
var basicStrokeCol = [200, 200, 200];
var highlightStrokeCol = [10, 245, 160];
var illuminatorCol = [10, 245, 160];

function setup() {
	createCanvas(windowWidth - 45, windowHeight);
	tileGrid = createTileGrid();
}

function draw() {
	background.apply(undefined, backgroundCol);
	if (!mouseOnEdge()) {
		drawIlluminator();
	}
	if (tileGrid.isMouseInside(2 /*margin*/)) {
		var targetTiles = tileGrid.neighbourhoodMouse(neighbourhoodRad, // how far too look for neighnours
		true // circular zone? (as opposed to square)
		);

		// save state before changing stuff
		pushClones(targetTiles);

		// fancy changes before drawing
		targetTiles.forEach(function (tile) {
			tile.strokeWeight = 5;
			tile.strokeCol = highlightStrokeCol;
		});

		// draw grid
		tileGrid.applyEach(drawTile);

		// revert state
		popClones();
	} else {
		tileGrid.applyEach(drawTile);
	}
}

function createTileGrid() {
	var newGrid = void 0;
	// maximize grid
	var tileSize = round(min(width / gridSize, height / gridSize) * 0.9);
	// center grid
	var sideLength = gridSize * tileSize;
	var gridX = (width - sideLength) / 2;
	var gridY = (height - sideLength) / 2;
	newGrid = new TileGrid(gridSize, gridX, gridY, tileSize);
	newGrid.applyEach(function (tile) {
		return tile.direction = floor(random(0, 2));
	});
	newGrid.applyEach(function (tile) {
		return tile.strokeWeight = 1;
	});
	newGrid.applyEach(function (tile) {
		return tile.strokeCol = basicStrokeCol;
	});

	return newGrid;
}

function drawIlluminator() {
	noStroke();
	fill.apply(undefined, illuminatorCol.concat([90]));
	ellipse(mouseX, mouseY, 30, 30);
	fill.apply(undefined, illuminatorCol.concat([80]));
	ellipse(mouseX, mouseY, 50, 50);
	fill.apply(undefined, illuminatorCol.concat([60]));
	ellipse(mouseX, mouseY, 65, 65);
	fill.apply(undefined, illuminatorCol.concat([40]));
	ellipse(mouseX, mouseY, 80, 80);
	fill.apply(undefined, illuminatorCol.concat([20]));
	ellipse(mouseX, mouseY, 100, 100);
}
function drawTile(tile) {
	strokeWeight(tile.strokeWeight);
	stroke.apply(undefined, _toConsumableArray(tile.strokeCol));
	if (tile.direction === 0) {
		line(tile.x, tile.y, tile.x + tile.size, tile.y + tile.size);
	} else {
		line(tile.x + tile.size, tile.y, tile.x, tile.y + tile.size);
	}
}

// ==== STACK for clones ===== //
var tempClones = [];
function pushClones(tiles) {
	tempClones = tiles.map(function (t) {
		return t.clone();
	});
}
function popClones() {
	tempClones.forEach(function (clone) {
		tileGrid.set(clone.xInGrid, clone.yInGrid, clone);
	});
	// changed tiles are discarded, not referenced anymore
	// tempClones reset
	tempClones = [];
}
// ========================== //

function flipDirection(tile) {
	tile.direction = 1 - tile.direction;
}

function windowResized() {
	resizeCanvas(windowWidth - 45, windowHeight);
	tileGrid = createTileGrid();
}

function mouseWheel(event) {
	var newSize = gridSize - event.delta / 100;
	if (newSize < 100 && newSize > 10) {
		gridSize = newSize;
		tileGrid = createTileGrid();
	}
}