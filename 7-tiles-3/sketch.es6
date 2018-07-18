const backgroundCol = [10,60,110];
const basicStrokeCol = [250,110,50];
const circleStrokeCol = [80,0,0];
// const fillCol = [220,140,80];
// const fillCol2 = [240,110,40];
const fillCol = [220,230,210];
const minStrokeWeight = 1;
const maxStrokeWeight = 6;
const minCircleRad = 5;
const maxScaleCursorDist = 3; 
const maxScaleTileDist = 3;

let tileSize;
let noOfTiles;

let canvasSize;
let halfDiag;
let tileGrid;

let gridConfig;

let distXToCenter = 0; // current distance of mouse pointer to canvas center
let distYToCenter = 0; // current distance of mouse pointer to canvas center


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

	const sw = map(distYToCenter, 0, height/2, maxStrokeWeight, minStrokeWeight);
	const distToCenterTile = dist(tile.x, tile.y, width/2, height/2);
	const alpha = map(distToCenterTile, 0, halfDiag, 1, 0.4);
	const scaleFactor2 = map(distToCenterTile, 0, halfDiag, maxScaleCursorDist, 1);
	
	strokeWeight(sw*scaleFactor2);
	stroke(...tile.strokeCol, alpha);
	line(tl.x, tl.y, tr.x, tr.y);
	line(tl.x, tl.y, bl.x, bl.y);
}

function drawTileLayer2(tile) {
	const scaleFactor1 = map(distXToCenter, 0, width/2, maxScaleTileDist, 1); 
	const distToCenterTile = dist(tile.x, tile.y, width/2, height/2);
	const scaleFactor2 = map(distToCenterTile, 0, halfDiag, maxScaleCursorDist, 1);
	const rad = minCircleRad * scaleFactor1 * scaleFactor2;
	const alpha = map(distToCenterTile, 0, halfDiag, 1, 0.4);

	strokeWeight(scaleFactor2);
	stroke(...circleStrokeCol, alpha);
	fill(...fillCol);
	ellipse(tile.x, tile.y, rad);
}

function mouseMoved() {
	distXToCenter = dist(width/2, mouseY, mouseX, mouseY);
	distYToCenter = dist(mouseX, height/2, mouseX, mouseY);
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
	halfDiag = Math.round(canvasSize / Math.sqrt(2));
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