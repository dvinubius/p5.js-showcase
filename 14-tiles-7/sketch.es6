const backgroundCol = 			[240,240,255];
const basicStrokeCol = 			[20,20,10,0.8];
let tileGrid;
let config;
let gridSize = 12;

const levelsPerTile = 3;
const stopsPerTile = 2;
const minThickness = 2;
const maxThickness = 6;

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
	
	// repeat overlapping grid
	for (let i = 0; i < 1; i++) {
		createMyTileGrid();
		tileGrid.applyEach(drawTile);
	}

	noLoop();
}

function createMyTileGrid() {
	tileGrid = TileGrid.createInstance(config);
	tileGrid.applyEach(tile => tile.strokeWeight = floor(random(minThickness,maxThickness)));
	tileGrid.applyEach(tile => tile.strokeCol = basicStrokeCol);


	tileGrid.applyEach(tile => {
		const commandVals = new Array(levelsPerTile).fill();
		tile.direction = commandVals.map(() => floor(random(0,stopsPerTile)));
	});
}

function drawTile(tile) {
	strokeWeight(tile.strokeWeight);
	stroke(...tile.strokeCol);
		
	const createChangePoints = function(commandVals, stops) {
		const stepX = tile.size/(stops-1);
		const stepY = tile.size/(commandVals.length-1);
		return commandVals.map((command, index) => ({
			x: tile.x + stepX * command,
			y: tile.y + stepY * index
		}));
	}

	const changePoints = createChangePoints(tile.direction, stopsPerTile);

	changePoints.forEach((p,index) => {
		if (index === changePoints.length-1) {
			return;
		} 

		const nextP = changePoints[index+1];
		line(p.x, p.y, nextP.x, nextP.y);
	});
}

// ========================== //

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	createMyTileGrid();
	loop();
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

