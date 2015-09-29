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

            // Results
            var res = item['Study Results'];
            if (!res) {
                res = 'No results';
            }
            item['_results'] = res;

            // Days
            var days = null;
            if (item['Completion Date']) {
              var today = new Date();
              var compl = new Date(item['Completion Date']);
              days = Math.floor((today - compl)/1000/60/60/24);
            }
            item['_days'] = (days > 0) ? days : null;

          });
          $scope.results = results;
      }, function(res) {
          //TODO: implement
          console.log(res);
      });
  }
}]);
