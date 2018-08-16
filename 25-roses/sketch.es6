let radius = 600;
let n = 2;
let d = 5;
let k = n/d;

const step = 0.04;

let pathPoints;
let pathAngles;
let pathDrawn;

let index = 0;
let rotation = 0.001;

const bgCol = [200, 203, 210];
const strokeCol = [15,5,10];
const strokeCol2 = [200,35,10];
const controlsOffset = 100;

let sliderN;
let sliderD;
let valLabelN;
let valLabelD;
let valLabelTheta;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(RGB, 255, 255, 255, 1);
	smooth();

	initDOM();

	initDrawing();
}

function draw() {
	
	if (index === 0) {
		beginShape();
	}
	
	translate(width/2, height/2);
	
	
	// draw circleframe and all points shown so far,
	//  unless final shape is complete
	if (index < pathPoints.length) {
		background(bgCol);

		noFill();
		ellipse(0,0,radius, radius);


		noStroke();
		fill(...strokeCol, 0.6);
		pathDrawn.forEach(vector => {
			ellipse(vector.x, vector.y, 3,3);
		});
	} else {
		background(...bgCol, 0.18);
	}
	


	// grab new point from path
	const v = pathPoints[index];
	const theta = pathAngles[index];
	index++;

	if (!v) { // no more points => done
		rotate(rotation);
		const variable = Math.pow(rotation,1.6);
		rotation += min(0.005, variable);
		strokeWeight(1);
		stroke(strokeCol2);
		noFill();
		endShape(CLOSE);
	} else { // draw next point
		ellipse(v.x, v.y, 3,3);
		vertex(v.x, v.y); // add vertex for drawing the final shape
		pathDrawn.push(v); // remember this point as being shown already
		
		// draw visual aid line
		const x = cos(theta)*radius/2;
		const y = sin(theta)*radius/2;
		stroke(...strokeCol, 0.2);
		strokeWeight(1);
		line(-x,-y,x,y);
		valLabelTheta.html(ceil(degrees(theta)) + ' deg');
	}
}

function buildPath() {
	pathPoints = [];
	pathAngles = [];
	for (let i = 0; i < TWO_PI*d; i += step) {
		const r = radius/2 * cos(k * i);
		const x = r*cos(i);
		const y = r*sin(i);
		stroke(6);
		pathPoints.push(createVector(x,y));
		pathAngles.push(i);
	}
}


function initDOM() {

	const textColor = `rgb(${strokeCol.join(',')})`;

	sliderN = createSlider(1,10,4,1);
	sliderN.position(controlsOffset, 100);
	sliderN.size(150);
	sliderN.style('outline', 'none');
	sliderD = createSlider(1,10,2,1);
	sliderD.position(controlsOffset, 200);
	sliderD.size(150);
	sliderD.style('outline', 'none');
	sliderN.changed(initDrawing);
	sliderD.changed(initDrawing);
	sliderN.input(ev => valLabelN.html(ev.target.value));
	sliderD.input(ev => valLabelD.html(ev.target.value));

	const labelN = createSpan('n: ');
	valLabelN = createSpan();
	const labelD = createSpan('d: ');
	valLabelD = createSpan();

	labelN.position(controlsOffset + 20, 140);
	valLabelN.position(controlsOffset + 50, 140);
	labelN.style('font-size', '20px');
	valLabelN.style('font-size', '20px');
	labelN.style('color', textColor);
	valLabelN.style('color', textColor);
	labelD.position(controlsOffset + 20, 240);
	valLabelD.position(controlsOffset + 50, 240);
	labelD.style('font-size', '20px');
	valLabelD.style('font-size', '20px');
	labelD.style('color', textColor);
	valLabelD.style('color', textColor);


	const thetaLabel = createSpan('Theta : ');
	thetaLabel.position(controlsOffset, 300);
	thetaLabel.style('color', textColor);
	thetaLabel.style('font-size', '20px');
	valLabelTheta = createSpan();
	valLabelTheta.position(controlsOffset + 70, 300);
	valLabelTheta.style('color', textColor);
	valLabelTheta.style('font-size', '20px');
}

function initDrawing() {
	valLabelN.html(sliderN.value());
	valLabelD.html(sliderD.value());
	n = sliderN.value();
	d = sliderD.value();
	k = n/d;
	index = 0;
	buildPath();
	background(bgCol);
	resetMatrix();
	translate(width/2, height/2);
	stroke(strokeCol.concat(0.6));
	noFill();
	pathDrawn = [];
}

function windowResized() {
	createCanvas(windowWidth,windowHeight);
	initDrawing();
}