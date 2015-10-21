;(function(angular, undefined) {

  angular.module('Application')
    .controller('ShareGraphController', [
      '$scope', '$location', 'Configuration',
      function ($scope, $location, Configuration) {
        $scope.shareUrl = $location.absUrl();
        $scope.urlencode = encodeURIComponent;
      }
    ]);

})(angular);