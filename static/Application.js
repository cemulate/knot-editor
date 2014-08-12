	
function Knot() {

	this.vertices = []
	this.edges = []

}


function Application(stage, realWidth, realHeight) {

	GLOBALS = {}

	this.SM = new FSM({
		noAction: {
			cMousePosition: null
		},
		connecting: {
			selectedVertex: null,
			selectedPort: null,
			tempEdge: null
		}
	})

	this.SM.transition("noAction")

	// ************* Create EaselJS environment **************
	this.stage = stage

	// Top level container
	this.plane = new createjs.Container()

	GLOBALS.spaceWidth = 100
	GLOBALS.strokeWidth = GLOBALS.spaceWidth * 0.0015

	// Configure a coordinate system
	this.coordinates = new CoordinateSystemE(realWidth, realHeight)
	this.coordinates.autoSetFromWidth(GLOBALS.spaceWidth)

	// Apply the coordinate system transformation matrix to the top level container
	this.coordinates.matrix.decompose(this.plane)

	// Draw the coordinate plane onto a container
	this.cgrid = new createjs.Container()
	drawCoordinatePlane(this.coordinates, this.cgrid, {})

	// Add the grid and the top level container to the stage
	this.stage.addChild(this.cgrid)
	this.stage.addChild(this.plane)

	this.k = new Knot()

	var v = new KnotVertex().init(this.plane, 1, {
		pressedVertexPort: callbackToMethod(this, this.pressedVertexPort_cb),
		vertexMoved: callbackToMethod(this, this.vertexMoved_cb)
	})
	this.k.vertices.push(v)

	var v2 = new KnotVertex().init(this.plane, 1, {
		pressedVertexPort: callbackToMethod(this, this.pressedVertexPort_cb),
		vertexMoved: callbackToMethod(this, this.vertexMoved_cb)
	})
	v2.setPosition(V(5, 5))
	v2.redraw()
	this.k.vertices.push(v2)

	var self = this
	stage.on("stagemousemove", function(e) {
		var v = self.coordinates.inverseTransform(e.stageX, e.stageY)
		self.stageMouseMove(v)
	})

	stage.enableMouseOver()
	stage.update()

}

Application.prototype.pressedVertexPort_cb = function(vertex, portNumber) {

	if (this.SM.inState("noAction")) {

		// Transition to state "connecting"
		// Populate params object with selectedVertex, selectedPort, and a tempEdge objecte

		vertex.SM.transition("selected")
		vertex.SM.set("selectedPort", portNumber)

		var end = this.SM.get("cMousePosition")
		var vp = vertex.getPortPosition(portNumber)
		var diff = end.sub(vp)
		var mid = vp.add(diff.scale(0.5))

		var tempEdge = new KnotEdge().init(this.plane, {
			from: {
				vertex: vertex,
				port: portNumber
			},
			to: null
		}, mid)

		tempEdge.SM.transition("underConstruction")
		tempEdge.SM.set("endPoint", end)

		tempEdge.redraw()
		tempEdge.moveGraphicsToBack(this.plane)
		this.stage.update()

		this.SM.transition("connecting")
		this.SM.set("selectedVertex", vertex)
		this.SM.set("selectedPort", portNumber)
		this.SM.set("tempEdge", tempEdge)


	} else if (this.SM.inState("connecting")) {

		// Transition back to state "noAction"
		// Finish up building the temp edge

		var ed = this.SM.get("tempEdge")

		ed.removeGraphics(this.plane)

		var finalEdge = new KnotEdge().init(this.plane, {
			from: ed.getEnds().from,
			to: {
				vertex: vertex,
				port: portNumber
			}
		}, ed.getMiddle())

		finalEdge.SM.transition("normal")

		this.k.edges.push(finalEdge)
		finalEdge.redraw()


		// Set the vertex back to normal mode

		var vert = this.SM.get("selectedVertex")

		vert.SM.transition("normal")

		vert.redraw()

		this.stage.update()

		this.SM.transition("noAction")

	}

}

Application.prototype.vertexMoved_cb = function(vertex, old, newP) {
	var i = 0
	for (i = 0; i < this.k.edges.length; i ++) {
		var ed = this.k.edges[i]
		var ends = ed.getEnds()
		if ((ends.from.vertex == vertex) || (ends.to.vertex == vertex)) {

			var oldFrom = (ends.from.vertex == vertex) ? old : ed.getFromPosition()
			var oldTo = (ends.to.vertex == vertex) ? old : ed.getToPosition()

			var oldFromTo = oldTo.sub(oldFrom)
			var oldFromMid = ed.getMiddle().sub(oldFrom)

			var mult = (oldFromMid.project(oldFromTo).mag()) / oldFromTo.mag()
			if (Math.abs(mult) > 1.0) {
				mult = 0.0
			}
			if (ends.from.vertex == ends.to.vertex) {
				mult = 1.0
			}

			var delta = newP.sub(old)

			var newMiddle = ed.getMiddle().add(delta.scale(mult))

			ed.setMiddle(newMiddle)

			if (ends.from.vertex != ends.to.vertex) {
	
			}

			ed.redraw()
		}
	}
	this.stage.update()
}

Application.prototype.stageMouseMove = function(point) {
	if (this.SM.inState("noAction")) {
		this.SM.set("cMousePosition", point)
	}
	if (this.SM.inState("connecting")) {
		var vp = this.SM.get("selectedVertex").getPortPosition(this.SM.get("selectedPort"))
		var diff = point.sub(vp)
		var ed = this.SM.get("tempEdge")
		ed.setMiddle(vp.add(diff.scale(0.5)))
		ed.SM.set("endPoint", point)
		ed.redraw()
		this.stage.update()
	}
}


// Application.prototype.addVertex = function(pt) {
// 	var v = new KnotVertex().init(pt, 1)
// 	this.k.vertices.push(v)
// 	v.shape.addEventListener("tick", function() { v.update() })
// 	this.plane.addChild(v.shape)
// 	this.stage.update()
// }

// Application.prototype.addEdge = function(v1, p1, v2, p2) {
// 	var e = new KnotEdge()
// 	e.shape = new createjs.Shape()
// 	e.ends = {from: {vertex: v1, port: p1}, to: {vertex: v2, port: p2}}
// 	e.middle = v1.position.add(v2.position.sub(v1.position).scale(0.5))
// 	e.cp1 = v1.position.add(e.middle.sub(v1.position).scale(0.5))
// 	e.cp2 = e.middle.add(v2.position.sub(e.middle).scale(0.5))
// 	e.shape.addEventListener("tick", function() { e.update() })
// 	this.plane.addChild(e.shape)
// 	this.stage.update()
// }
