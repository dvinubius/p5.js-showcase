let		simulation;				// graph force simulation


const bubbles = [], 		// created bubbles
			nodes	= [], 			// actual nodes of the graph
			links = [],
			bubblesApproaching = [], // bubbles producing shockOverlayPrep
			bubblesToAdd = []; // candidates to be added to the graph 

let 	creationInterval;
const creationIntervalDuration = 2000;

const nodeRadiusMin = 20,
			nodeRadiusAdded = 30,
			initialOpacity = 0.01,
			fadeInStep = 0.0035,
			maxNumberNodes = 20;

const bgColor = [120,150,230];
let bubbleColorFill = [255,225,180],
		bubbleColorStroke = [155,175,185],
		nodeColorFill = [255,225,180],
		nodeColorStroke = [255,155,155],
		linkColor = [250,250,250,.8];

let addGraphDist = 50,
		overlayPrepDist = 70,
		myFactor = 40,
		distanceExp = 2.4,
		velocityDecay = 0.4;


const useShockOverlay = true;
let shockOverlayAlpha = 0;
const shockOverlayColor = [250,250,250],
			shockOverlayAlphaMax = 1,
			shockOverlayAlphaDecayInc = 0.08,
			shockOverlayAlphaDecayDec = 0.01;

function setup() {
	const side = min(windowWidth, windowHeight) * 0.8;
	createCanvas(side, side);
	initGraph();
	initSimulation();
	initBubbles();
	colorMode(RGB, 255, 255, 255, 1);
}

function draw() {
	translate(0.5,0.5);
	background(bgColor);

	updateBubbles();

	bubbles.forEach(drawBubble);

	links.forEach(drawLink);

	nodes.forEach(drawNode);

	if (useShockOverlay) {
		drawShockOverlay();
	}

	addCandidates();	
}

function drawBubble(b) {
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

function drawShockOverlay() {
	const shouldIncreaseAlpha = bubblesApproaching.length > 0 && shockOverlayAlpha < shockOverlayAlphaMax;
	const shouldDecreaseAlpha = bubblesApproaching.length === 0 && shockOverlayAlpha > 0;
	if (shouldIncreaseAlpha) {
		shockOverlayAlpha += shockOverlayAlphaDecayInc;
	}
	if (shouldDecreaseAlpha) {
		shockOverlayAlpha -= shockOverlayAlphaDecayDec;
	}

	background(shockOverlayColor.concat([shockOverlayAlpha]));
}

function windowResized() {
	const side = min(windowWidth, windowHeight) * 0.7;
	resizeCanvas(side, side);
	simulation.force("center", d3.forceCenter(width/2, height/2));
}

// ----- BUBBLES and Adding to Graph -------- //

function initBubbles() {
	creationInterval = setInterval(() => {
		createBubble();
		if (nodes.length > maxNumberNodes) {
			clearInterval(creationInterval);
		}
	}, creationIntervalDuration);
}

function createBubble() {
	const {x,y} = findProperPosForBubble();
	const maxRadius = nodeRadiusMin + round(random(nodeRadiusAdded));
	const initialRadius = 1;
	const dx = x > width / 2 ? map(random(),0,1,-3,0) : map(random(),0,1,0,3);
	const dy = y > height / 2 ? map(random(),0,1,-3,0) : map(random(),0,1,0,3);
	const opacity = initialOpacity;
	const bubble = new Bubble(x,y,initialRadius,dx,dy, opacity, maxRadius);
	bubbles.push(bubble);
}

function updateBubbles() {
	bubbles.forEach((b, index) => {
		b.move();
		b.opacity = min(1, b.opacity + fadeInStep);
		b.radius = min(b.maxRadius, b.radius + .2);

		if (isWayOutOfCanvas(b)) {
			bubbles.splice(index, 1); // forEach is safe for deletion
			return;
		}

		tryAddToGraph(b); // if adding is possible, remove from bubbles:[] and push to bubblesToAdd:[]
	});
}

function tryAddToGraph(bubble) {
	const closestNode = simulation.find(bubble.x, bubble.y);
	const d = dist(bubble.x, bubble.y, closestNode.x, closestNode.y);
	if (useShockOverlay) {
		checkApproachingForOverlay();
	}
	if (d <= addGraphDist) {
		makeGraphCandidate(bubble, closestNode);
	} else {
		pullTowardsNode(bubble, closestNode, d);
	}
}

function checkApproachingForOverlay(bubble, distanceToANode) {
	const registeredAsApproaching = bubblesApproaching.indexOf(bubble) !== -1;
	if (distanceToANode <= overlayPrepDist && 
			!registeredAsApproaching) {
		bubblesApproaching.push(bubble);
	}
}

function addCandidates() {
	let addedAny = false;
	bubblesToAdd.forEach(({bubble: bub, mateInGraph: mate}) => {
		addedAny = true;
		nodes.push(bub);
		links.push({
			source: bub,
			target: mate
		});
	});

	if (addedAny) {
		shockOverlayAlpha = shockOverlayAlphaMax;
		updateSimulation();
	}

	bubblesToAdd.splice(0);
}

function makeGraphCandidate(bubble, closestNode) {
	bubblesToAdd.push({
		bubble: bubble, 
		mateInGraph: closestNode
	});

	bubbles.splice(bubbles.indexOf(bubble),1);
	
	if (useShockOverlay) {
		bubblesApproaching.splice(bubblesApproaching.indexOf(bubble), 1);
	}
}

function pullTowardsNode(bubble, closestNode, distance) {
	const isBubbleToLeft = bubble.x < closestNode.x;
	const isBubbleAbove = bubble.y < closestNode.y;
	const forceVal = attractionForce(closestNode, bubble, distance);
	bubble.dx += isBubbleToLeft ? forceVal : -forceVal;
	bubble.dy += isBubbleAbove ? forceVal : -forceVal;
}

// ------- GRAPH & SIMULATION ---------- //

function initGraph() {
	nodes.push({x: width/2, y: height/2, radius: nodeRadiusMin * 3, opacity: 1, id: 0});
}

function initSimulation() {
	simulation = d3.forceSimulation()
		.velocityDecay(velocityDecay)
		.force("link", d3.forceLink().distance(20).strength(0.7))
		.force("charge", d3.forceManyBody().strength(120))
		.force("collision", d3.forceCollide()
														.radius(node => node.radius + 10))
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
	simulation.alphaTarget(0.2).restart();
}

function onTick() {
	updateOpacities();
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

function isWayOutOfCanvas(bubble) {
	const margin = bubble.radius + width/4;
	return bubble.x > width + margin 	|| 
				 bubble.x < -margin					|| 
				 bubble.y < -margin 				|| 
				 bubble.y > height + margin;
}

function attractionForce(b_from, b_on, distance) {
	return (b_on.radius*b_from.radius)/(distance**distanceExp)*myFactor;
}

function mouseClicked() {
	// console.log('bubbles: ', bubbles);
	// console.log('candidates: ', bubblesToAdd);
	// console.log('nodes: ', nodes);
	// console.log('approaching: ', bubblesApproaching); 
	// simulation.alphaTarget(0.01).restart();
}