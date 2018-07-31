let		simulation, 					// graph force simulation
			nodeCounter = 0;
const simUpdateAlphaTarget = 0.5,
		  forceStrengthManyBody = .8,
			forceStrengthLink =	0.3,
			distanceLink = 30,
			velocityDecay = 0.6,

			addGraphDist = 50,
			overlayPrepDist = 70,
			myFactor = 30,		// control value of attraction force of bubbles into graph
			distanceExp = 2.4; // exponent of attractionForce variation (2 = quadratic - as in coulomb force - , 3 = cubic etc.)

const bubbles = [], 		// created bubbles
			nodes	= [], 			// actual nodes of the graph
			links = [],
			bubblesApproaching = [], // bubbles producing shockOverlayPrep
			bubblesToAdd = []; // candidates to be added to the graph
			
let 	tracingCandidates = [];
const	tracingBubbleGroups = [],
			initialTraceOpacity = .5,
			fadeOutTracingStep = 0.02,
			traceColor = [200,200,200]; 
const addTracesIterations = 2;
let 	addTracesIterCounter = addTracesIterations;

let 	creationInterval;
const creationIntervalDuration = 500;

const nodeRadiusMin = 20,
			nodeRadiusAdded = 30,
			initialOpacity = 0.01,
			fadeInStep = 0.0035,
			maxNumberNodes = 30;

// const bgColor = [120,150,230];
const bgColor = [50,80,110];
let bubbleColorFill = [255,225,180],
		bubbleColorStroke = [155,175,185],
		nodeColorFill = [255,225,180],
		nodeColorStroke = [255,155,155],
		linkColor = [250,250,250,.8];




const useShockOverlay = false;
let shockOverlayAlpha = 0;
const shockOverlayColor = [250,250,250],
			shockOverlayAlphaMax = 1,
			shockOverlayAlphaDecayInc = 0.08,
			shockOverlayAlphaDecayDec = 0.01;

function setup() {
	const side = min(windowWidth, windowHeight) * 0.95;
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
	updateTracingBubbles();

	drawTracingBubbles();

	bubbles.forEach(drawBubble);

	links.forEach(drawLink);

	nodes.forEach(drawNode);

	if (useShockOverlay) {
		drawShockOverlay();
	}

	addCandidates();	
}

function drawBubble(b) {
	if (b.colorFill) {
		fill(b.colorFill.concat([b.opacity]));
	} else {
		noFill();
	}
	if (b.colorStroke) {
		stroke(b.colorStroke);
	} else {
		noStroke();
	}
	
  ellipse(b.x, b.y, b.radius, b.radius);
}

function drawTracingBubbles() {
	tracingBubbleGroups.forEach(group => group.forEach(pair => {
		const b_from = pair.traced;
		const b_to = pair.original;
		// drawBubble(b_from);
		strokeWeight(b_from.radius*0.9);
		stroke(nodeColorStroke.concat(b_from.opacity));
		line(b_from.x, b_from.y, b_to.x, b_to.y);
	}));
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

	d.colorStroke = nodeColorStroke.concat([d.opacity]);	
	strokeWeight(1);
  drawBubble(d);
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
	// const maxRadius = nodeRadiusMin + nodeRadiusAdded*0.5;
	const initialRadius = 1;
	const dx = x > width / 2 ? map(random(),0,1,-2,0) : map(random(),0,1,0,2);
	const dy = y > height / 2 ? map(random(),0,1,-2,0) : map(random(),0,1,0,2);
	const opacity = initialOpacity;
	const bubble = new Bubble(x,y,initialRadius,dx,dy, opacity, maxRadius, bubbleColorFill);
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

function updateTracingBubbles() {
	
	tracingBubbleGroups.forEach((group,index) => {
		// fade out all nodes in group
		group.forEach(pair => {
			const b = pair.traced;
			b.opacity = max(0, b.opacity - fadeOutTracingStep);
		});
		// fade out done? (first node is sufficient checking)
		if (group[0].traced.opacity === 0) {
			// eliminate group
			tracingBubbleGroups.splice(index, 1);
		}
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
		bub.id = nodeCounter;
		bub.colorStroke = nodeColorStroke;
		nodes.push(bub);
		nodeCounter++;
		links.push({
			source: bub,
			target: mate
		});
	});

	if (addedAny) {
		shockOverlayAlpha = shockOverlayAlphaMax;
		updateSimulation();
		
		bubblesToAdd.splice(0);
	
		createTracingCandidates();
	}
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

function createTracingCandidates() {
	const candidates = nodes.map(node => {
		const newNode = node.clone();
		// newNode.opacity = initialTraceOpacity;
		const pair = {
			traced: newNode, 
			original: node
		};
		return pair;
	});
	tracingCandidates = candidates;
}

// ------- GRAPH & SIMULATION ---------- //

function initGraph() {
	const rootNode = new Bubble(width/2, height/2, nodeRadiusMin * 2, 0, 0, 1, nodeRadiusMin * 2, nodeColorFill);
	rootNode.id = 0;
	rootNode.colorStroke = nodeColorStroke;
	nodes.push(rootNode);
}

function initSimulation() {
	simulation = d3.forceSimulation()
		.velocityDecay(velocityDecay)
		.force("link", d3.forceLink().distance(distanceLink).strength(forceStrengthLink))
		.force("charge", d3.forceManyBody().strength(forceStrengthManyBody))
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
	simulation.alphaTarget(simUpdateAlphaTarget).restart();
	nodes.forEach(node => node.opacity = 0.8);
	addTracesIterCounter = 0;
}

function onTick() {
	updateOpacities(); // for nodes actually in the graph
	createTraces(); // follow graph movements with traces
}
function updateOpacities() {
	nodes.forEach(node => node.opacity = min(1, node.opacity + fadeInStep*4));
}
function createTraces() {
	// create actual traces from candidates. 
	// there should be tracingCandidates available if the iterationCounter is below the max
	// when it's 0, the tracingCandidates were created in addCandidates
	// when it's >=1, the tracingCandidates were created here, in createTraces
	if (addTracesIterCounter < addTracesIterations) {		
		const newGroup = [];
		tracingCandidates.forEach(pair => {
			newGroup.push(pair);
		}); 

		newGroup.forEach(pair => {
			pair.traced.opacity = initialTraceOpacity;
			pair.traced.colorFill = traceColor;
		})	

		tracingBubbleGroups.push(newGroup);

		// prepare another set of tracingCandidates
		createTracingCandidates();
		addTracesIterCounter++;
	}
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
	simulation.alphaTarget(0.85).restart();
}