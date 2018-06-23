let bgCol = [84, 200, 158];
let baseFade = 0;
let fadeFactor = baseFade;
let mouseCol = [230,100,150,.9];
let applyFade = true;
let fader = new Fader(bgCol, baseFade);


function setup() {
	createCanvas(windowWidth, windowHeight);
	background(...bgCol);
	colorMode(RGB, 255, 255, 255, 1);
	
	console.log(fader);
}

function draw() {
	if (mouseIsPressed) {
		resetFade();
		fader.reset();
		fill(...mouseCol);
		stroke(10,20,30,.5);
		ellipse(mouseX, mouseY, 15, 15);
		stroke(100,100,100,.5);
		line(mouseX, mouseY, pmouseX, pmouseY);
	} else {
		background(...bgFade());
		incFade();
		fader.inc();
	}
}

function bgFade() {
	if (!applyFade) {
		return bgCol;
	}
	return [...bgCol,fadeFactor/500];
}
function incFade() {
	if (fadeFactor < 500) {
		fadeFactor++;
	}
}
function resetFade() {
	fadeFactor = baseFade;
}