// palette
// $color1: rgba(255, 200, 87, 1);
// $color2: rgba(233, 114, 76, 1);
// $color3: rgba(197, 40, 61, 1);
// $color4: rgba(72, 29, 36, 1);
// $color5: rgba(37, 95, 133, 1);


const backgroundCol = 			[255, 200, 87, 1];
const basicStrokeCol = 			[37, 95, 133,1];
const secondStrokeCol = 		[72, 29, 36,1];
const thirdStrokeCol = 			[197, 40, 61];
const fillCol				=				[233, 114, 76];
const strokeCols = [basicStrokeCol, secondStrokeCol, thirdStrokeCol];
let tileGrid;
let config;
let gridSize = 42;

const minThickness = 1;
const maxThickness = 2;

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
	const commandVals = createCommandValGrid(tileGrid.gridSize);

	tileGrid.applyEach((tile, x, y) => tile.direction = commandVals.get(x,y));
}

function createCommandValGrid(size) {
	const vals = [];
	
	// 0 - line, 1 - triangle down, 2 - triangle up

	for (let i = 0; i < size; i++) {
		vals[i] = [];
		for (let j = 0; j < size; j++) {
			const rand = floor(random(0,30));
			vals[i][j] = rand < 20 	? 0
															:	(rand < 25) ? 1
																						: 2;
		}
	}
	return Grid.createFromMatrix(vals);
}

function drawTile(tile) {

	if (tile.isEvenCol()) {
		if (tile.direction === 0) {
			strokeWeight(minThickness);
			stroke(basicStrokeCol);
			// draw line
			line(
				tile.x + tile.size*0.5,
				tile.y,
				tile.x + tile.size*0.5,
				tile.y + tile.size	
			)
		} else {
			const gutter = 0;
			// triangle
			let p1 = {}, p2 = {}, p3 = {};
			if (tile.direction === 1) {
				p1.x = tile.x;
				p1.y = tile.y + gutter;
				p2.x = tile.x + tile.size;
				p2.y = tile.y + gutter;
				p3.x = tile.x + tile.size*0.5;
				p3.y = tile.y + tile.size - gutter;
			} else {
				p1.x = tile.x + tile.size*0.5;
				p1.y = tile.y + gutter;
				p2.x = tile.x;
				p2.y = tile.y + tile.size - gutter;
				p3.x = tile.x + tile.size;
				p3.y = tile.y + tile.size - gutter;
			}
			const col = random([strokeCols[1], strokeCols[2]]);
			noStroke();
			strokeWeight(maxThickness);
			fill(col);
			triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
		}	 	
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

