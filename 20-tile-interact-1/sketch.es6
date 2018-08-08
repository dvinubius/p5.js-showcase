// palette
// $color1: rgba(57, 62, 65, 1);
// $color2: rgba(211, 208, 203, 1);
// $color2: rgba(227, 99, 151, 1);
// $color3: rgba(231, 229, 223, 1);
// $color4: rgba(188, 141, 167, 1);
// $color5: rgba(189, 180, 191, 1);

const backgroundCol 	= [31, 37, 40];
const basicStrokeCol 	= [231, 229, 223];
const resultStrokeCol = [189, 180, 191];
const resultFrameCol 	= resultStrokeCol;
let tileGrid;
const gridSize = 12;

const minThickness = 2;
const maxThickness = 2;

let editor; // assigned in setup
let editorSize;
let offsetTop = 70;
let offsetLateral = 70;
let editorGridSize = 2;
let editorGrid;
let editorPieceThickness = 10;
let editorPiecesCommands = [];

const resultGridScaleFactor = 0.8;
const editorScaleFactor = 0.5;

const resultOverlayAlphaInit = .5;
const resultOverlayAlphaDecay = .02;
let resultOverlayAlpha;

let editorPattern = (x,y,size) => [];

// ------------- p5 js

function setup() {
	angleMode(DEGREES);
	colorMode(RGB, 255, 255, 255, 1);
	smooth();

	createCanvas(windowWidth, windowHeight);
	initComponents();
}

function initComponents() {
	createEditor();
	createEditorGrid();	
	createTileGrid();	
	calcCSS();
}

function draw() {
	background(backgroundCol);
	
	drawEditorPattern();

	drawResultGrid();

	if (resultOverlayAlpha === 0) {
		noLoop();
	} 		
}


function drawEditorPattern() {
	const editorRect = editor.elt.getBoundingClientRect();
	const offset = editorPieceThickness/2;
	const editorX = editorRect.x;
	const editorY = editorRect.y+offset;
	translate(editorX, editorY);
	stroke(resultStrokeCol);
	strokeWeight(3);
	editorGrid.applyEach(drawTileFromPattern(editorPattern));
	translate(-editorX, -editorY);
}

function drawResultGrid() {
	stroke(resultStrokeCol);
	strokeWeight(maxThickness);
	tileGrid.applyEach(drawTileFromPattern(editorPattern));	
	tileGrid.drawFrameSelf(resultFrameCol, maxThickness);

	// alpha overlay
	if (resultOverlayAlpha > 0) {
		fill(...resultFrameCol, resultOverlayAlpha);
		rect(tileGrid.x, tileGrid.y, tileGrid.length, tileGrid.length);
		resultOverlayAlpha -= resultOverlayAlphaDecay;
	}
}

function createEditor() {
	editorSize = Math.min(window.innerWidth, window.innerHeight) * editorScaleFactor;
	editor = select('.editor-wrapper');

	for (let i = 0; i < editorGridSize+1; i++) {
		for (let j = 0; j < editorGridSize+1; j++) {

			const doHorizontal 	= i < editorGridSize;
			const doVertical 		= j < editorGridSize;
			const doDiag				= i < editorGridSize && j < editorGridSize;

			if (doHorizontal) {
				addHorizontalPiece(i,j);
			}
			if (doVertical) {
				addVerticalPiece(i,j);
			}

			if (doDiag) {
				addDiagonals(i,j);
			}
		}
	}

	addLinesAcrossTopDown();
	addLinesAcrossLeftRight();
}

function addPieceToEditor(posX,posY,width,height,cssText,editorLayerClass) {
	const el1 = createElement('div');
	el1.addClass('editor-piece');
	el1.position(posX,posY);
	el1.size(width,height);
	if (cssText) {
		el1.style(cssText);
	}
	el1.addClass(editorLayerClass);
	el1.parent(editor);
	el1['dvn-selected']=false;

	el1.mouseClicked(() => {
		if (!el1['dvn-selected']) {
			el1.addClass('selected');
		} else {
			el1.removeClass('selected');
		}
		el1['dvn-selected'] = !el1['dvn-selected'];
		updateEditorPattern();
		loop();
	});
	return el1;
}

function createEditorGrid() {
	const ts = editorSize;
	const config = new TileGridConfig (
		1, 
		ts, 
		false   
	);
	editorGrid = TileGrid.createInstance(config);
}

function createTileGrid() {
	const max = min(width*resultGridScaleFactor, height*resultGridScaleFactor);
	const ts = min((width*resultGridScaleFactor - editorSize) / gridSize, max / gridSize);
	const config = new TileGridConfig(
		gridSize,
		ts, 
		false   
	);
	tileGrid = TileGrid.createInstance(config);
	resultOverlayAlpha = resultOverlayAlphaInit;
}

function drawTileFromPattern(pattern) {
	return tile => {
		noFill();
		if (tile.color) {
			stroke(tile.color);
		}
		pattern(tile).forEach(comm => {
			comm.command(...comm.args);
		});
	}	
}

function updateEditorPattern() {
	const patternPieces = editorPiecesCommands.filter(epc => epc.editorPiece['dvn-selected']);
	editorPattern = tile => patternPieces.map(patternPiece => patternPiece.commandVal(tile));
}

function updateEditorLayers() {
	const selectedLayer = document.querySelector('input[name="editor-layer"]:checked').value;
	const piecesToMakeVisible = document.querySelectorAll(`.editor-layer-${selectedLayer}`);
	
	const allEditorPieces = document.querySelectorAll('.editor-piece');

	allEditorPieces.forEach(piece => piece.style.visibility = 'hidden');
	piecesToMakeVisible.forEach(piece => piece.style.visibility = 'visible');
}


// ========================== //

function editorGridSizeChanged(ev) {
	const newValue = +ev.target.value;
	if (newValue - round(newValue) !== 0) {
		return;
	} 

	editorGridSize = newValue;
	reset();
	updateEditorLayers();
	
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	reset();
}


function reset() {
	resetEditorAndCommands();
	initComponents();
	loop();
}

function resetEditorAndCommands() {
	const editorNode = editor.elt;
	editorNode.querySelectorAll('.editor-piece').forEach(piece => {
		piece.remove();
	});
	editorPiecesCommands = [];
	editorPattern = (x,y,size) => [];
}

function calcCSS() {
	const docStyle = document.documentElement.style;
	docStyle.setProperty('--col-controls', `rgba(${basicStrokeCol.join(',')})`)
	docStyle.setProperty('--col-editor', `rgba(${basicStrokeCol.join(',')})`)
	calcPositions();
}
 
function calcPositions() {
	// adjust css for editor

	offsetTop = height * 0.05;
	offsetLateral = width * 0.05;
	const docStyle = document.documentElement.style;
	docStyle.setProperty('--editor-size', editorSize);
	docStyle.setProperty('--editor-offset-top', offsetTop);
	docStyle.setProperty('--editor-offset-left', offsetLateral);

	// resultGrid pos
	const newX = width - tileGrid.length - offsetLateral;
	const newY = offsetTop;
	tileGrid.changePos(newX, newY);
}

