const backgroundCol = 			[70,105,90];
const basicStrokeCol = 			[170,230,120,1];
let tileGrid;
let config;
let gridSize = 36;

const levelsPerTile = 1;
const stopsPerTile = 1;
const minThickness = 1;
const maxThickness = 3;

const layers = 1;

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
	for (let i = 0; i < layers - 1; i++) {
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
		const commandVals = new Array(levelsPerTile+1).fill();
		const seed = floor(random(0,stopsPerTile+1));
		let lastComVal = seed;
		for (let i = 0; i < commandVals.length; i++) {
			let currentComVal;
			if (lastComVal === 0) {
				currentComVal = random([0,1]);
			} else
			if (lastComVal === stopsPerTile) {
				currentComVal = random([stopsPerTile-1,stopsPerTile]);			
			} else {
				currentComVal = random([lastComVal - 1, lastComVal, lastComVal + 1]);
			}			
			commandVals[i] = currentComVal;
			lastComVal = currentComVal;
		}		

		tile.direction = commandVals;
	});
}

function drawTile(tile) {
	if (tile.isEvenCol()) {
		strokeWeight(tile.strokeWeight);
		stroke(...tile.strokeCol);
			
		const createChangePoints = function(commandVals, stops) {
			const stepX = tile.size/stops;
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

