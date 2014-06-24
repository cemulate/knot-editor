function KnotVertex() {

	this.orient = -1

	this.G = null

	this.gsettings = {
		size: 1,
		cornerRadius: 0.35,
		cornerColor: "#0000FF"
	}
}

// Events: pressedVertexCorner

KnotVertex.prototype.init = function(container, orient, eventCallbacks) {
	this.orient = orient

	this._initGraphics(container)

	this._configureLogic()

	this.eventCallbacks = eventCallbacks
	return this
}

KnotVertex.prototype.setPosition = function(x, y) {
	this.G.top.x = x
	this.G.top.y = y
}

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

	var cornerMouseover = function(e) {
		e.target.alpha = 0.5
		app.stage.update()
	}

	var cornerMouseout = function(e) {
		e.target.alpha = 0.0
		app.stage.update()
	}

	for (i = 0; i < 4; i ++) {
		var c = new createjs.Shape()
		c.alpha = 0.0
		c.hitArea = new createjs.Shape()
		c.addEventListener("mouseover", cornerMouseover)
		c.addEventListener("mouseout", cornerMouseout)
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
		this.G.main.graphics.ss(SWIDTH).s("black").mt(br.x, br.y).lt(tl.x, tl.y)
		this.G.main.graphics.ss(SWIDTH).s("black").mt(bl.x, bl.y).lt(-gap, -gap).mt(gap, gap).lt(tr.x, tr.y)
	} else {
		this.G.main.graphics.ss(SWIDTH).s("black").mt(bl.x, bl.y).lt(tr.x, tr.y)
		this.G.main.graphics.ss(SWIDTH).s("black").mt(br.x, br.y).lt(gap, -gap).mt(-gap, gap).lt(tl.x, tl.y)
	}

}

KnotVertex.prototype._configureLogic = function() {

	var self = this

	this.G.main.addEventListener("pressmove", function(e) {
		var v = app.coordinates.inverseTransform(e.stageX, e.stageY)
		self.setPosition(v.x, v.y)
		app.stage.update()
	})

	for (var i = 0; i < this.G.corners.length; i ++) {
		this.G.corners[i].addEventListener("mousedown", function(e) {
			var n = self.G.corners.indexOf(e.target)
			self.eventCallbacks.pressedVertexCorner(n)
		})
	}

}

KnotVertex.prototype.getPortPosition = function (portNum) {
	var w = this.gsettings.width

	if (portNum == 0) {
		return this.position.add(V(w, w))
	} else if (portNum == 1) {
		return this.position.add(V(-w, w))
	} else if (portNum == 2) {
		return this.position.add(V(-w, -w))
	} else if (portNum == 3) {
		return this.position.add(V(w, -w))
	}
}