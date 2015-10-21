;(function(angular, undefined) {

  angular.module("Application")
    .directive('modalOpen', [
      function() {
        return {
          restrict: 'A',
          replace: false,
          template: '',
          scope: true,
          link: function($scope, element) {
            element.on('change', function() {
              if ($(this).is(':checked')) {
                $('body').addClass('modal-open');
              } else {
                $('body').removeClass('modal-open');
                $('.modal').find('video, audio').each(function() {
                  this.pause();
                });
              }
            });
          }
        };
      }
    ])
    .directive('modalClose', [
      function() {
        return {
          restrict: 'A',
          replace: false,
          template: '',
          scope: true,
          link: function($scope, element) {
            element.on('click', function() {
              $('.modal-state:checked').prop('checked', false).change();
            });
          }
        };
      }
    ])
    .directive('modalDisableClick', [
      function() {
        return {
          restrict: 'A',
          replace: false,
          template: '',
          scope: true,
          link: function($scope, element) {
            element.on('click', function(event) {
              event.stopPropagation();
            });
          }
        };
      }
    ]);

})(angular);