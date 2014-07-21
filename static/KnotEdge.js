function KnotEdge() {

	this.ends = {from: null, to: null}
	
	this.cp1 = V(0, 0)
	this.middle = V(0, 0)
	this.cp2 = V(0, 0)

	this.G = null

	this.state = {
		name: "underConstruction",
		params: {
			endPoint: V(0, 0)
		}
	}

}

KnotEdge.prototype.init = function(container, ends, cp1, middle, cp2) {
	this.ends = ends
	this.cp1 = cp1
	this.middle = middle
	this.cp2 = cp2

	this._initGraphics(container)
	this._configureLogic()

	return this
}

// *****************************************************************************************************
//
// ! Public properties / mutators
//
// *****************************************************************************************************

KnotEdge.prototype.setState = function(s) {
	this.state = s
}

KnotEdge.prototype.getState = function() {
	return this.state
}

KnotEdge.prototype.setEnds = function(ends) {
	this.ends = ends
}

KnotEdge.prototype.getEnds = function() {
	return this.ends
}

KnotEdge.prototype.setCp1 = function(p) {
	this.cp1 = p
}

KnotEdge.prototype.getCp1 = function() {
	return this.cp1
}

KnotEdge.prototype.setMiddle = function(p) {
	this.middle = p
}

KnotEdge.prototype.getMiddle = function() {
	return this.middle
}

KnotEdge.prototype.setCp2 = function(p) {
	this.cp2 = p
}

KnotEdge.prototype.getCp2 = function() {
	return this.cp2
}

KnotEdge.prototype.redraw = function() {
	this._drawTop()
	this._drawGuides()
}

KnotEdge.prototype.removeGraphics = function(container) {
	container.removeChild(this.G.top)
	container.removeChild(this.G.guide_middle)
}

KnotEdge.prototype.moveGraphicsToBack = function(container) {
	container.setChildIndex(this.G.top, 0)
}

// *****************************************************************************************************
//
// ! Graphics core
//
// *****************************************************************************************************

KnotEdge.prototype._initGraphics = function(container) {
	this.G = {}
	this.G.top = new createjs.Shape()

	this._drawTop()

	this.G.guide_middle = new createjs.Shape()
	this.G.guide_middle.hitArea = new createjs.Shape()

	this._drawGuides()

	container.addChild(this.G.top)
	container.addChild(this.G.guide_middle)

}

KnotEdge.prototype._drawTop = function() {

	var p1 = this.ends.from.vertex.getPortPosition(this.ends.from.port)
	var p2 = null
	if (this.state.name == "underConstruction") {
		p2 = this.state.params.endPoint.sub(V(0.3, 0.3))
	} else if (this.state.name == "normal") {
		var p2 = this.ends.to.vertex.getPortPosition(this.ends.to.port)
	}

	var cp0 = p1.add(p1.sub(this.ends.from.vertex.getPosition()))

	var cp3 = null
	if (this.state.name == "underConstruction") {
		cp3 = p2
	} else if (this.state.name == "normal") {
		cp3 = p2.add(p2.sub(this.ends.to.vertex.getPosition()))
	}

	this.G.top.graphics.clear()

	this.G.top.graphics.ss(GLOBALS.strokeWidth).s("black").mt(p1.x, p1.y).bt(cp0.x, cp0.y, this.cp1.x, this.cp1.y, this.middle.x, this.middle.y)
															.bt(this.cp2.x, this.cp2.y, cp3.x, cp3.y, p2.x, p2.y)

	if (this.state.name == "underConstruction") {
		this.G.top.graphics.f("red").dc(p2.x, p2.y, 0.2)
		this.G.top.graphics.ss(GLOBALS.strokeWidth * 0.5).s("black").dc(p2.x, p2.y, 0.2)
	}

}

KnotEdge.prototype._drawGuides = function() {
	var m = this.getMiddle()
	this.G.guide_middle.graphics.clear()
	this.G.guide_middle.graphics.f("white").dc(m.x, m.y, 0.2)
	this.G.guide_middle.graphics.ss(GLOBALS.strokeWidth * 0.5).s("black").dc(m.x, m.y, 0.2)
	this.G.guide_middle.hitArea.graphics.clear()
	this.G.guide_middle.hitArea.graphics.f("black").dc(m.x, m.y, 0.2)
}

KnotEdge.prototype._configureLogic = function() {

	var self = this

	this.G.guide_middle.addEventListener("pressmove", function(e) {
		var v = app.coordinates.inverseTransform(e.stageX, e.stageY)
		self.setMiddle(v)
		self.redraw()
		app.stage.update()
	})

}