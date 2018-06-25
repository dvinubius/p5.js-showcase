;(function TileGrid(context) {
  const TileGrid = function(size, xPos, yPos, tileSize) {
    Grid.call(this, size, xPos, yPos);
    this.tileSize = tileSize;
    this.prototype = new Grid();

    Object.setPrototypeOf(TileGrid.prototype, Grid.prototype);

    // init tiles
    this.setEach((x, y) => {
  		const tile =  new Tile(
  			this.tileSize,
  			x*this.tileSize + this.x,
  			y*this.tileSize + this.y,
        x,
        y
  		);
  		return tile;
  	});
  };

  TileGrid.prototype.positionUnderMouse = function() {
    const mPos = this.mousePosForGrid();
  	const xTile = floor(mPos.x / this.tileSize);
  	const yTile = floor(mPos.y / this.tileSize);
    return {x: xTile, y: yTile};
  }
  TileGrid.prototype.tileUnderMouse = function() {
    const posInGrid = this.gridPosUnderMouse();
  	const tile = this.get(posInGrid.x, posInGrid.y);
    return tile;
  };

  TileGrid.prototype.isMouseInside = function(margin) {
    const marg = (margin === undefined) ? 0 : margin*this.tileSize;
  	return mouseX >= this.x - marg &&
           mouseX < this.x + this.size*this.tileSize + marg &&
  				 mouseY >= this.y -marg &&
           mouseY < this.y + this.size*this.tileSize + marg;
  }

  TileGrid.prototype.neighbourhood = function(x,y,steps, circular) {
    const res = [];
    for (let i = x - steps; i <= x + steps; i++) {
      for (let j = y - steps; j <= y + steps; j++) {
        const countAsNeighbour = this.containsPos(i,j) &&
                                (circular ?
                                  this.isOnRadius(i,j,x,y,steps):
                                  true);
        if (countAsNeighbour) {
          const neighbourTile = this.get(i,j);
          res.push(neighbourTile);
        }
      }
    }
    return res;
  }
  TileGrid.prototype.neighbourhoodMouse = function(stepsAway, circular) {
    const steps = !stepsAway ? 1 : stepsAway;
    const circ = (circular === undefined) ? true : circular;
    const pos = this.positionUnderMouse();
    return this.neighbourhood(pos.x, pos.y, steps, circ);
  }

  TileGrid.prototype.containsPos = function(x,y) {
    return x >= 0 && x < this.size &&
            y >= 0 && y < this.size;
  }
  TileGrid.prototype.isOnRadius = function(i,j,x,y,steps) {
    const c1x = (i + 1/2)*this.tileSize;
    const c1y = (j + 1/2)*this.tileSize;
    const c2x = (x + 1/2)*this.tileSize;
    const c2y = (y + 1/2)*this.tileSize;
    const d = dist(c1x, c1y, c2x, c2y);
    return d <= steps*this.tileSize;
  }

  // expose in window
  context.TileGrid = TileGrid;
})(window);
