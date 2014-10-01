// Cross browser requestAnimationFrame
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
}());

// Create class conformation icon
function confirmationIcon(elem, type) {
	this.canvas = elem;
	this.type = type || 'OK';

	this.context = this.canvas.getContext('2d');

	this.animate();
}

confirmationIcon.prototype.animate = function () {

	var icon = this;

	this.drawCircle('#009900', 4, function () {
		icon.drawTick('#009900', 12);
	});
}


confirmationIcon.prototype.drawTick = function (color, speed, callback) {
	var context = this.context;
	var canvas = this.canvas;

	context.lineWidth = 3;
	context.strokeStyle = color;
	context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    var canvasState = context.getImageData(0, 0, canvas.width, canvas.height);

    function lineAnimation(startX, startY, endX, endY, lineDoneCB, percent) {
    	var percent = percent || 0;

		context.clearRect(0, 0, canvas.width, canvas.height);
		context.putImageData(canvasState, 0, 0);
		context.beginPath();
    	context.moveTo(startX, startY);
    	context.lineTo(
    		startX + ((endX - startX) * percent / 100), 
    		startY + ((endY - startY) * percent / 100)
    	);
		context.stroke();

    	percent += speed;

    	console.log(percent);

    	if (percent > 101) {
    		if (lineDoneCB && typeof lineDoneCB == 'function') {
    			lineDoneCB.call();
    		}
    	} else {
    		requestAnimationFrame(function () {
	    		lineAnimation(startX, startY, endX, endY, lineDoneCB, percent);
    		})
    	}
    }

    var tickPoints = [
    	{ x: this.canvas.width * 0.3, y: this.canvas.height * 0.54 },
    	{ x: this.canvas.width * 0.5, y: this.canvas.height * 0.68 },
    	{ x: this.canvas.width * 0.7, y: this.canvas.height * 0.27 },
    ];

    lineAnimation(
    	tickPoints[0].x, tickPoints[0].y,
    	tickPoints[1].x, tickPoints[1].y,
    	function () {
		    canvasState = context.getImageData(0, 0, canvas.width, canvas.height);
    		lineAnimation(
		    	tickPoints[1].x, tickPoints[1].y,
		    	tickPoints[2].x, tickPoints[2].y
    		);
    	}
    )

}

confirmationIcon.prototype.drawCircle = function (color, speed, callback) {
	
	var radius = 75;
	var progress = 0;
	var endProgress = 101;

	var speed = speed || 1;

	var circ = Math.PI * 2;
    var quart = Math.PI / 2;

	var centerPoint = { x: this.canvas.width / 2, y: this.canvas.height / 2 };

	var context = this.context;
	var canvas = this.canvas;

	context.lineWidth = 3;
	context.strokeStyle = color;
	context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

	function circleAnimation(percent) {

		var startAngle = -quart;
		var endAngle = ((circ) * progress/100) - quart;

		context.clearRect(0, 0, canvas.width, canvas.height);
		context.beginPath();
        context.arc(centerPoint.x, centerPoint.y, radius, startAngle, endAngle, false);
        context.stroke();

        progress += speed;

        if (progress < endProgress) {
        	requestAnimationFrame(function () {
        		circleAnimation(progress / 100);
        	});
        } else {
        	if (callback) {
        		callback.call();
        	}
        }
	}

	circleAnimation(0);

}
