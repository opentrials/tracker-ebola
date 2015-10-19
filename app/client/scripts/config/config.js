;(function(angular){

  angular.module('Application')
    .config([
      '$compileProvider',
      function($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(
          /^\s*(https?|ftp|mailto|file|javascript):/);
      }
    ])
    .run([
      '$rootScope',
      function($rootScope) {
        // TODO: Implement if needed
      }
    ]);

})(angular);