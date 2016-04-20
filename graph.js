'use strict';
 
var graphApp = angular.module('graphApp', [
  'graphApp.canvasDirective'
]);

graphApp.controller('AppCtrl', function ($scope, $document) {
  $scope.graph = [];
  $scope.graph.vertices = [];
  $scope.graph.edges = [];
  $scope.graph.selectedVertex = -1;
  $scope.tst = 'tst';
  
  //adds a new vertex to position x:y
  $scope.addVertex = function (x, y) {
  	var pos = $scope.graph.vertices.length;
  	$scope.graph.vertices[pos] = {x:x, y:y};
  	return pos
  };

  // adds a new edge from a vertrex with index from to a vertex with index to with a defined weight
  $scope.addEdge = function (from, to, weight) {
  	var pos = $scope.graph.edges.length;
  	$scope.graph.edges[pos] = {from:from, to:to, weight:weight};
  	return pos
  };
  
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
  
  $scope.addVertex(10, 10);
  $scope.addVertex(10, 100);
  $scope.addVertex(100, 10);
  $scope.addVertex(100, 100);

  $scope.addEdge(0, 1, 5);
  $scope.addEdge(1, 2, 5);
  $scope.addEdge(2, 3, 5);
  $scope.addEdge(3, 0, 5);
  

});
