"use strict";

var simulation = void 0,
    // graph force simulation
nodeCounter = 0;
var simUpdateAlphaTarget = 0.5,
    forceStrengthManyBody = .8,
    forceStrengthLink = 0.3,
    distanceLink = 30,
    velocityDecay = 0.6,
    addGraphDist = 50,
    overlayPrepDist = 70,
    myFactor = 30,
    // control value of attraction force of bubbles into graph
distanceExp = 2.4; // exponent of attractionForce variation (2 = quadratic - as in coulomb force - , 3 = cubic etc.)

var bubbles = [],
    // created bubbles
nodes = [],
    // actual nodes of the graph
links = [],
    bubblesApproaching = [],
    // bubbles producing shockOverlayPrep
bubblesToAdd = []; // candidates to be added to the graph

var tracingCandidates = [];
var tracingBubbleGroups = [],
    initialTraceOpacity = .5,
    fadeOutTracingStep = 0.02,
    traceColor = [200, 200, 200];
var addTracesIterations = 2;
var addTracesIterCounter = addTracesIterations;

var creationInterval = void 0;
var creationIntervalDuration = 500;

var nodeRadiusMin = 20,
    nodeRadiusAdded = 30,
    initialOpacity = 0.01,
    fadeInStep = 0.0035,
    maxNumberNodes = 30;

// const bgColor = [120,150,230];
var bgColor = [50, 80, 110];
var bubbleColorFill = [255, 225, 180],
    bubbleColorStroke = [155, 175, 185],
    nodeColorFill = [255, 225, 180],
    nodeColorStroke = [255, 155, 155],
    linkColor = [250, 250, 250, .8];

var useShockOverlay = false;
var shockOverlayAlpha = 0;
var shockOverlayColor = [250, 250, 250],
    shockOverlayAlphaMax = 1,
    shockOverlayAlphaDecayInc = 0.08,
    shockOverlayAlphaDecayDec = 0.01;

function setup() {
	var side = min(windowWidth, windowHeight) * 0.8;
	createCanvas(side, side);
	initGraph();
	initSimulation();
	initBubbles();
	colorMode(RGB, 255, 255, 255, 1);
}

function draw() {
	translate(0.5, 0.5);
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
	tracingBubbleGroups.forEach(function (group) {
		return group.forEach(function (pair) {
			var b_from = pair.traced;
			var b_to = pair.original;
			// drawBubble(b_from);
			strokeWeight(b_from.radius * 0.9);
			stroke(nodeColorStroke.concat(b_from.opacity));
			line(b_from.x, b_from.y, b_to.x, b_to.y);
		});
	});
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
	var shouldIncreaseAlpha = bubblesApproaching.length > 0 && shockOverlayAlpha < shockOverlayAlphaMax;
	var shouldDecreaseAlpha = bubblesApproaching.length === 0 && shockOverlayAlpha > 0;
	if (shouldIncreaseAlpha) {
		shockOverlayAlpha += shockOverlayAlphaDecayInc;
	}
	if (shouldDecreaseAlpha) {
		shockOverlayAlpha -= shockOverlayAlphaDecayDec;
	}

	background(shockOverlayColor.concat([shockOverlayAlpha]));
}

function windowResized() {
	var side = min(windowWidth, windowHeight) * 0.7;
	resizeCanvas(side, side);
	simulation.force("center", d3.forceCenter(width / 2, height / 2));
}

// ----- BUBBLES and Adding to Graph -------- //

function initBubbles() {
	creationInterval = setInterval(function () {
		createBubble();
		if (nodes.length > maxNumberNodes) {
			clearInterval(creationInterval);
		}
	}, creationIntervalDuration);
}

function createBubble() {
	var _findProperPosForBubb = findProperPosForBubble(),
	    x = _findProperPosForBubb.x,
	    y = _findProperPosForBubb.y;

	var maxRadius = nodeRadiusMin + round(random(nodeRadiusAdded));
	// const maxRadius = nodeRadiusMin + nodeRadiusAdded*0.5;
	var initialRadius = 1;
	var dx = x > width / 2 ? map(random(), 0, 1, -2, 0) : map(random(), 0, 1, 0, 2);
	var dy = y > height / 2 ? map(random(), 0, 1, -2, 0) : map(random(), 0, 1, 0, 2);
	var opacity = initialOpacity;
	var bubble = new Bubble(x, y, initialRadius, dx, dy, opacity, maxRadius, bubbleColorFill);
	bubbles.push(bubble);
}

function updateBubbles() {
	bubbles.forEach(function (b, index) {
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

	tracingBubbleGroups.forEach(function (group, index) {
		// fade out all nodes in group
		group.forEach(function (pair) {
			var b = pair.traced;
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
	var closestNode = simulation.find(bubble.x, bubble.y);
	var d = dist(bubble.x, bubble.y, closestNode.x, closestNode.y);
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
	var registeredAsApproaching = bubblesApproaching.indexOf(bubble) !== -1;
	if (distanceToANode <= overlayPrepDist && !registeredAsApproaching) {
		bubblesApproaching.push(bubble);
	}
}

function addCandidates() {
	var addedAny = false;
	bubblesToAdd.forEach(function (_ref) {
		var bub = _ref.bubble,
		    mate = _ref.mateInGraph;

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

	bubbles.splice(bubbles.indexOf(bubble), 1);

	if (useShockOverlay) {
		bubblesApproaching.splice(bubblesApproaching.indexOf(bubble), 1);
	}
}

function pullTowardsNode(bubble, closestNode, distance) {
	var isBubbleToLeft = bubble.x < closestNode.x;
	var isBubbleAbove = bubble.y < closestNode.y;
	var forceVal = attractionForce(closestNode, bubble, distance);
	bubble.dx += isBubbleToLeft ? forceVal : -forceVal;
	bubble.dy += isBubbleAbove ? forceVal : -forceVal;
}

function createTracingCandidates() {
	var candidates = nodes.map(function (node) {
		var newNode = node.clone();
		// newNode.opacity = initialTraceOpacity;
		var pair = {
			traced: newNode,
			original: node
		};
		return pair;
	});
	tracingCandidates = candidates;
}

// ------- GRAPH & SIMULATION ---------- //

function initGraph() {
	var rootNode = new Bubble(width / 2, height / 2, nodeRadiusMin * 2, 0, 0, 1, nodeRadiusMin * 2, nodeColorFill);
	rootNode.id = 0;
	rootNode.colorStroke = nodeColorStroke;
	nodes.push(rootNode);
}

function initSimulation() {
	simulation = d3.forceSimulation().velocityDecay(velocityDecay).force("link", d3.forceLink().distance(distanceLink).strength(forceStrengthLink)).force("charge", d3.forceManyBody().strength(forceStrengthManyBody)).force("collision", d3.forceCollide().radius(function (node) {
		return node.radius + 10;
	})).force("center", d3.forceCenter(width / 2, height / 2));

	simulation.nodes(nodes).on("tick", function () {
		return onTick();
	});

	simulation.force("link").links(links);
}

function updateSimulation() {
	simulation.nodes(nodes).on("tick", function () {
		return onTick();
	});
	simulation.force("link").links(links);
	simulation.alphaTarget(simUpdateAlphaTarget).restart();
	nodes.forEach(function (node) {
		return node.opacity = 0.8;
	});
	addTracesIterCounter = 0;
}

function onTick() {
	updateOpacities(); // for nodes actually in the graph
	createTraces(); // follow graph movements with traces
}
function updateOpacities() {
	nodes.forEach(function (node) {
		return node.opacity = min(1, node.opacity + fadeInStep * 4);
	});
}
function createTraces() {
	// create actual traces from candidates. 
	// there should be tracingCandidates available if the iterationCounter is below the max
	// when it's 0, the tracingCandidates were created in addCandidates
	// when it's >=1, the tracingCandidates were created here, in createTraces
	if (addTracesIterCounter < addTracesIterations) {
		var newGroup = [];
		tracingCandidates.forEach(function (pair) {
			newGroup.push(pair);
		});

		newGroup.forEach(function (pair) {
			pair.traced.opacity = initialTraceOpacity;
			pair.traced.colorFill = traceColor;
		});

		tracingBubbleGroups.push(newGroup);

		// prepare another set of tracingCandidates
		createTracingCandidates();
		addTracesIterCounter++;
	}
}

// ------- AUX -------- //

function findProperPosForBubble() {
	var x = void 0,
	    y = void 0;
	var foundProperPos = false;
	while (!foundProperPos) {
		x = random(width);
		y = random(height);
		if (dist(x, y, width / 2, height / 2) > min(width, height) * 0.4) {
			foundProperPos = true;
		}
	}
	return { x: x, y: y };
}

function isWayOutOfCanvas(bubble) {
	var margin = bubble.radius + width / 4;
	return bubble.x > width + margin || bubble.x < -margin || bubble.y < -margin || bubble.y > height + margin;
}

function attractionForce(b_from, b_on, distance) {
	return b_on.radius * b_from.radius / distance ** distanceExp * myFactor;
}

function mouseClicked() {
	simulation.alphaTarget(0.85).restart();
}