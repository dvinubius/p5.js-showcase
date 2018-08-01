const backgroundCol = 			[210,240,240];
const basicStrokeCol = 			[30,0,10];
let tileGrid;
let config;
let gridSize = 20;

function setup() {
	createCanvas(windowWidth, windowHeight);
	const ts = min(width, height)*0.7/gridSize;
	config = new TileGridConfig(
		gridSize, // gridSize - # of tiles per side ?
		ts, // no tileSize - maximum sized, still fitting the screen decently
		true   
	);
	createMyTileGrid();
}

function draw() {
	background(backgroundCol);
	
	tileGrid.applyEach(drawTile);	

	noLoop();
}

function createMyTileGrid() {
	tileGrid = TileGrid.createInstance(config);
	tileGrid.applyEach(tile => tile.strokeWeight = floor(random(4,16)));
	tileGrid.applyEach(tile => tile.strokeCol = basicStrokeCol);


	tileGrid.applyEach(tile => tile.direction = floor(random(0,4)));
}

function drawTile(tile) {
	strokeWeight(tile.strokeWeight);
	stroke(...tile.strokeCol);
	const hle 	= tile.size * 0.5;
	const le		= tile.size;
	switch (tile.direction) { 
		case 0: 
			line(	
				tile.x + hle, 
				tile.y, 
				tile.x + le, 
				tile.y + hle	
			);
			break;
		case 1:
			line(
				tile.x,
				tile.y + hle,
				tile.x + hle,
				tile.y + le
			);
			break;
		case 2:
			line(
				tile.x + hle,
				tile.y,
				tile.x,
				tile.y + hle
			);
			break;
		case 3:
			line(
				tile.x + hle,
				tile.y + le,
				tile.x + le,
				tile.y + hle
			);
			break;
		}
}

// ========================== //

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	createMyTileGrid();
}

function mouseWheel(event) {
	let newSize = tileGrid.gridSize - event.delta/100;
	if (newSize < 100 && newSize > 10) {
		config.gridSize = newSize;
		createMyTileGrid();
		loop();
	}
}

function reset() {
	createMyTileGrid();
	loop();
}

