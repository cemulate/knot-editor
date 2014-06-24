function KnotEdge() {

	this.ends = {from: null, to: null}
	this.cp1 = V(0, 0)
	this.middle = V(0, 0)
	this.cp2 = V(0, 0)

	this.shape = null

}

KnotEdge.prototype.init = function(ends, cp1, middle, cp2) {
	this.ends = ends
	this.cp1 = cp1
	this.middle = middle
	this.cp2 = cp2

	this.shape = new createjs.Shape()

	return this
}

KnotEdge.prototype.update = function() {

	var p1 = this.ends.from.vertex.getPortPosition(this.ends.from.port)
	var p2 = this.ends.to.vertex.getPortPosition(this.ends.to.port)

	var cp0 = p1.add(p1.sub(this.ends.from.vertex.position))
	var cp3 = p2.add(p2.sub(this.ends.to.vertex.position))
	console.log(cp3)

	this.shape.graphics.clear()

	this.shape.graphics.ss(SWIDTH).s("black").mt(p1.x, p1.y).bt(cp0.x, cp0.y, this.cp1.x, this.cp1.y, this.middle.x, this.middle.y)
															.bt(this.cp2.x, this.cp2.y, cp3.x, cp3.y, p2.x, p2.y)

}