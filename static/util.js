function Vec2(x, y) {
	this.x = x
	this.y = y
}

Vec2.prototype.add = function(v2) {
	return new Vec2(this.x + v2.x, this.y + v2.y)
}

Vec2.prototype.sub = function(v2) {
	return new Vec2(this.x - v2.x, this.y - v2.y)
}

Vec2.prototype.scale = function(k) {
	return new Vec2(k*this.x, k*this.y)
}

Vec2.prototype.rot90CCW = function() {
	return new Vec2(-this.y, this.x)
}

Vec2.prototype.rot90CW = function() {
	return new Vec2(this.y, -this.x)
}

function V(x, y) {
	return new Vec2(x, y)
}

// *****************************************************************************************************
//
// ! States
//
// *****************************************************************************************************

/*

Application
	{
		name: "noAction",
		params: {}
	}

	{
		name: "connecting",
		params: {
			selectedVertex: <KnotVertex>,
			selectedPort: <int>,
			tempEdge: <KnotEdge>
		}
	}


KnotVertex
	{
		name: "normal",
		params: {}
	}

	{
		name: "selected",
		params: {
			selectedPort: <int>
		}
	}


KnotEdge
	{
		name: "normal",
		params: {}
	}

	{
		name: "underConstruction",
		params: {
			endPoint: <Vec2>
		}
	}

*/