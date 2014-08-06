function KnotEdge() {

	this.ends = {from: null, to: null}
	
	this.middle = V(0, 0)

	this.G = null

	this.SM = new FSM({
		normal: {},
		underConstruction: {
			endPoint: null
		}
	})

	this.SM.transition("underConstruction")
	this.SM.set("endPoint", V(0, 0))

}

KnotEdge.prototype.init = function(container, ends, middle) {
	this.ends = ends
	this.middle = middle

	this._initGraphics(container)
	this._configureLogic()

	return this
}

// *****************************************************************************************************
//
// ! Public properties / mutators
//
// *****************************************************************************************************

KnotEdge.prototype.setEnds = function(ends) {
	this.ends = ends
}

KnotEdge.prototype.getEnds = function() {
	return this.ends
}

KnotEdge.prototype.setMiddle = function(p) {
	this.middle = p
}

KnotEdge.prototype.getMiddle = function() {
	return this.middle
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
	if (this.SM.inState("underConstruction")) {
		p2 = this.SM.get("endPoint").sub(V(0.3, 0.3))
	} else if (this.SM.inState("normal")) {
		var p2 = this.ends.to.vertex.getPortPosition(this.ends.to.port)
	}

	var cp0 = p1.add(p1.sub(this.ends.from.vertex.getPosition()).scale(2.0))

	var cp3 = null
	if (this.SM.inState("underConstruction")) {
		cp3 = p2
	} else if (this.SM.inState("normal")) {
		cp3 = p2.add(p2.sub(this.ends.to.vertex.getPosition()).scale(2.0))
	}

	var len = cp0.sub(p1).mag()
	var dir = p2.sub(p1).unit()

	var cp1 = this.middle.add(dir.scale(-len))
	var cp2 = this.middle.add(dir.scale(len))

	this.G.top.graphics.clear()

	this.G.top.graphics.ss(GLOBALS.strokeWidth).s("black").mt(p1.x, p1.y).bt(cp0.x, cp0.y, cp1.x, cp1.y, this.middle.x, this.middle.y)
															.bt(cp2.x, cp2.y, cp3.x, cp3.y, p2.x, p2.y)

	if (this.SM.inState("underConstruction")) {
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