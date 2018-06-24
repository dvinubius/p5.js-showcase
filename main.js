'use strict';

function setup() {
	createCanvas(windowWidth - 45, windowHeight);
	// background(245,245,245);
  background(0,0,0);
	colorMode(RGB, 255, 255, 255, 1);
  // frameRate(10);
}

function draw() {
  const green = random(0,255);
  const posX = random(0,width);
  const posY = random(0,height);
	fill(0, green, 0, random(0,0.4));
  noStroke();
	ellipse(posX, posY, 30,30);
}

function mouseWheel(event) {
	bg.s -= event.delta / 30;
	if (bg.s > 100) bg.s = 100;
	if (bg.s < 0) bg.s = 0;
}

function windowResized() {
	resizeCanvas(windowWidth - 45, windowHeight);
}
