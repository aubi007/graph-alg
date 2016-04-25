'use strict';

var canvasDirective = angular.module('graphApp.canvasDirective', []);

canvasDirective.directive('graphCanvas', function() {
	function link(scope, element, attrs) {
		// drawing canvas init
		var c = element.find('canvas')[0];
		var ctx = c.getContext('2d');

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

		// on mouse down action
		function mousedown(e) {
			// get the mouse position
			var mousePos = getMousePos(c, e);

			console.log('Mouse down at ' + mousePos.x + ':'
					+ mousePos.y);

			switch (state) {
			case 'select':
				// find a vertex at position
				scope.graph.selectedVertex = scope
						.findVertexAtPos(mousePos.x, mousePos.y);

				// draw the graph
				drawGraph();

				// change state if a vertex is selected
				if (scope.graph.selectedVertex != -1) {
					state = 'select.selected';
				}
				break;
			case 'addvertex':
				// find a vertex at position
				var v = scope.findVertexAtPos(mousePos.x,
						mousePos.y);

				if (v == -1) {
					// no vertex at position, a new one can be
					// created
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

			console.log('Mouse up at ' + mousePos.x + ':'
					+ mousePos.y);

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
			// console.log('drawGraph called')
			// clear everything
			ctx.fillStyle = "white";
			ctx.clearRect(0, 0, c.width, c.height);

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
					if (i == scope.graph.selectedVertex) {
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
			for (var i = 0; i < scope.graph.edges.length; i++) {
				var e = scope.getEdge(i);
				var v1 = e.from;
				var v2 = e.to;

				ctx.beginPath();
				ctx.moveTo(v1.x, v1.y);
				ctx.lineTo(v2.x, v2.y);
				ctx.stroke();

				// draw the line weight
				ctx.fillText(e.weight, (v1.x + v2.x) / 2, (v1.y + v2.y) / 2);
			}
		}
		
		scope.buttonDijkstra = function() {
			set_create('V');
			set_push('V', 'v1');
			/*
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
				alg_v = scope.graph.selectedVertex;
				if (alg_v == -1) {
					alg_v = 0;
				}
				scope.graph.vertices[alg_v].colour = 'green';

				// draw the graph
				drawGraph();
//				scope.$apply();
			}
			*/
		}

		/* 
		 * graph algorithm commands
		 */
		// create the algorithm variable space
		scope.alg = [];
		scope.alg.v1 = scope.graph.vertices[0];
		function set_create(name) {
			scope.$eval('alg.' + name + '=[];');
//			console.log(scope.alg);
		}
		function set_push(name, object) {
//			console.log(scope.$eval('alg.' + name));
			var expr = 'alg.' + name + '.push(alg.' + object + ')';
			console.log(expr);
			scope.$eval(expr);
			console.log(scope.alg)
		}
/*
 * 1  function Dijkstra(Graph, source):
 2
 3      create vertex set Q
 4
 5      for each vertex v in Graph:             // Initialization
 6          dist[v] ← INFINITY                  // Unknown distance from source to v
 7          prev[v] ← UNDEFINED                 // Previous node in optimal path from source
 8          add v to Q                          // All nodes initially in Q (unvisited nodes)
 9
10      dist[source] ← 0                        // Distance from source to source
11      
12      while Q is not empty:
13          u ← vertex in Q with min dist[u]    // Source node will be selected first
14          remove u from Q 
15          
16          for each neighbor v of u:           // where v is still in Q.
17              alt ← dist[u] + length(u, v)
18              if alt < dist[v]:               // A shorter path to v has been found
19                  dist[v] ← alt 
20                  prev[v] ← u 
21
22      return dist[], prev[]
*/

	}

	return {
		restrict : 'E',
		link : link,
		template : '<div>'
				+ '<canvas id="canvasGraph" width="800" height="300" style="border:1px solid #d3d3d3;"></canvas>'
				+ '</br>'
				+ '<button ng-click="buttonSelect()">Select</button>'
				+ '<button ng-click="buttonAddVertex()">Add Vertex</button>'
				+ '<button ng-click="buttonDijkstra()">Dijkstra</button>'
				+ '</br>{{alg.V}}</br>{{graph.edges}}</br>{{graph.vertices}}</div>'
	};

});