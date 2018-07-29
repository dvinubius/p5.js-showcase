;(function Bubble(context) {
  const Bubble = function(xPos, yPos, radius, dx, dy, opacity, maxRadius) {
    this.x = xPos; 
    this.y = yPos; 
    this.radius = radius,
    this.maxRadius = maxRadius,
    this.dx = dx ? dx : 0;
    this.dy = dy ? dy : 0;
    this.opacity = opacity ? opacity : 1;
    console.log(this.opacity);
  }

  // only primitive values - simple to clone;
  Bubble.prototype.clone = function() {
    const clone = new Tile();
    for (let key in this) {
      clone[key] = this[key];
    }
    return clone;
  }

  Bubble.prototype.move = function() {
    this.x += this.dx;
	  this.y += this.dy;
  }

  // expose in window
  context.Bubble = Bubble;
})(window);
