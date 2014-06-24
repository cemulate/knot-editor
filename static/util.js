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

function V(x, y) {
	return new Vec2(x, y)
}