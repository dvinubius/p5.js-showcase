const neighbourhoodRad = 4;
const backgroundCol = 			[30,0,10];
const basicStrokeCol = 			[200,200,200];
const highlightStrokeCol = 	[10,245,160];
const illuminatorCol = 			[10,245,160];
let tileGrid;
const config = new TileGridConfig(
	30, // gridSize - # of tiles per side ?
	null, // no tileSize - maximum sized, still fitting the screen decently
	true   
);

function setup() {
	createCanvas(windowWidth, windowHeight);
	createMyTileGrid();
}

function draw() {
	background(backgroundCol);
	if (!mouseOnEdge()) {
		drawIlluminator();
	}
	if (tileGrid.isMouseInside(2 /*margin*/)) {
		const targetTiles = tileGrid
													.neighbourhoodMouse(
														neighbourhoodRad, // how far too look for neighnours
														true // circular zone? (as opposed to square)
													);

		// save state before changing stuff
		pushClones(targetTiles);

		// fancy changes before drawing
		targetTiles.forEach(tile => {
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

function createMyTileGrid() {
	tileGrid = TileGrid.createInstance(config);
	tileGrid.applyEach(tile => tile.direction = floor(random(0,2)));
	tileGrid.applyEach(tile => tile.strokeWeight = 1);
	tileGrid.applyEach(tile => tile.strokeCol = basicStrokeCol);
}

function drawIlluminator() {
	noStroke();
	fill(...illuminatorCol, 90);
	ellipse(mouseX, mouseY, 30,30);
	fill(...illuminatorCol, 80);
	ellipse(mouseX, mouseY, 50,50);
	fill(...illuminatorCol, 60);
	ellipse(mouseX, mouseY, 65,65);
	fill(...illuminatorCol, 40);
	ellipse(mouseX, mouseY, 80,80);
	fill(...illuminatorCol, 20);
	ellipse(mouseX, mouseY, 100,100);
}
function drawTile(tile) {
	strokeWeight(tile.strokeWeight);
	stroke(...tile.strokeCol);
	if (tile.direction === 0) {
		line(tile.x, tile.y, tile.x + tile.size, tile.y + tile.size);
	} else {
		line(tile.x + tile.size, tile.y, tile.x, tile.y + tile.size);
	}
}

// ==== STACK for clones ===== //
let tempClones = [];
function pushClones(tiles) {
	tempClones = tiles.map(t => t.clone());
}
function popClones() {
	tempClones.forEach((clone) => {
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
	resizeCanvas(windowWidth, windowHeight);
	createMyTileGrid();
}

function mouseWheel(event) {
	let newSize = tileGrid.gridSize - event.delta/100;
	if (newSize < 100 && newSize > 10) {
		config.gridSize = newSize;
		createMyTileGrid();
	}
}
