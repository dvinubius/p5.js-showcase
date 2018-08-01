// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Simple Particle System
// Edited Video: https://www.youtube.com/watch?v=UcdigVaIYAk

let particles = [];

const particleColor = [255, 205, 125],
  torchColor = [25, 5, 1],
  bgColor = [0, 0, 0],
  createAtOnce = 8,
  frameOffset = 0,
  xRandMargin = 360,
  particleRadius = 8,
  initialAlpha = 0.9,
  alphaDecayDiff = 0.003;

// -- NOISE
const offsetFactor = 5;
let xoff = 3.0,
  currentOffset = 0; // noise-give offset

// ------- p5.js

function setup() {
  const side = min(windowWidth, windowHeight) * 0.8;
  createCanvas(side, side);
  colorMode(RGB, 255, 255, 255, 1);
}

function draw() {
  background(bgColor);

  for (let i = 0; i < 1 + round(random(createAtOnce)); i++) {
    createAndAddParticle();
  }

  drawParticles();

  cleanupParticles();
}

function windowResized() {
  const side = min(windowWidth, windowHeight);
  resizeCanvas(side, side);
}

// -------- PARTICLES

function createAndAddParticle() {
  const p = new Particle();
  p.x = width / 2 + random(-xRandMargin, xRandMargin);
  p.y = frameOffset;
  p.vx = random(-2, 2);
  p.vy = random(1, 3);
  p.alpha = initialAlpha;
  particles.push(p);
}

function drawParticles() {
  currentOffset = (-0.5 + noiseVal()) * offsetFactor;

  particles.forEach(p => {
    p.update();
    p.show();
  });
}

function cleanupParticles() {
  particles = particles.filter(p => !p.finished());
}

function noiseVal() {
  xoff += 0.01;
  return noise(xoff);
}

class Particle {
  constructor(x, y, vx, vy, alpha) {
    this.x = x ? x : 0;
    this.y = y ? y : 0;
    this.vx = vx ? vx : 0;
    this.vy = vy ? vy : 0;
    this.alpha = alpha ? alpha : 1;
  }

  finished() {
    return this.alpha < 0;
  }

  update() {
    this.x += this.vx + currentOffset * (abs(height - this.vy) / height);
    // this.x += this.vx;
    this.y += this.vy;
    this.alpha -= alphaDecayDiff;
  }

  show() {
    noStroke();
    fill(...particleColor, this.alpha);
    ellipse(this.x, this.y, 2 * particleRadius);
  }
}
