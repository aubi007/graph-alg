'use strict';
 
var graphApp = angular.module('graphApp', [
	'graphApp.canvasDirective'
]);

graphApp.controller('AppCtrl', function ($scope, $document) {
	$scope.codes = [];
	$scope.codes.directionTypes = ['directed','undirected'];
	$scope.graph = [];
	$scope.graph.directionType = 'undirected';
	$scope.graph.vertices = [];
	$scope.graph.edges = [];
  
  //adds a new vertex to position x:y
  $scope.addVertex = function (x, y) {
   	var pos = $scope.graph.vertices.push({x:x, y:y, edges:[], colour:"black"}) - 1;
   	
   	// return the new vertex object
  	return $scope.getVertex(pos);
  };

  // adds a new edge from a vertrex from to a vertex to with a set weight.
  // if the graph is undirected, inverted edge is added too
  $scope.addEdge = function (from, to, weight) {
	var pos = $scope.graph.edges.push({from:from, to:to, weight:weight, colour:"black"}) - 1;
	
	// add edge index to the vertex list of edges
	from.edges.push(pos);
	
	// in undirected graph add also the edge index to the head
  	if ($scope.graph.directionType = 'undirected') {
  		to.edges.push(pos);
  	};
  	
  	// return the new edge object
  	return $scope.getEdge(pos); 	
  };
  
  // get the vertex at index i. Index starts at 0
  $scope.getVertex = function (i) {
	  return $scope.graph.vertices[i];
  }
  
  // get the edge at index i. Index starts at 0
  $scope.getEdge = function (i) {
	  return $scope.graph.edges[i];
  }
  
  // get the list of edges from the vertex
  $scope.getVertexEdges = function (v) {
	  var ret = [];
	  for (var i = 0; i < v.edges.length; i++) {
		  ret.push($scope.getEdge(v.edges[i]));
	  }
	  return ret;
  }
  
  // finds the vertex at x:y coordinates
  $scope.findVertexAtPos = function (x, y) {
	var maxDistance = 99.99;
	var ret = -1;

	for (var i = 0; i < $scope.graph.vertices.length; i++) {
		var vx = $scope.graph.vertices[i].x;
		var vy = $scope.graph.vertices[i].y;
		var dist = Math.sqrt((x-vx)*(x-vx) + (y-vy)*(y-vy));
		
		// vertex found
		if (dist <= 5 && dist < maxDistance) {
			console.log('Clicked on vertex ID ' + i);
			ret = i;
			maxDistance = dist;
		}
   	}
	
    return ret;
  }
  
  var v1 = $scope.addVertex(10, 10);
  var v2 = $scope.addVertex(10, 100);
  var v3 = $scope.addVertex(100, 10);
  var v4 = $scope.addVertex(100, 100);

  $scope.addEdge(v1, v2, 5);
  $scope.addEdge(v2, v3, 5);
  $scope.addEdge(v3, v4, 5);
  $scope.addEdge(v4, v1, 5);
  
});
