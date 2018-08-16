const backgroundCol = 			[240,240,255];
const basicStrokeCol = 			[20,20,10,0.8];
let tileGrid;
let config;
let gridSize = 12;

const levelsPerTile = 3;
const stopsPerTile = 3;
const minThickness = 3;
const maxThickness = 7;

function setup() {
	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);
	const ts = min(width, height)*0.6/gridSize;
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
	
	translate(-width*0.2,-height*0.05);
	scale(1.4,1);
	tileGrid.applyEach(drawTile);	
	
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
		let strokeCol;
		let strokeColBase;
		let desc = p.x < nextP.x;
		if (desc) {			
			strokeColBase = [90,50,250];
			strokeCol = [...strokeColBase,0.8];
		} else {
			strokeColBase = [150,20,20];
			strokeCol = [...strokeColBase,0.6];
		}
		stroke(strokeCol);
		line(p.x, p.y, nextP.x, nextP.y);


		const iterations = 64;
		for (let i = 1; i <= iterations; i++) {
			push();
			const diffX = nextP.x-p.x;
			const diffY = nextP.y-p.y;
			if (desc) {
				translate(0,i);
			} else {
				translate(0,i);
			}
			strokeWeight(1);
			stroke(...strokeColBase, 0.006*(iterations-i));
			line(p.x, p.y, p.x + diffX, p.y + diffY);
			pop();
		}
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

