;(function(angular, undefined) {

  angular.module('Application')
    .controller('IndexController', [
      '$scope', 'Configuration', 'ApiService',
      function ($scope, Configuration, ApiService) {
        $scope.trials = [];
        $scope.counter = null;
        $scope.refreshInterval = Configuration.api.refreshInterval;

        ApiService.loadTrials().then(function(result) {
          $scope.trials = result.trials;
          $scope.counter = result.counter;
          return result;
        });
      }
    ]);

})(angular);