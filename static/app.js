function Vertex() {

	this.orientation = 1;

	// ----------

	this.g = null;

}

Vertex.prototype.realize = function(paper) {
	this.g = paper.group();
	this.g.add(paper.line(-20,-20,20,20));
	this.g.add(paper.line(-20,20,20,-20));
	this.g.selectAll("line").forEach(function (ob) {
		ob.attr({
			"stroke": "black",
			"stroke-width": 5
		});
	});
	this.g.add(paper.circle(0, 0, 20));
	this.g.selectAll("circle").forEach(function (ob) {
		ob.attr({
			opacity: 0
		});
	});
	this.g.drag();
}

function Edge() {

	

}