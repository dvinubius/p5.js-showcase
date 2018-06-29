const backgroundCol = [10,10,10];
// const basicStrokeCol = [40,210,90];
const basicStrokeCol = [210,110,130];
const circleStrokeCol = [75, 167, 0];
// const fillCol = [210,90,30];
const fillCol = [240,219,210];
const fillColInside = [10,10,10];

const minStrokeWeightEdge = 0.33;
const minStrokeWeightCircle = 0.33;
const scaleStrokeWeight = 3;
const minCircleRad = 5;
const minCircleRadInside = 0.5;
const scaleCircleRad = 2.5;
const scaleCircleRadInside = 12;
const perspectiveScaleFactor = 5;

const tileSize = 80;
const noOfTiles = 11;
const canvasSize = tileSize * noOfTiles;
const diagonal = canvasSize*Math.sqrt(2);
let tileGrid;
const config = new TileGridConfig(
	noOfTiles + 1, // gridSize - # of tiles per side 
	tileSize  							 // length of the side of one tile
);

let distXToOrigin = 0.01;
let distYToOrigin = 0.01;

function setup() {
	createCanvas(canvasSize, canvasSize);
	createMyTileGrid();
	colorMode(RGB, 255, 255, 255, 1);
}

function draw() {
	background(...backgroundCol);
	tileGrid.applyEach(drawTileLayer1);
	tileGrid.applyEach(drawTileLayer2);
	tileGrid.applyEach(drawTileLayer3);
}

function createMyTileGrid() {
	tileGrid = TileGrid.createInstance(config);
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

function drawTileLayer3(tile) {

	const scale1 = map(distXToOrigin, 0, width, 1, scaleCircleRadInside); 
	const scaleP = scalePerspectiveForTile(tile);

	noStroke();
	fill(...fillColInside);
	ellipse(tile.x, tile.y, 5, minCircleRadInside*scale1*scaleP);
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
	resizeCanvas(canvasSize, canvasSize);
	createMyTileGrid();
}
