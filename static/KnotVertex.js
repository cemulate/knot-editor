function KnotVertex() {

	this.orient = -1

	this.G = null

	this.gsettings = {
		size: 1,
		cornerRadius: 0.35,
		cornerColor: "#0000FF"
	}

	this.state = {
		name: "normal",
		params: {}
	}

	this._timers = {}
}

// *****************************************************************************************************
//
// Event Callbacks:
// 		pressedVertexPort(theVertex, portPressed)
//		vertexMoved(theVertex)
//
// *****************************************************************************************************

KnotVertex.prototype.init = function(container, orient, eventCallbacks) {
	this.orient = orient

	this._initGraphics(container)

	this._configureLogic()

	this.eventCallbacks = eventCallbacks
	return this
}

// *****************************************************************************************************
//
// ! Public properties / mutators
//
// *****************************************************************************************************

KnotVertex.prototype.setState = function(m) {
	this.state = m
	if (this.state.name == "normal") {
		this.clearCorners()
	}
}

KnotVertex.prototype.getState = function() {
	return this.state
}

KnotVertex.prototype.setPosition = function(p) {
	this.G.top.x = p.x
	this.G.top.y = p.y
}

KnotVertex.prototype.getPosition = function() {
	return V(this.G.top.x, this.G.top.y)
}

KnotVertex.prototype.setOrient = function(o) {
	this.orient = o
}

KnotVertex.prototype.getOrient = function() {
	return this.orient
}

KnotVertex.prototype.getPortPosition = function (portNum) {
	var w = this.gsettings.size
	var p = this.getPosition()
	if (portNum == 0) {
		return p.add(V(w, w))
	} else if (portNum == 1) {
		return p.add(V(-w, w))
	} else if (portNum == 2) {
		return p.add(V(-w, -w))
	} else if (portNum == 3) {
		return p.add(V(w, -w))
	}
}

KnotVertex.prototype.redraw = function() {
	this._drawMain()
}

// *****************************************************************************************************
//
// ! Graphics core
//
// *****************************************************************************************************

KnotVertex.prototype._initGraphics = function(container) {
	var w = this.gsettings.size
	var cc = this.gsettings.cornerColor
	var cr = this.gsettings.cornerRadius

	this.G = {}
	this.G.top = new createjs.Container()

	var self = this
	
	this.G.main = new createjs.Shape()
	this._drawMain()

	var hitbox = new createjs.Shape()
	hitbox.graphics.beginFill("#000000").rect(-(w-cr), -(w-cr), 2*(w-cr), 2*(w-cr))
	this.G.main.hitArea = hitbox

	this.G.top.addChild(this.G.main)

	// --------------------------------------------

	var i = 0

	this.G.corners = []

	for (i = 0; i < 4; i ++) {
		var c = new createjs.Shape()
		c.alpha = 0.0
		c.hitArea = new createjs.Shape()
		this.G.corners.push(c)
	}

	this.G.corners[0].graphics.beginFill(cc).drawCircle(w, w, cr)
	this.G.corners[0].hitArea.graphics.beginFill("#000000").drawCircle(w, w, cr)

	this.G.corners[1].graphics.beginFill(cc).drawCircle(-w, w, cr)
	this.G.corners[1].hitArea.graphics.beginFill("#000000").drawCircle(-w, w, cr)

	this.G.corners[2].graphics.beginFill(cc).drawCircle(-w, -w, cr)
	this.G.corners[2].hitArea.graphics.beginFill("#000000").drawCircle(-w, -w, cr)

	this.G.corners[3].graphics.beginFill(cc).drawCircle(w, -w, cr)
	this.G.corners[3].hitArea.graphics.beginFill("#000000").drawCircle(w, -w, cr)

	for (i = 0; i < 4; i ++) {
		this.G.top.addChild(this.G.corners[i])
	}

	// -----------------------------------------------

	container.addChild(this.G.top)
}

KnotVertex.prototype._drawMain = function() {
	var w = this.gsettings.size

	var bl = V(-w, -w)
	var br = V(w, -w)
	var tl = V(-w, w)
	var tr = V(w, w)

	this.G.main.graphics.clear()

	var gap = w / 5.0

	if (this.orient >= 0) {
		this.G.main.graphics.ss(GLOBALS.strokeWidth).s("black").mt(br.x, br.y).lt(tl.x, tl.y)
		this.G.main.graphics.ss(GLOBALS.strokeWidth).s("black").mt(bl.x, bl.y).lt(-gap, -gap).mt(gap, gap).lt(tr.x, tr.y)
	} else {
		this.G.main.graphics.ss(GLOBALS.strokeWidth).s("black").mt(bl.x, bl.y).lt(tr.x, tr.y)
		this.G.main.graphics.ss(GLOBALS.strokeWidth).s("black").mt(br.x, br.y).lt(gap, -gap).mt(-gap, gap).lt(tl.x, tl.y)
	}

}

KnotVertex.prototype.clearCorners = function() {
	var i = 0
	for (i = 0; i < this.G.corners.length; i ++) {
		this.G.corners[i].alpha = 0
		app.stage.update()
	}
}

// *****************************************************************************************************
//
// ! Self-reliant graphics logic
//
// *****************************************************************************************************

KnotVertex.prototype._configureLogic = function() {

	var self = this

	this.G.main.addEventListener("pressmove", function(e) {
		var v = app.coordinates.inverseTransform(e.stageX, e.stageY)
		self.setPosition(v)
		self.eventCallbacks.vertexMoved(self)
		app.stage.update()
	})

	for (var i = 0; i < this.G.corners.length; i ++) {
		this.G.corners[i].addEventListener("mouseover", function(e) {
			if (self.state.name == "normal") {
				e.target.alpha = 0.5
				app.stage.update()	
			}
		})
		
		this.G.corners[i].addEventListener("mouseout", function(e) {
			if (self.state.name == "normal") {
				e.target.alpha = 0.0
				app.stage.update()
			}
		})
		
		this.G.corners[i].addEventListener("mousedown", function(e) {
			if (self.state.name == "normal") {
				var n = self.G.corners.indexOf(e.target)
				self.eventCallbacks.pressedVertexPort(self, n)
			}
		})
	}

	this._timers.selectionBlink = setInterval(function() {
		if (self.state.name == "selected") {
			var c = self.G.corners[self.state.params.selectedPort]
			c.alpha = (c.alpha == 0) ? 0.5 : 0
			app.stage.update()
		}
	}, 250)

}

