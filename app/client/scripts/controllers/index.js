;(function(angular, undefined) {

  angular.module('Application')
    .controller('IndexController', [
      '$scope', '$timeout', 'Configuration', 'ApiService',
      function ($scope, $timeout, Configuration, ApiService) {
        $scope.trials = [];
        $scope.counter = null;
        $scope.refreshInterval = Configuration.api.refreshInterval;

        var refresh = function() {
          ApiService.loadTrials().then(function(result) {
            $scope.trials = result.trials;
            $scope.counter = result.counter;
            $scope.$broadcast(Configuration.events.TRIALS_LOADED, result.trials);
            return result;
          });
        };

        refresh();
        $timeout(refresh, Configuration.api.refreshInterval * 60 * 1000);
      }
    ]);

})(angular);