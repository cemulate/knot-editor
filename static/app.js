function KnotVertex(paper) {

	// Paper reference
	this.paper = paper;

	// Information about the vertex
	this.orientation = -1;

	// The set representing the Raphael objects
	this.set = this.paper.set();
	this.redraw();

}

KnotVertex.prototype.redraw = function() {

	this.set.clear();
	
	this.set.push(this.paper.path("M-20,-20L20,20"));
	this.set.push(this.paper.path("M-20,20L20,-20"));

	this.set.attr("stroke-width", 10);

	// The glow should be part of the set, but we
	// need an extra handle to it to show and hide it
	this.glowset = this.set.glow();
	this.set.push(this.glowset);

	this.glowset.hide();

	this.ft = this.paper.freeTransform(this.set, {
		keepRatio: true,
		rotate: false,
		scale: false
	});

	this.ft.showHandles();
	this.ft.hideHandles({undrag: false});
	console.log(this.ft);

}

function KnotEditor(element, width, height) {

	this.paper = new Raphael(element, width, height);

	var n1 = new KnotVertex(this.paper);

	//n1.set.transform("T100,100");
	console.log(n1);


}