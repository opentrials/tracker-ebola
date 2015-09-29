'use strict';

// Application
var application = angular.module('Application',[]);

// Root controller
application.controller('Controller', ['$scope', '$http', '$interval', function($scope, $http, $interval) { // jscs:disable

  // Defaults results
  $scope.results = [];

  // Updating results
  update();
  $interval(update, 5*60*1000); // 5 min

  function update() {
    $scope.results = [];
    $http.get('/api/data').
      then(function(res) {
          var results = res.data.results;
          results.forEach(function (item) {
            item['days'] = Math.floor((
              new Date() - new Date(item['Completion Date']))/1000/60/60/24);
          });
          $scope.results = results;
      }, function(res) {
          //TODO: implement
          console.log(res);
      });
  }
}]);
