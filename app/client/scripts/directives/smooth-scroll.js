;(function(angular, undefined) {

  angular.module("Application")
    .directive('smoothScroll', [
      function() {
        return {
          restrict: 'A',
          replace: false,
          template: '',
          scope: true,
          link: function($scope, element) {
            smoothScroll.init({
              updateURL: false
            });
          }
        };
      }
    ]);

})(angular);