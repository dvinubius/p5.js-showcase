const backgroundCol = [140,110,130];
const basicStrokeCol = [250,150,150];
const highlightStrokeCol = [210,145,0];
const gridContourCol = [250,150,150];


let tileSize;
let noOfTiles;

let canvasSize;
let halfDiag;
let tileGrid;

let gridConfig;


function setup() {
	setupSize();
	createCanvas(windowWidth, windowHeight);
	createMyTileGrid();
}

function draw() {
	background(...backgroundCol);
	tileGrid.applyEach(drawTile);
	tileGrid.drawFrameSelf(gridContourCol, 3);
}

function createMyTileGrid() {
	tileGrid = TileGrid.createInstance(gridConfig);
	tileGrid.applyEach(tile => tile.direction = floor(random(0,2)));
	tileGrid.applyEach(tile => tile.strokeWeight = 1);
	tileGrid.applyEach(tile => tile.strokeCol = basicStrokeCol);
	tileGrid.applyEach(tile => {
		tile.circleOffset = random(-0.5*tile.size,0.5*tile.size);
		tile.circleVel = random(0,2) > 1 ? 1 : -1;
	});
}

function drawTile(tile) {
	const ts = tile.size;
	const [tl,tr,bl,br,cen] = [
		{x: tile.x, 				y: tile.y},
		{x: tile.x + ts,  	y: tile.y},
		{x: tile.x, 				y: tile.y + ts},
		{x: tile.x + ts, 		y: tile.y + ts},
		{x: tile.x + ts/2, 	y: tile.y + ts/2}
	];

	strokeWeight(tile.strokeWeight);
	stroke(tile.strokeCol);
	if (tile.isEvenCol()) {
		strokeWeight(tile.strokeWeight + 2);
		line(tl.x, tl.y, br.x, br.y);
		strokeWeight(tile.strokeWeight);
	} else {
		line(tr.x, tr.y, bl.x, br.y);
	}

	if (tile.isEvenCol() && 
			// !tile.isEvenRow() && 
			!tileGrid.isOnEdge(tile)) {
		fill(highlightStrokeCol, 50);
		const posX = cen.x;
		const posY = cen.y;
		const rad = ts/2 + tile.circleOffset/2;
		ellipse(posX,posY,rad,rad);
		tile.circleOffset += tile.circleVel;
		if (tile.circleOffset > ts / 2 ||
				tile.circleOffset < - ts / 2) {
			tile.circleVel = -1 * tile.circleVel; 
		} 
	}
}

function windowResized() {
	setupSize();
	resizeCanvas(windowWidth, windowHeight);
	createMyTileGrid();
}


function setupSize() {
	const {size,numberOf} = computeSizeSetup();
	tileSize = size;
	noOfTiles = numberOf;

	gridConfig = new TileGridConfig(
		noOfTiles + 1, 						// gridSize - # of tiles per side 
		tileSize,  							 // length of the side of one tile
		true										// center grid in canvas?  
	);
}

function computeSizeSetup() {
	const minSide = Math.min(window.innerHeight, window.innerWidth);
	const size = minSide > 600 ? 50 : 30;
	let numberOf = Math.floor(minSide * 0.75 / size);
	if (numberOf % 2 !== 0) {
		numberOf--;
	}
	return {size: size, numberOf: numberOf};
}