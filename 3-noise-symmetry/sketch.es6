let bg = [30,30,50];
let trajectoryPoints = [];
let circle = {
	x: 0,
	y: 0,
	initialX: 0,
	rad: 20,
	col: [165,210,168]
}
let trajCol = [230, 40, 230, 0.9];
let xoff = 0.00;
let posY;

let circleInitX;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(...bg);

	strokeWeight(2);
	initCircle();
	colorMode(RGB, 255, 255, 255, 1)
}

function draw() {
	background(...bg);


	updateCircle();
	
	drawTrajectories();
	drawCircles();
}


function initCircle() {
	posY = 0
	circleInitX = width / 4;
}
function updateCircle() {
	const noise = noiseVal(); /* between 0 and 1 */
	const n = noise * 400;
	if (posY < height) {
		posY++;
	} else {
		posY = 0;
		trajectoryPoints.splice(0);
	}
	circle.y = posY;
	circle.x = circleInitX + n;
	trajectoryPoints.push({x: circle.x, y: circle.y});
}
function drawCircles() {
	stroke(circle.col);
	ellipse(circle.x, circle.y, circle.rad);
	ellipse(width - circle.x, circle.y, circle.rad);
}

function drawTrajectories() {
	stroke(...trajCol);
	trajectoryPoints.forEach(p => {
		point(p.x, p.y);
		point(width - p.x, p.y);
	});
}

function noiseVal() {
	xoff += 0.01;
	return noise(xoff);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}