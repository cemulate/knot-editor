function callbackToMethod(target, func) {
	// Return a closure that applies func 'on' target
	return function () {
		func.apply(target, arguments)
	}
}

function Knot() {

	this.vertices = []
	this.edges = []

}


function Application(stage, realWidth, realHeight) {

	GLOBALS = {}

	this.state = {
		name: "noAction",
		params: {}
	}

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

	// var cred = new createjs.Shape()
	// cred.addEventListener("mouseover", function(e) {
	// 	console.log("red")
	// })
	// cred.graphics.beginFill("red").drawCircle(0, 5, 1)
	// cred.alpha = 0.3

	// var cblue = new createjs.Shape()
	// cblue.addEventListener("mouseover", function(e) {
	// 	console.log("blue")
	// })
	// cblue.graphics.beginFill("blue").drawCircle(0, 5, 0.8)

	// this.plane.addChild(cblue)
	// this.plane.addChild(cred)
	// this.stage.update()

	// ********************************************************

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

	if (this.state.name == "noAction") {

		// Transition to state "connecting"
		// Populate params object with selectedVertex, selectedPort, and a tempEdge objecte

		var p = {}

		p.selectedVertex = vertex
		p.selectedPort = portNumber
		vertex.setState({
			name: "selected",
			params: {
				selectedPort: portNumber
			}
		})

		p.tempEdge = new KnotEdge().init(this.plane, {
			from: {
				vertex: vertex,
				port: portNumber
			},
			to: null
		}, V(0, 0), V(0, 0), V(0, 0))

		p.tempEdge.setState({
			name: "underConstruction",
			params: {
				endPoint: V(3, 3)
			}
		})

		p.tempEdge.redraw()
		p.tempEdge.moveGraphicsToBack(this.plane)
		this.stage.update()

		this.state = {
			name: "connecting",
			params: p
		}


	} else if (this.state.name == "connecting") {

		// Transition back to state "noAction"
		// Finish up building the temp edge

		this.state.params.tempEdge.removeGraphics(this.plane)
		var ed = this.state.params.tempEdge

		var finalEdge = new KnotEdge().init(this.plane, {
			from: ed.getEnds().from,
			to: {
				vertex: vertex,
				port: portNumber
			}
		}, ed.getCp1(), ed.getMiddle(), ed.getCp2())

		finalEdge.setState({
			name: "normal",
			params: {}
		})

		this.k.edges.push(finalEdge)
		finalEdge.redraw()


		// Set the vertex back to normal mode

		this.state.params.selectedVertex.setState({
			name: "normal",
			params: {}
		})

		this.state.params.selectedVertex.redraw()

		this.stage.update()

		this.state = {
			name: "noAction",
			params: {}
		}

	}

}

Application.prototype.vertexMoved_cb = function(vertex) {
	var i = 0
	for (i = 0; i < this.k.edges.length; i ++) {
		var ends = this.k.edges[i].getEnds()
		if ((ends.from.vertex == vertex) || (ends.to.vertex == vertex)) {
			this.k.edges[i].redraw()
		}
	}
	this.stage.update()
}

Application.prototype.stageMouseMove = function(point) {
	if (this.state.name == "connecting") {
		var vp = this.state.params.selectedVertex.getPortPosition(this.state.params.selectedPort)
		var diff = point.sub(vp)
		var diffL = diff.rot90CCW()
		var diffR = diff.rot90CW()
		this.state.params.tempEdge.setCp1(vp.add(diff.scale(0.25)))
		this.state.params.tempEdge.setMiddle(vp.add(diff.scale(0.5)))
		this.state.params.tempEdge.setCp2(vp.add(diff.scale(0.75)))
		this.state.params.tempEdge.state.params.endPoint = point
		this.state.params.tempEdge.redraw()
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