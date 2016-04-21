'use strict';

var canvasDirective = angular.module('graphApp.canvasDirective', []);

canvasDirective.directive('graphCanvas', function() {
	function link(scope, element, attrs) {
		// drawing canvas init
		var c = element.find('canvas')[0];
		var ctx = c.getContext('2d');

		// mark selected vertex as nothing
		var selectedVertex = -1;
		// mark selected action as nothing
		var action = '';
		// mark state as none
		var state = '';

		var alg = '';
		var alg_v = '';

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
		scope.buttonSelect = function() {
			console.log('button select');
			action = 'select';
			state = 'select';
		}
		scope.buttonAddVertex = function() {
			console.log('button add vertex');
			action = 'addvertex';
			state = 'addvertex';
		}
		scope.buttonAddEdge = function() {
			console.log('button add edge');
			action = 'addedge';
			state = 'addedge';
		}

		// on mouse down action
		function mousedown(e) {
			// get the mouse position
			var mousePos = getMousePos(c, e);

			console.log('Mouse down at ' + mousePos.x + ':'
					+ mousePos.y);

			switch (state) {
			case 'select':
				// find a vertex at position
				selectedVertex = scope.findVertexAtPos(mousePos.x, mousePos.y);

				// draw the graph
				drawGraph();

				// change state if a vertex is selected
				if (selectedVertex != -1) {
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
			case 'addedge':
				console.log('xxx');
				selectedVertex = scope.findVertexAtPos(mousePos.x, mousePos.y);

				// draw the graph
				drawGraph();

				// change state if a vertex is selected
				if (selectedVertex != -1) {
					state = 'addedge.selected';
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
				scope.graph.vertices[selectedVertex].x = mousePos.x;
				scope.graph.vertices[selectedVertex].y = mousePos.y;
				// draw the graph
				drawGraph();
				scope.$apply();
				break;
			case 'addedge.selected':
				// get the mouse position
				var mousePos = getMousePos(c, e);
				// draw the graph
				drawGraph();
				// draw the new edge line
				ctx.beginPath();
				ctx.moveTo(scope.graph.vertices[selectedVertex].x, scope.graph.vertices[selectedVertex].y);
				ctx.lineTo(mousePos.x, mousePos.y);
				ctx.stroke();
				break;
			}
		}

		// on mouse up action
		function mouseup(e) {
			// get the mouse position
			var mousePos = getMousePos(c, e);

			console.log('Mouse up at ' + mousePos.x + ':'
					+ mousePos.y);

			switch (state) {
			case 'select.selected':
				// change the state back to select
				state = 'select';

				// refresh the graph binding
				scope.$apply();
				break;
			case 'addedge.selected':
				// find a vertex at position
				var v = scope.findVertexAtPos(mousePos.x, mousePos.y);
				if (v == -1) {
					// a vertex must be selected
					console.log('no vertex selected');
				} else if (v == selectedVertex) {
					// vertex must be different
					console.log('edge to same vertex');
				} else {
					// check if the edge already exists
					console.log('edge lookup' + selectedVertex + ':' + v);
					var e = scope.findEdgeByVertices(selectedVertex, v);
					if (e > -1) {
						console.log ('Edge exists');
					} else {
						console.log('edge created');
						// edge can be created
						scope.addEdge(selectedVertex, v, 5);

						// refresh the graph binding
						scope.$apply();
					}
				}
				// end the state
				state = 'addedge';

				// draw the graph
				drawGraph();
				break;
			}

		}

		/*
		 * Draw graph function
		 */
		function drawGraph() {
			// console.log('drawGraph called')
			// clear everything
			ctx.fillStyle = "white";
			ctx.clearRect(0, 0, c.width, c.height);

//			console.log(alg);
			// draw vertices
			for (var i = 0; i < scope.graph.vertices.length; i++) {
				var v = scope.graph.vertices[i];
				
				// choose the vertex colour
				if (alg != '') {
					// if an algorithm is running, select the
					// coluor based on the vertex attribute
					ctx.fillStyle = v.colour;
				} else {
					// else select set the selected vertex
					// colour to red and other vertices black
					if (i == selectedVertex) {
						ctx.fillStyle = "red";
					} else {
						ctx.fillStyle = "black";
					}
				}
				
		        ctx.beginPath();
		        ctx.arc(v.x,v.y,5,0,2*Math.PI, true);
		        ctx.stroke();
		        ctx.fill();
			}
			
			// draw edges
			ctx.font = "10px Arial";
			ctx.fillStyle = "black";
			for (var i = 0; i < scope.graph.edges.length; i++) {
				var e = scope.graph.edges[i];
				var v1 = scope.graph.vertices[e.from];
				var v2 = scope.graph.vertices[e.to];

				ctx.beginPath();
				ctx.moveTo(v1.x, v1.y);
				ctx.lineTo(v2.x, v2.y);
				ctx.stroke();

				// draw the line weight
				ctx.fillText(e.weight, (v1.x + v2.x) / 2,
						(v1.y + v2.y) / 2);
			}
		}
		
		scope.buttonDijkstra = function() {
			if (alg == 'dijkstra') {
				// find the shor
			} else {
				alg = 'dijkstra';
				// reset algorithms
				for (var i = 0; i < scope.graph.edges.length; i++) {
					scope.graph.edges[i].colour = 'black';
				}
				for (var i = 0; i < scope.graph.vertices.length; i++) {
					scope.graph.vertices[i].colour = 'black';
				}

				// initialise the algorithm
				// set the vertex max distance
				for (var i = 0; i < scope.graph.vertices.length; i++) {
					scope.graph.vertices[i].distance = Number.MAX_VALUE;
				}
				// select the initial vertex - if a vertex
				// is selected, start with this one,
				// otherwise start with the first one in the
				// array
				alg_v = selectedVertex;
				if (alg_v == -1) {
					alg_v = 0;
				}
				scope.graph.vertices[alg_v].colour = 'green';

				// draw the graph
				drawGraph();
//				scope.$apply();
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
				+ '<button ng-click="buttonAddEdge()">Add Edge</button>'
				+ '<button ng-click="buttonDijkstra()">Dijkstra</button>'
				+ '</br>{{graph.edges}}</br>{{graph.vertices}}</div>'
	};

});