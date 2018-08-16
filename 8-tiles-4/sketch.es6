
// $color1: rgba(136, 162, 170, 1);
// $color2: rgba(173, 162, 150, 1);
// $color3: rgba(226, 133, 110, 1);
// $color4: rgba(244, 44, 4, 1);
// $color5: rgba(15, 26, 32, 1);


const backgroundCol = [15, 26, 32];
const basicStrokeCol = [226, 133, 110];
const circleStrokeCol = [244, 44, 4];
const fillCol = [136, 162, 170];

const minStrokeWeightEdge = 0.33;
const minStrokeWeightCircle = 0.33;
const scaleStrokeWeight = 4;
const minCircleRad = 5;
const minCircleRadInside = 0.5;
const scaleCircleRad = 2.5;
const scaleCircleRadInside = 12;
const perspectiveScaleFactor = 5;

let tileSize;
let noOfTiles;

let canvasSize;
let diagonal;
let tileGrid;

let gridConfig;

let distXToOrigin = 0.01;
let distYToOrigin = 0.01;

function setup() {
	setupSize();
	createCanvas(canvasSize, canvasSize);
	createMyTileGrid();
	colorMode(RGB, 255, 255, 255, 1);
}

function draw() {
	background(...backgroundCol);
	tileGrid.applyEach(drawTileLayer1);
	tileGrid.applyEach(drawTileLayer2);
}

function createMyTileGrid() {
	tileGrid = TileGrid.createInstance(gridConfig);
	tileGrid.applyEach(tile => tile.strokeCol = basicStrokeCol);
}

function drawTileLayer1(tile) {
	const ts = tile.size;
	const [tl,tr,bl,br] = [
		{x: tile.x, 				y: tile.y},
		{x: tile.x + ts,  	y: tile.y},
		{x: tile.x, 				y: tile.y + ts},
		{x: tile.x + ts, 		y: tile.y + ts}
	];

	const scale1 = map(distYToOrigin, 0, height, 1, scaleStrokeWeight);
	const scaleP = scalePerspectiveForTile(tile);
		
	strokeWeight(minStrokeWeightEdge*scale1*scaleP);
	stroke(...tile.strokeCol);
	line(tl.x, tl.y, tr.x, tr.y);
	line(tl.x, tl.y, bl.x, bl.y);
}

function drawTileLayer2(tile) {

	const scale1 = map(distXToOrigin, 0, width, 1, scaleCircleRad); 
	const scaleP = scalePerspectiveForTile(tile);

	strokeWeight(minStrokeWeightCircle * scale1 *scaleP);
	stroke(...circleStrokeCol);
	fill(...fillCol);
	ellipse(tile.x, tile.y, minCircleRad*scale1*scaleP);
}


function scalePerspectiveForTile(tile) {
	const distTileToOrigin = dist(tile.x, tile.y, tileGrid.x, tileGrid.y);
	return map(distTileToOrigin, 0, diagonal, 1, perspectiveScaleFactor);  
}

function mouseMoved() {
	if (insideCanvas()) {
		distXToOrigin = mouseX - tileGrid.x;
		distYToOrigin = mouseY  - tileGrid.y;
	} else {
		return;
	}
}


function insideCanvas() {
	return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function windowResized() {
	setupSize();
	resizeCanvas(canvasSize, canvasSize);
	createMyTileGrid();
}


function setupSize() {
	const {size,numberOf} = computeSizeSetup();
	tileSize = size;
	noOfTiles = numberOf;
	canvasSize = tileSize * noOfTiles;
	diagonal = canvasSize*Math.sqrt(2);
	gridConfig = new TileGridConfig(
		noOfTiles + 1, 						// gridSize - # of tiles per side 
		tileSize  							 // length of the side of one tile
	);
}

function computeSizeSetup() {
	const minSide = Math.min(window.innerHeight, window.innerWidth);
	const size = minSide > 600 ? 80 : 60;
	let numberOf = Math.floor(minSide * 0.75 / size);
	if (numberOf % 2 == 0) {
		numberOf--;
	}
	return {size: size, numberOf: numberOf};
}