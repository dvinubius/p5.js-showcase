let myBGCol = [154, 210, 88];


function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	setAttributes('antialias', true);
	background(...myBGCol);
}

function draw() {
	background(...myBGCol);
	doDrawCandy();


	translate(-width / 2, -height/2, 0);

}

function doDrawCandy() {
	const x = mouseX - width/2;
	const y = mouseY - height/2;
  translate(x,y,-300);
  push();
  rotateZ(frameCount * 0.02);
  rotateX(frameCount * 0.02);
  rotateY(frameCount * 0.02);
  fill(110, 120, 70, 30);
  stroke(100,20,50);
  box(50);
  pop();
  translate(x,y,300);
}