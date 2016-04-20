'use strict';

var canvasDirective = angular.module('graphApp.canvasDirective', []);

canvasDirective.directive('graphCanvas', function () {
	function link(scope, element, attrs) {
		// drawing canvas init
		var c = element.find('canvas')[0];
		var ctx = c.getContext('2d');
				
		// mark selected action as nothing
		var action = '';
		// mark state as none
		var state = '';

		// draw the graph
		drawGraph();

		// add mouse listeners
		c.onmousedown = mousedown;
		c.onmouseup = mouseup;			
		c.addEventListener("mousemove", mousemove)

		// get the relative mouse position
		function getMousePos(canvas, evt) {
			var rect = canvas.getBoundingClientRect();
			return {
				x : evt.clientX - rect.left,
				y : evt.clientY - rect.top
			};
		}
				
		/*
		 * action buttons
		 */
		scope.buttonSelect = function () {
			console.log ('button select');
			action = 'select';
			state = 'select';
		}
		scope.buttonAddVertex = function () {
			console.log ('button add vertex');
			action = 'addvertex';
			state = 'addvertex';
		}
		
		// on mouse down action
		function mousedown(e) {
			// get the mouse position
			var mousePos = getMousePos(c, e);

			console.log('Mouse down at ' + mousePos.x + ':' + mousePos.y);
			
			switch (state) {
				case 'select':
					// find a vertex at position
					scope.graph.selectedVertex = scope.findVertexAtPos(mousePos.x, mousePos.y);

					// draw the graph
					drawGraph();

					// change state if a vertex is selected
					if (scope.graph.selectedVertex != -1) {
						state = 'select.selected';
					}
					break;
				case 'addvertex':
					// find a vertex at position
					var v = scope.findVertexAtPos(mousePos.x, mousePos.y);
					
					if (v == -1) {
						// no vertex at position, a new one can be created
						scope.addVertex(mousePos.x, mousePos.y);
						
						// draw the graph
						drawGraph();
						
						// refresh the graph binding
						scope.$apply();
					}
					break;
			}

		}
		
		// on mouse move action
		function mousemove(e) {
			switch (state) {
			case 'select.selected':
				// get the mouse position
				var mousePos = getMousePos(c, e);
			
				// move the vertex
				scope.graph.vertices[scope.graph.selectedVertex].x = mousePos.x;
				scope.graph.vertices[scope.graph.selectedVertex].y = mousePos.y;
				// draw the graph
				drawGraph();
				scope.$apply();
				break;
			}
		}


		// on mouse up action
		function mouseup(e) {
			// get the mouse position
			var mousePos = getMousePos(c, e);

			console.log('Mouse up at ' + mousePos.x + ':' + mousePos.y);

			switch (state) {
				case 'select.selected':
					// change the state back to select
					state = 'select';
					
					// refresh the graph binding
					scope.$apply();
					break;
			}

		}


		/*
		 * Draw graph function
		 */
		function drawGraph() {
//			console.log('drawGraph called')
			// clear everything
			ctx.fillStyle = "white";
			ctx.clearRect(0, 0, c.width, c.height);

			// draw vertices
			for (var i = 0; i < scope.graph.vertices.length; i++) {
				var v = scope.graph.vertices[i];
				if (i == scope.graph.selectedVertex) {
					ctx.fillStyle = "red";
				} else {
					ctx.fillStyle = "black";
				}
				ctx.beginPath();
				ctx.arc(v.x, v.y, 5, 0, 2 * Math.PI, true);
				ctx.stroke();
				ctx.fill();
			}

			// draw edges
			for (var i = 0; i < scope.graph.edges.length; i++) {
				var e = scope.graph.edges[i];
				var v1 = scope.graph.vertices[e.from];
				var v2 = scope.graph.vertices[e.to];
				
				ctx.beginPath();
				ctx.moveTo(v1.x, v1.y);
				ctx.lineTo(v2.x, v2.y);
				ctx.stroke();
			}
		}

	}

	 
	return {
		restrict : 'E',
		link : link,
		template : '<div>'
				+ '<canvas id="canvasGraph" width="800" height="300" style="border:1px solid #d3d3d3;"></canvas>'
				+ '</br>'
				+ '<button ng-click="buttonSelect()">Select</button>'
				+ '<button ng-click="buttonAddVertex()">Add Vertex</button>'
				+ '</br>{{graph.edges}}{{graph.vertices}}</div>'
	};
  
});