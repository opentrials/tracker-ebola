;(function(angular, undefined) {

  angular.module("Application")
    .directive('c3Chart', [
      function() {
        return {
          restrict: 'A',
          replace: false,
          template: '',
          scope: true,
          link: function($scope, element, attrs) {
            var chart = c3.generate({
              data: {
                columns: [
                  ['trials', 10, 10, 10, 10, 10, 12, 16, 16, 17],
                  ['deaths', 939, 831, 785, 445, 252, 78, 60, 9, 7]
                ],
                axes: {
                  deaths: 'y2'
                },
                types: {
                  deaths: 'bar'
                }
              },
              axis: {
                x: {
                  type: 'category',
                  categories: [
                    '01.15',
                    '02.15',
                    '03.15',
                    '04.15',
                    '05.15',
                    '06.15',
                    '07.15',
                    '08.15',
                    '09.15'
                  ]
                },
                y: {
                  label: {
                    text: 'trials',
                    position: 'outer-middle'
                  }
                },
                y2: {
                  show: true,
                  label: {
                    text: 'deaths',
                    position: 'outer-middle'
                  }
                }
              }
            });
            chart.element = element.get(0);
            chart.show();
          }
        };
      }
    ]);

})(angular);