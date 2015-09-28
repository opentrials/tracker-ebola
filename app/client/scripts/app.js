'use strict';

// Application
var application = angular.module('Application',[]);

// Root controller
application.controller('Controller', ['$scope', '$http', function($scope, $http) {

    // Make an API call
    $http.get('/api/data').
        then(function(res) {
            console.log(res.data);
            $scope.results = res.data.results;
        }, function(res) {
            //TODO: implement
            console.log(res);
        });

}]);
