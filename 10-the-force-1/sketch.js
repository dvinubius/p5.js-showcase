"use strict";

var simulation = void 0,
    nodes = [],
    links = [],
    bubbles = [],
    creationInterval = void 0;

var nodeRadiusMin = 20;
var nodeRadiusAdded = 50;
var initialOpacity = 0.01;
var fadeInStep = 0.0035;
var creationIntervalDuration = 3000;
var maxNumberNodes = 40;

var bgColor = [120, 150, 230];
var bubbleColorFill = [20, 100, 220];
var bubbleColorStroke = [155, 175, 185];
var nodeColorFill = [255, 225, 180];
var nodeColorStroke = [255, 155, 155];
var linkColor = [250, 250, 250, .8];

var addGraphDist = 50;
var myFactor = 40;
var distanceExp = 2.4;

function setup() {
	createCanvas(windowWidth, windowHeight);
	initGraph();
	initSimulation();
	initBubbles();
	colorMode(RGB, 255, 255, 255, 1);
}

function draw() {
	translate(0.5, 0.5);
	background(bgColor);

	bubbles.forEach(function (b, index) {
		return updateBubble(b, index);
	});

	links.forEach(drawLink);

	nodes.forEach(drawNode);
}

function updateBubble(b, index) {
	b.move();
	b.opacity = min(1, b.opacity + fadeInStep);
	b.radius = min(b.maxRadius, b.radius + .2);

	var out = isOutOfCanvas(b);
	var addedToGraph = tryAddToGraph(b);

	if (out || addedToGraph) {
		bubbles.splice(index, 1); // forEach is safe for deletion
		return;
	}

	fill(bubbleColorFill.concat([b.opacity]));
	stroke(bubbleColorStroke.concat([b.opacity]));
	strokeWeight(2);

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
	simulation.force("center", d3.forceCenter(width / 2, height / 2));
}

// ----- BUBBLES -------- //

function initBubbles() {
	creationInterval = setInterval(function () {
		addBubble();
		if (nodes.length > maxNumberNodes) {
			clearInterval(creationInterval);
		}
	}, creationIntervalDuration);
}

function addBubble() {
	var _findProperPosForBubb = findProperPosForBubble(),
	    x = _findProperPosForBubb.x,
	    y = _findProperPosForBubb.y;

	var maxRadius = nodeRadiusMin + round(random(nodeRadiusAdded));
	var initialRadius = 1;
	var dx = x > width / 2 ? map(random(), 0, 1, -3, 0) : map(random(), 0, 1, 0, 3);
	var dy = y > height / 2 ? map(random(), 0, 1, -3, 0) : map(random(), 0, 1, 0, 3);
	var opacity = initialOpacity;
	var bubble = new Bubble(x, y, initialRadius, dx, dy, opacity, maxRadius);
	bubbles.push(bubble);
}

function tryAddToGraph(bubble) {
	var closestNode = simulation.find(bubble.x, bubble.y);
	var d = dist(bubble.x, bubble.y, closestNode.x, closestNode.y);
	if (d <= addGraphDist) {
		nodes.push(bubble);
		links.push({
			source: bubble,
			target: closestNode
		});

		updateSimulation();
		return true;
	} else {
		var isBubbleToLeft = bubble.x < closestNode.x;
		var isBubbleAbove = bubble.y < closestNode.y;
		var forceVal = attractionForce(closestNode, bubble, d);
		bubble.dx += isBubbleToLeft ? forceVal : -forceVal;
		bubble.dy += isBubbleAbove ? forceVal : -forceVal;
	}
	return false;
}

function isOutOfCanvas(bubble) {
	return bubble.x > width + bubble.radius || bubble.x < -bubble.radius || bubble.y < -bubble.radius || bubble.y > height + bubble.radius;
}

// ------- GRAPH & SIMULATION ---------- //

function initGraph() {
	nodes.push({ x: width / 2, y: height / 2, radius: nodeRadiusMin * 3, opacity: 1 });
}

function initSimulation() {
	simulation = d3.forceSimulation().force("link", d3.forceLink()).force("charge", d3.forceManyBody()).force("collision", d3.forceCollide().radius(function (node) {
		return node.radius + 5;
	})).force("center", d3.forceCenter(width / 2, height / 2));

	simulation.nodes(nodes).on("tick", function () {
		return updateOpacities();
	});

	simulation.force("link").links(links);

	d3.select(canvas).call(d3.drag().container(canvas).subject(dragsubject).on("start", dragstarted).on("drag", dragged).on("end", dragended));
}

function updateSimulation() {
	simulation.nodes(nodes).on("tick", function () {
		return updateOpacities();
	});
	simulation.force("link").links(links);
	simulation.alphaTarget(0.4).restart();
}

function dragsubject() {
	return simulation.find(d3.event.x, d3.event.y);
}

function dragstarted() {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	d3.event.subject.fx = d3.event.subject.x;
	d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
	d3.event.subject.fx = d3.event.x;
	d3.event.subject.fy = d3.event.y;
}

function dragended() {
	if (!d3.event.active) simulation.alphaTarget(0);
	d3.event.subject.fx = null;
	d3.event.subject.fy = null;
}

function updateOpacities() {
	nodes.forEach(function (node) {
		return node.opacity = min(1, node.opacity + fadeInStep * 4);
	});
}

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

function attractionForce(b_from, b_on, distance) {
	return b_on.radius * b_from.radius / distance ** distanceExp * myFactor;
}