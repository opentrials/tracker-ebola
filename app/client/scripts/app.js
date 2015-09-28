'use strict';

// Application
var application = angular.module('Application',[]);

// Root controller
application.controller('Controller', ['$scope', '$http', function($scope, $http) { // jscs:disable

  // Make an API call
  $http.get('/api/data').
    then(function(res) {
      $scope.results = res.data.results;
    }, function(res) {
      //TODO: implement
      console.log(res);
    });

}]);
