function addHorizontalPiece(i,j) {
	const editorGridStep = editorSize / editorGridSize;
	const thick = editorPieceThickness;
	const posX = i*editorGridStep;
	const posY = j*editorGridStep;
	const width  = editorGridStep;
	const height = 0;
	const cssText = `
		border-top: ${thick/2}px solid currentColor;
		border-bottom: ${thick/2}px solid currentColor;
	`;
	const editorLayerClass = 'editor-layer-basic';
	
	// for display in editor
	const newPiece = addPieceToEditor(posX, posY, width, height, cssText, editorLayerClass);
	// for use in pattern
	const newCommand = tile => {
		const x = tile.x;
		const y = tile.y;
		const step = tile.size/editorGridSize;
		return {
			command: line,
			args: [
				x + i*step,
				y + j*step,
				x + (i+1) * step,
				y + j * step
			]
		};
	};

	editorPiecesCommands.push({
		editorPiece: newPiece,
		commandVal: tile => newCommand(tile)
	});
};

function addVerticalPiece(i,j) {
	const editorGridStep = editorSize / editorGridSize;
	const thick = editorPieceThickness;
	const posX = i*editorGridStep;
	const posY = j*editorGridStep;
	const width 	= editorGridStep;
	const height  = 0;
	const cssText = `
		border-top: ${thick/2}px solid currentColor;
		border-bottom: ${thick/2}px solid currentColor;
		transform-origin: 0px 50%;
		transform: rotateZ(90deg);
	`;
	const editorLayerClass = 'editor-layer-basic';


	// for display in editor
	const newPiece = addPieceToEditor(posX, posY, width, height, cssText, editorLayerClass);	
	// for use in pattern
	const newCommand = tile => {
		const x = tile.x;
		const y = tile.y;
		const step = tile.size/editorGridSize;
		return {
			command: line,
			args: [
				x + i*step,
				y + j*step,
				x + i*step,
				y + (j+1) * step
			]
		};
	};
	editorPiecesCommands.push({
		editorPiece: newPiece,
		commandVal: tile => newCommand(tile)
	});
}

function addDiagonals(i,j) {
	const editorGridStep = editorSize / editorGridSize;
	const thick = editorPieceThickness;
	const horizontalLength = editorGridStep;
	const diagonalLength  = horizontalLength*sqrt(2);
	const height = 0;
	const posX1 = i*editorGridStep;
	const posY1 = j*editorGridStep;
	const posX2 = (i+1)*editorGridStep;
	const posY2 = j*editorGridStep;
	// TL-BR
	const cssText1 = `
		border-top: ${thick/2}px solid currentColor;
		border-bottom: ${thick/2}px solid currentColor;
		transform-origin: 0px 50%;
		transform: rotateZ(45deg);
	`;
	// TR-BL
	const cssText2 = `
		border-top: ${thick/2}px solid currentColor;
		border-bottom: ${thick/2}px solid currentColor;
		transform-origin: 0% 50%;
		transform: rotateZ(135deg);
		`;
	const editorLayerClass = 'editor-layer-basic';


	// for display in editor
	const newPiece1 = addPieceToEditor(posX1, posY1, diagonalLength, height, cssText1, editorLayerClass);
	const newPiece2 = addPieceToEditor(posX2, posY2, diagonalLength, height, cssText2, editorLayerClass);

	// for use in pattern
	// tl-br
	const newCommand1 = tile => {
		const x = tile.x;
		const y = tile.y;
		const step = tile.size/editorGridSize;
		return {
			command: line,
			args: [
				x + i*step,
				y + j*step,
				x + (i+1) * step,
				y + (j+1) * step
			]
		};
	};

	//tr-bl
	const newCommand2 = tile => {
		const x = tile.x;
		const y = tile.y;
		const step = tile.size/editorGridSize;
		return {
			command: line,
			args: [
				x + (i+1) * step,
				y + j*step,
				x + i*step,
				y + (j+1) * step
			]
		};
	};

	editorPiecesCommands.push({
		editorPiece: newPiece1,
		commandVal: tile => newCommand1(tile)
	});
	editorPiecesCommands.push({
		editorPiece: newPiece2,
		commandVal: tile => newCommand2(tile)
	});
}


// ------------- LINES ACROSS TOP TO BOTTOM -------------- //


function addLinesAcrossTopDown() {

	const corners = [
		{
			x: 0, 
			y: 0
		},
		{
			x: editorSize, 
			y: 0
		},
		{
			x: editorSize, 
			y: editorSize
		},
		{
			x: 0, 
			y: editorSize
		},
	];

	corners.forEach(linesAcrossTDForCorner);
}

function linesAcrossTDForCorner({x: posXCorner, y: posYCorner}) {

	for (let j = 1; j < editorGridSize; j++) {

		const editorGridStep = editorSize / editorGridSize;
		const cathete1 = editorSize;
		const cathete2 = editorGridStep * j;
		const hypothenuse = sqrt(cathete1**2 + cathete2**2);
		const theta = asin(cathete2 / hypothenuse);
		const rotation = cssRotationForCornerTD(theta, posXCorner, posYCorner);

		const thick = editorPieceThickness;
		const width = hypothenuse;
		const height = 0;
		const cssText =  `
			border-top: ${thick/2}px solid currentColor;
			border-bottom: ${thick/2}px solid currentColor;
			transform-origin: 0px 50%;
			transform: rotateZ(${	rotation }deg);
		`;

		const editorLayerClass = 'editor-layer-across';
		
		const signDiffX = posXCorner === 0 ? 1 : -1;
		const signDiffY = posYCorner === 0 ? 1 : -1;

		// for display in editor
		const newPiece = addPieceToEditor(posXCorner, posYCorner, width, height, cssText, editorLayerClass);
		// for use in pattern
		const newCommand = tile => {
			const s = tile.size;
			const step = s/editorGridSize;
			const cornerDiffX = (posXCorner > 0 ? s : 0);
			const cornerDiffY = (posYCorner > 0 ? s : 0);
			const startX = tile.x + cornerDiffX;
			const startY = tile.y + cornerDiffY;
			return {
				command: line,
				args: [
					startX,
					startY,
					startX + signDiffX*j*step,
					startY + signDiffY*s
				]
			};
		};

		editorPiecesCommands.push({
			editorPiece: newPiece,
			commandVal: tile => newCommand(tile)
		});

	}
}

function cssRotationForCornerTD(angle, posXCorner, posYCorner) {
	if (posXCorner === 0 && posYCorner === 0) {
		// TOP LEFT
		return 90 - angle;
	}
	if (posXCorner > 0 && posYCorner === 0) {
		// TOP RIGHT
		return 90 + angle;
	}
	if (posXCorner > 0 && posYCorner > 0) {
		// BOTTOM RIGHT
		return - (90 + angle);
	}
	if (posXCorner === 0 && posYCorner > 0) {
		// BOTTOM LEFT
		return - (90 - angle);
	}
	
	throw new Error('invalid values for a corner');
}


// ----------- LINES ACROSS LEFT TO RIGHT ------------- //

function addLinesAcrossLeftRight() {

	const corners = [
		{
			x: 0, 
			y: 0
		},
		{
			x: editorSize, 
			y: 0
		},
		{
			x: editorSize, 
			y: editorSize
		},
		{
			x: 0, 
			y: editorSize
		},
	];

	corners.forEach(linesAcrossLRForCorner);
}

function linesAcrossLRForCorner({x: posXCorner, y: posYCorner}) {

	for (let j = 1; j < editorGridSize; j++) {

		const editorGridStep = editorSize / editorGridSize;
		const cathete1 = editorSize;
		const cathete2 = editorGridStep * j;
		const hypothenuse = sqrt(cathete1**2 + cathete2**2);
		const theta = asin(cathete2 / hypothenuse);
		const rotation = cssRotationForCornerLR(theta, posXCorner, posYCorner);

		const thick = editorPieceThickness;
		const width = hypothenuse;
		const height = 0;
		const cssText =  `
			border-top: ${thick/2}px solid currentColor;
			border-bottom: ${thick/2}px solid currentColor;
			transform-origin: 0px 50%;
			transform: rotateZ(${	rotation }deg);
		`;

		const editorLayerClass = 'editor-layer-across';
		
		const signDiffX = posXCorner === 0 ? 1 : -1;
		const signDiffY = posYCorner === 0 ? 1 : -1;

		// for display in editor
		const newPiece = addPieceToEditor(posXCorner, posYCorner, width, height, cssText, editorLayerClass);
		// for use in pattern
		const newCommand = tile => {
			const s = tile.size;
			const step = s/editorGridSize;
			const cornerDiffX = (posXCorner > 0 ? s : 0);
			const cornerDiffY = (posYCorner > 0 ? s : 0);
			const startX = tile.x + cornerDiffX;
			const startY = tile.y + cornerDiffY;
			return {
				command: line,
				args: [
					startX,
					startY,
					startX + signDiffX*s,
					startY + signDiffY*j*step
				]
			};
		};

		editorPiecesCommands.push({
			editorPiece: newPiece,
			commandVal: tile => newCommand(tile)
		});

	}
}

function cssRotationForCornerLR(angle, posXCorner, posYCorner) {
	if (posXCorner === 0 && posYCorner === 0) {
		// TOP LEFT
		return angle;
	}
	if (posXCorner > 0 && posYCorner === 0) {
		// TOP RIGHT
		return 180 - angle;
	}
	if (posXCorner > 0 && posYCorner > 0) {
		// BOTTOM RIGHT
		return 180 + angle;
	}
	if (posXCorner === 0 && posYCorner > 0) {
		// BOTTOM LEFT
		return - angle;
	}
	
	throw new Error('invalid values for a corner');
}