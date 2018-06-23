;(function Fader(context) {

  const Fader = function(col, initialFactor, maxAlpha) {
    this.col = col;
    this.color = null; // initialized in reset
    this.initialFactor = initialFactor ? initialFactor : 0;
    this._ffMax = 500;
    this.maxAlpha = maxAlpha ? maxAlpha : 100;

    this.reset();
  }
  Fader.prototype.inc = function() {
    if (this.fadeFactor < this._ffMax) {
      this.fadeFactor++;
    }
    _recalcColor.call(this); // update
  }
  Fader.prototype.reset = function() {
    this.fadeFactor = this.initialFactor;
    _recalcColor.call(this); // update
  }
  Fader.prototype.maxAlpha = function(val) {
    this.maxAlpha = val;
  };

  /** internal helper */
  function _recalcColor() {
    this.color = this.col.concat([this.fadeFactor / this._ffMax * this.maxAlpha]);
  }

  context.Fader = Fader;
})(window);