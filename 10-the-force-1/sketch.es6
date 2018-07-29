let simulation,
		nodes	= [],
		links = [],
		bubbles = [],
		creationInterval;

let idCounter = 0;

const nodeRadiusMin = 20;
const nodeRadiusAdded = 30;
const initialOpacity = 0.01;
const fadeInStep = 0.0035;
const creationIntervalDuration = 3000;
const maxNumberNodes = 20;

const bgColor = [120,150,230];
let bubbleColorFill = [255,225,180];
let bubbleColorStroke = [155,175,185];
let nodeColorFill = [255,225,180];
let nodeColorStroke = [255,155,155];
let linkColor = [250,250,250,.8];

let addGraphDist = 50;
let myFactor = 40;
let distanceExp = 2.4;
let frictionDiffUnit = 0.1;

function setup() {
	createCanvas(windowWidth, windowHeight);
	initGraph();
	initSimulation();
	initBubbles();
	colorMode(RGB, 255, 255, 255, 1);
}

function draw() {
	translate(0.5,0.5);
	background(bgColor);

	bubbles.forEach((b, index) => updateBubble(b, index));

	links.forEach(drawLink);

	nodes.forEach(drawNode);
}

function updateBubble(b, index) {
	b.move();
	b.opacity = min(1, b.opacity + fadeInStep);
	b.radius = min(b.maxRadius, b.radius + .2);

	const addedToGraph = tryAddToGraph(b);

	if (addedToGraph) {
		bubbles.splice(index, 1); // forEach is safe for deletion
		return;
	}

	fill(bubbleColorFill.concat([b.opacity]));
	noStroke();
	
  ellipse(b.x, b.y, b.radius, b.radius);
}

function drawLink(d) {
	stroke(linkColor);
	strokeWeight(2);
	line(d.source.x, d.source.y, d.target.x, d.target.y);
}

function drawNode(d) {
	//bg - cover tip of link
	noStroke();
	fill(bgColor); 
	ellipse(d.x, d.y, d.radius, d.radius);

	fill(nodeColorFill.concat([d.opacity]));
	stroke(nodeColorStroke.concat([d.opacity]));
	strokeWeight(1);
  ellipse(d.x, d.y, d.radius, d.radius);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	simulation.force("center", d3.forceCenter(width/2, height/2));
}

// ----- BUBBLES -------- //

function initBubbles() {
	creationInterval = setInterval(() => {
		addBubble();
		if (nodes.length > maxNumberNodes) {
			clearInterval(creationInterval);
		}
	}, creationIntervalDuration);
}

function addBubble() {
	const {x,y} = findProperPosForBubble();
	const maxRadius = nodeRadiusMin + round(random(nodeRadiusAdded));
	const initialRadius = 1;
	const dx = x > width / 2 ? map(random(),0,1,-3,0) : map(random(),0,1,0,3);
	const dy = y > height / 2 ? map(random(),0,1,-3,0) : map(random(),0,1,0,3);
	const opacity = initialOpacity;
	const bubble = new Bubble(x,y,initialRadius,dx,dy, opacity, maxRadius);
	bubbles.push(bubble);
}

function tryAddToGraph(bubble) {
	const closestNode = simulation.find(bubble.x, bubble.y);
	const d = dist(bubble.x, bubble.y, closestNode.x, closestNode.y);
	if (d <= addGraphDist) {
		nodes.push(bubble);
		links.push({
			source: bubble,
			target: closestNode
		});
		bubble.id = ++idCounter;

		bubbles.splice(bubbles.indexOf(bubble),1);
		updateSimulation();
		return true;
	} else {
		const isBubbleToLeft = bubble.x < closestNode.x;
		const isBubbleAbove = bubble.y < closestNode.y;
		const forceVal = attractionForce(closestNode, bubble, d);
		bubble.dx += isBubbleToLeft ? forceVal : -forceVal;
		bubble.dy += isBubbleAbove ? forceVal : -forceVal;
	}
	return false;
}

// ------- GRAPH & SIMULATION ---------- //

function initGraph() {
	nodes.push({x: width/2, y: height/2, radius: nodeRadiusMin * 3, opacity: 1, id: 0});
}

function initSimulation() {
	simulation = d3.forceSimulation()
		.force("link", d3.forceLink())
		.force("charge", d3.forceManyBody().strength(120))
		.force("collision", d3.forceCollide()
														.radius(node => node.radius+5))
		.force("center", d3.forceCenter(width / 2, height / 2));

	simulation
			.nodes(nodes)
			.on("tick", () => onTick());

	simulation.force("link")
			.links(links);
}

function updateSimulation() {
	simulation.nodes(nodes).on("tick", () => onTick());
	simulation.force("link").links(links);
	simulation.alphaTarget(0.4).restart();
}

function onTick() {
	updateOpacities();
	const fu = frictionDiffUnit
	nodes.forEach(node => {
		node.dx = (node.dx > 0) ? node.dx - fu : node.dx + fu;
		node.dy = (node.dy > 0) ? node.dy - fu : node.dy + fu;
	});
}
function updateOpacities() {
	nodes.forEach(node => node.opacity = min(1, node.opacity + fadeInStep*4));
}

// ------- AUX -------- //

function findProperPosForBubble() {
	let x,y;
	let foundProperPos = false;
	while (!foundProperPos) {
		x = random(width);
		y = random(height);
		if (dist(x,y,width/2,height/2) > min(width,height)*0.4) {
			foundProperPos = true;
		}
	}
	return {x: x, y: y};
}

function isOutOfCanvas(bubble) {
	return bubble.x > width + bubble.radius || 
				 bubble.x < -bubble.radius 				|| 
				 bubble.y < -bubble.radius 				|| 
				 bubble.y > height + bubble.radius;
}

function attractionForce(b_from, b_on, distance) {
	return (b_on.radius*b_from.radius)/(distance**distanceExp)*myFactor;
}