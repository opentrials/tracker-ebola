;(function(angular){

  var config = {
    events: {
      TRIALS_LOADED: 'api.trialsLoaded'
    },
    api: {
      endpoint: '/api/trials',
      refreshInterval: 5
    }
  };

  angular.module('Application').constant('Configuration', config);

})(angular);