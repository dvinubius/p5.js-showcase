// palette
// $color1: rgba(88, 75, 83, 1);
// $color2: rgba(157, 92, 99, 1);
// $color3: rgba(214, 227, 248, 1);
// $color4: rgba(254, 245, 239, 1);
// $color5: rgba(228, 187, 151, 1);


const backgroundCol = 			[254, 245, 239];
const basicStrokeCol = 			[88, 75, 83,1];
let tileGrid;
let config;
let gridSize = 64;

const positions = 2;
const minThickness = 1;
const maxThickness = 3;

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
	tileGrid.applyEach(tile => tile.strokeWeight = floor(random(minThickness,maxThickness)));
	tileGrid.applyEach(tile => tile.strokeCol = basicStrokeCol);

	const commandVals = createCommandValGrid(tileGrid.gridSize);

	tileGrid.applyEach((tile, x, y) => tile.direction = commandVals.get(x,y));
}

function createCommandValGrid(size) {
	const vals = [];
	
	let lastRow = new Array(size).fill().map(() => floor(random(0,positions)));

	for (let i = 0; i < size; i++) {
		vals[i] = [];
		for (let j = 0; j < size; j++) {
			vals[i][j] = {
				pos1: lastRow[j],
				pos2: lastRow[j] + addableTo(lastRow[j], positions)
			}
		}
		lastRow = vals[i].map(val => val.pos2);
	}
	return Grid.createFromMatrix(vals);
}

function addableTo(val, totalPositions) {
	if (val === 0) {
		return random([0,1]);
	}
	if (val === totalPositions-1) {
		return random([-1,0]);
	}
	// else
	return random([-1,0,1]);
}


function drawTile(tile) {

	strokeWeight(tile.strokeWeight);
	stroke(...tile.strokeCol);
		
	const p1 = tile.direction.pos1;
	const p2 = tile.direction.pos2;
	const stepX = tile.size / (positions-1);
	line(
		tile.x + p1*stepX, 
		tile.y,
		tile.x + p2*stepX,
		tile.y + tile.size
	)
	 
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

