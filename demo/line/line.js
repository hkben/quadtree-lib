var canvas = document.getElementById("quadtree_canvas")
var ctx = canvas.getContext("2d")
var layer = document.getElementById("layer_canvas")
var layerCtx = layer.getContext("2d")
var lineCtx = layer.getContext("2d")
var container = document.getElementById("canvas-container")
var collisitionRect = document.getElementById("canvas-collision")
var counter = document.getElementById("counter")
var width = Math.min(container.clientWidth, window.innerWidth)
var height = width === window.innerWidth ? window.innerWidth : container.clientHeight

var PointA = {x : width/2 , y : height/2}
var PointB = {x : 0 , y : 0}

quadtreeColor = 'rgba(120, 144, 156, 0.1)'
scannedColor = 'rgba(229, 57, 53, 1)'
eltColor = 'rgba(136, 14, 79, 1)'
collidingColor = '#F57F17'

eltNb = 1000
eltIncrement = 100


document.addEventListener('DOMContentLoaded', function () {
    init()
})


layer.addEventListener('click', function(event) {
	
	var containerBox = container.getBoundingClientRect()
	
	var point = {
        x: event.pageX - containerBox.left,
        y: event.pageY - containerBox.top
    }
	
	PointB = point

	updateLayer()
})

var init = function(){
    canvas.width = width
    canvas.height = height
    container.style.height = height+"px"
    ctx.clearRect(0, 0, width, height)
    ctx.lineWidth = 1
    layer.width = width
    layer.height = height
    layerCtx.clearRect(0, 0, width, height)
    layerCtx.lineWidth = 1
    quadtree = new Quadtree({
        width: width,
        height: height
    })
    var elts = []
    for(var i = 0; i < eltNb; i++) {
        var squareSize = randomNb(5, 15)
        elts.push(randomizeElement())
    }
    quadtree.pushAll(elts)
    updateCanvas()
    updateLayer()
}

var updateCanvas = function(){
    ctx.clearRect(0, 0, width, height)
    quadtree.visit(function(){
        ctx.strokeStyle = quadtreeColor
        drawQuadtree(this)
        ctx.fillStyle = eltColor
        for(i in this.contents)
            drawSquare(this.contents[i], true)
        for(i in this.oversized)
            drawSquare(this.oversized[i], true)
    })
}

var updateLayer = function(){
	lineCtx.clearRect(0, 0, width, height)
    var scanned = 0
    var colliding = 0
    var total = quadtree.size
	
    layerCtx.clearRect(0, 0, width, height)
    var containerBox = container.getBoundingClientRect()
	 
	lineCtx.beginPath()
	lineCtx.strokeStyle="white"
	lineCtx.moveTo(PointA.x,PointA.y)
	lineCtx.lineTo(PointB.x,PointB.y)
	lineCtx.stroke()
	
    quadtree.collideWithLine(PointA, PointB).forEach(function(elt) {
        layerCtx.fillStyle = collidingColor
        drawSquare(elt, true, layerCtx)
        colliding++
    })

    updateCounters(scanned, colliding, total)
}

var randomizeElement = function() {
    var squareSize = randomNb(5, 15)
    return {
        x: randomNb(0, width),
        y: randomNb(0, height),
        width: squareSize,
        height: squareSize,
        color: eltColor
    }
}

var updateCounters = function(scanned, colliding, total) {
    counter.innerHTML = "Total : " + total + " | Scanned : " + scanned + " | Colliding : " + colliding
}

var addElements = function(){
    var elementArray = []
    for(var i = 0; i < eltIncrement; i++)
        elementArray.push(randomizeElement())
    quadtree.pushAll(elementArray)
    updateCanvas()
    updateLayer()
}
