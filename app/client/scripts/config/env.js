;(function(angular){

  var config = {
    api: {
      endpoint: '/api/trials',
      refreshInterval: 5
    }
  };

  angular.module('Application').constant('Configuration', config);

})(angular);