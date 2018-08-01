const backgroundCol = 			[240,240,210];
const basicStrokeCol = 			[30,0,10];
let tileGrid;
let config;
let gridSize = 40;

function setup() {
	createCanvas(windowWidth, windowHeight);
	const ts = min(width, height)*0.7/gridSize;
	config = new TileGridConfig(
		gridSize, // gridSize - # of tiles per side ?
		ts, // no tileSize - maximum sized, still fitting the screen decently
		true   
	);
	createMyTileGrid();
	colorMode(RGB, 255, 255, 255, 1)
}

function draw() {
	background(backgroundCol);
	
	tileGrid.applyEach(drawTile);	

	noLoop();
}

function createMyTileGrid() {
	tileGrid = TileGrid.createInstance(config);
	tileGrid.applyEach(tile => tile.strokeWeight = floor(random(6,25)));
	tileGrid.applyEach(tile => tile.strokeCol = basicStrokeCol);


	tileGrid.applyEach(tile => tile.direction = floor(random(0,4)));
}

function drawTile(tile) {
	strokeWeight(tile.strokeWeight);
	stroke(...tile.strokeCol, 0.8);

	if (random(1) > 0.7) {
		stroke(205,0,0,0.8);
		strokeWeight(tile.strokeWeight/2);
	}
	const hle 	= tile.size * 0.5;
	const le		= tile.size;
	switch (tile.direction) { 
		case 0: 
			line(	
				tile.x + hle*1.5, 
				tile.y, 
				tile.x + hle*1.5, 
				tile.y + le	
			);
			break;
		case 1:
			line(
				tile.x + le,
				tile.y + hle*1.5,
				tile.x,
				tile.y + hle*1.5
			);
			break;
		case 2:
			line(
				tile.x + hle*0.5,
				tile.y + le,
				tile.x + hle*0.5,
				tile.y
			);
			break;
		case 3:
			line(
				tile.x,
				tile.y + hle*0.5,
				tile.x + le,
				tile.y + hle*0.5
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

