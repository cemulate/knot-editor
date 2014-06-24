function Knot() {

	this.vertices = []
	this.edges = []

}


function Application(stage, realWidth, realHeight) {

	this.stage = stage

	// Top level container
	this.plane = new createjs.Container()

	// Configure a coordinate system
	this.coordinates = new CoordinateSystemE(realWidth, realHeight)
	this.coordinates.autoSetFromWidth(100)

	SWIDTH = 0.0015 * 100

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
		pressedVertexCorner: function(cNumber) {
			console.log("Pressed port " + cNumber)
		}
	})
	this.k.vertices.push(v)

	stage.enableMouseOver()
	stage.update()

}

Application.prototype.addVertex = function(pt) {
	var v = new KnotVertex().init(pt, 1)
	this.k.vertices.push(v)
	v.shape.addEventListener("tick", function() { v.update() })
	this.plane.addChild(v.shape)
	this.stage.update()
}

Application.prototype.addEdge = function(v1, p1, v2, p2) {
	var e = new KnotEdge()
	e.shape = new createjs.Shape()
	e.ends = {from: {vertex: v1, port: p1}, to: {vertex: v2, port: p2}}
	e.middle = v1.position.add(v2.position.sub(v1.position).scale(0.5))
	e.cp1 = v1.position.add(e.middle.sub(v1.position).scale(0.5))
	e.cp2 = e.middle.add(v2.position.sub(e.middle).scale(0.5))
	e.shape.addEventListener("tick", function() { e.update() })
	this.plane.addChild(e.shape)
	this.stage.update()
}