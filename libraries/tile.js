;(function Tile(context) {
  const Tile = function(size, xPos, yPos, xInGrid, yInGrid) {
    this.size = size;
    this.x = xPos; // posX in canvas
    this.y = yPos; // posY in canvas
    this.xInGrid = xInGrid,
    this.yInGrid = yInGrid
  }

  // only primitive values - simple to clone;
  Tile.prototype.clone = function() {
    const clone = new Tile();
    for (let key in this) {
      clone[key] = this[key];
    }
    return clone;
  }
  // expose in window
  context.Tile = Tile;
})(window);
