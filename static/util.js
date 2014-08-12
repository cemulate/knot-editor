function callbackToMethod(target, func) {
	// Return a closure that applies func 'on' target
	return function () {
		func.apply(target, arguments)
	}
}


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

Vec2.prototype.dot = function(v2) {
	return (this.x*v2.x + this.y*v2.y)
}

Vec2.prototype.angle = function(v2) {
	return Math.acos((this.dot(v2)) / (this.mag() * v2.mag()))
}

Vec2.prototype.project = function(v2) {
	return v2.scale(this.dot(v2) / v2.dot(v2))
}

Vec2.prototype.rot = function(angle) {
	var c = Math.cos(angle)
	var s = Math.sin(angle)
	return new Vec2(c*this.x - s*this.y, s*this.x + c*this.y)
}

Vec2.prototype.rot90CCW = function() {
	return new Vec2(-this.y, this.x)
}

Vec2.prototype.rot90CW = function() {
	return new Vec2(this.y, -this.x)
}

Vec2.prototype.mag = function() {
	return Math.sqrt(this.x*this.x + this.y*this.y)
}

Vec2.prototype.unit = function() {
	var m = this.mag()
	return new Vec2(this.x / m, this.y / m)
}

function V(x, y) {
	return new Vec2(x, y)
}

function FSM(states) {
	this.states = states
	
	// Set the _fsmName of each state to its name in the states object
	// This makes it much easier to check if we're in a particular state
	for (var prop in this.states) {
		this.states[prop]._fsmName = prop
	}

	// Initialize to an arbitrary state, client can transition to 
	// whatever their desired initial state is
	this.state = this.states[Object.keys(this.states)[0]]

	this.cbReg = {}
}

FSM.prototype.transition = function(next) {

	for (var prop in this.states) {
		if (prop == next) {

			// Handle onLeave subscribers
			if (this.state._fsmName in this.cbReg) {
				this.cbReg[this.state._fsmName].forEach(function(val, ind, arr) {
					if (val.when == "onLeave") {
						val.callback()
					}
				})
			}

			this.state = this.states[prop]

			// Handle onEnter subscribers
			if (this.state._fsmName in this.cbReg) {
				this.cbReg[this.state._fsmName].forEach(function(val, ind, arr) {
					if (val.when == "onEnter") {
						val.callback()
					}
				})
			}

			return
		}
	}
	throw "FSM State doesn't exist"
}

FSM.prototype.inState = function(st) {
	return (this.state._fsmName == st)
}

FSM.prototype.get = function(p) {

	// Try to get a state parameter, but throw if the
	// parameter doesn't exist
	if (p in this.state) {
		return this.state[p]
	} else {
		throw "FSM Invalid Parameter"
	}
}

FSM.prototype.set = function(p, v) {

	// Try to set a state parameter, but throw if the
	// parameter doesn't exist, instead of silently adding it
	if (p in this.state) {
		this.state[p] = v
	} else {
		throw "FSM Invalid Parameter"
	}
}

FSM.prototype.register = function(stateName, when, cb) {

	// Register a callback upon entering or leaving a state

	if (!(stateName in this.states)) {
		throw "FSM State doesn't exist"
	}
	if ((when != "onEnter") && (when != "onLeave")) {
		throw "FSM Invalid callback time specifier"
	}

	if (!(stateName in this.cbReg)) {
		this.cbReg[stateName] = []
	}

	this.cbReg[stateName].push({
		when: when,
		callback: cb
	})
}