/*

This "wraps" the Paper JS matrix class by maintaining a matrix
that represents the correct transformation according to the attributes
you have configured on the class

Access it by myCoordinateSystemE.matrix

*/

function CoordinateSystemE(real_width, real_height) {

    this.real_width = real_width
    this.real_height = real_height

    this.maxx = 10
    this.minx = -10
    this.maxy = 10
    this.miny = -10

    this._applyCoordinateChanges()

}

CoordinateSystemE.prototype.setRealWidth = function(value) {
    this.real_width = value
    this._applyCoordinateChanges()
}

CoordinateSystemE.prototype.setRealHeight = function (value) {
    this.real_height = value
    this._applyCoordinateChanges()
}

CoordinateSystemE.prototype.setMinX = function (value) {
    this.minx = value
    this._applyCoordinateChanges()
}

CoordinateSystemE.prototype.setMinY = function (value) {
    this.miny = value
    this._applyCoordinateChanges()
}

CoordinateSystemE.prototype.setMaxX = function (value) {
    this.maxx = value
    this._applyCoordinateChanges()
}

CoordinateSystemE.prototype.setMaxY = function (value) {
    this.maxy = value
    this._applyCoordinateChanges()
}

CoordinateSystemE.prototype.autoSetFromWidth = function(width) {

    // Sets left, top, width, and height such that the resultant coordinate system has the origin in the middle of the screen,
    // the desired width given, and a height determined from the width such that the aspect ratio is 1:1

    this.minx = (-width) / 2
    this.maxx = width / 2

    var h = (width / this.real_width) * this.real_height

    this.maxy = h / 2
    this.miny = -h / 2

    this._applyCoordinateChanges()

}


CoordinateSystemE.prototype._applyCoordinateChanges = function () {

    var left = this.minx
    var top = this.maxy
    var width = this.maxx - this.minx
    var height = -(this.maxy - this.miny)

    var px = ((0 - left) / width) * this.real_width
    var py = ((0 - top) / height) * this.real_height

    var sx = (1 / width) * this.real_width
    var sy = (1 / height) * this.real_height

    this.matrix = new createjs.Matrix2D(sx, 0, 0, sy, px, py)

}

CoordinateSystemE.prototype.transformPoint = function (x, y) {
    var o = this.matrix.transformPoint(x, y)
    return new Vec2(o.x, o.y)
}

CoordinateSystemE.prototype.inverseTransform = function(x, y) {
    var o = this.matrix.invert().transformPoint(x, y)
    this.matrix.invert()
    return new Vec2(o.x, o.y)
}



// A convenience function provided along with the class, since it's a rather base functionality
// This takes a coordinate system object and draws a nice coordinate plane on the chosen layer

function drawCoordinatePlane(cs, container, options) {

    cs.matrix.decompose(container)

    var width = cs.maxx - cs.minx
    var height = cs.maxy - cs.miny

    var strokeWidth = 0.0015 * width

    var xline = new createjs.Shape()
    xline.graphics.setStrokeStyle(strokeWidth).beginStroke("rgba(0, 0, 0, 0.2)").moveTo(cs.minx, 0).lineTo(cs.maxx, 0)
    container.addChild(xline)

    var yline = new createjs.Shape()
    yline.graphics.setStrokeStyle(strokeWidth).beginStroke("rgba(0, 0, 0, 0.2)").moveTo(0, cs.miny).lineTo(0, cs.maxy)
    container.addChild(yline)

    var spaceX = ('x_interval' in options) ? options.x_interval : (cs.maxx - cs.minx) / 10 || 1
    var spaceY = ('y_interval' in options) ? options.y_interval : (cs.maxy - cs.miny) / 10 || 1

    var x = 0
    for (x = 0; x < cs.maxx; x = x + spaceX) {
        var line = new createjs.Shape()
        line.graphics.setStrokeStyle(strokeWidth).beginStroke("rgba(0, 0, 0, 0.2)").moveTo(x, cs.miny).lineTo(x, cs.maxy)
        container.addChild(line)
    }

    for (x = 0; x > cs.minx; x = x - spaceX) {
        var line = new createjs.Shape()
        line.graphics.setStrokeStyle(strokeWidth).beginStroke("rgba(0, 0, 0, 0.2)").moveTo(x, cs.miny).lineTo(x, cs.maxy)
        container.addChild(line)
    }

    var y = 0
    for (y = 0; y < cs.maxy; y = y + spaceY) {
        var line = new createjs.Shape()
        line.graphics.setStrokeStyle(strokeWidth).beginStroke("rgba(0, 0, 0, 0.2)").moveTo(cs.minx, y).lineTo(cs.maxx, y)
        container.addChild(line)
    }

    for (y = 0; y > cs.miny; y = y - spaceY) {
        var line = new createjs.Shape()
        line.graphics.setStrokeStyle(strokeWidth).beginStroke("rgba(0, 0, 0, 0.2)").moveTo(cs.minx, y).lineTo(cs.maxx, y)
        container.addChild(line)
    }

}