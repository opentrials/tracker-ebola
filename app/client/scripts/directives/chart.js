;(function(angular, undefined) {

  angular.module("Application")
    .directive('c3Chart', [
      'Configuration',
      function(Configuration) {
        return {
          restrict: 'A',
          replace: false,
          template: '',
          scope: true,
          link: function($scope, element, attrs) {
            element.hide();

            var legends = {
              'all': 'Patients in known trials',
              'completed': 'Patients in completed trials',
              'death': 'Ebola deaths'
            };

            var chart = c3.generate({
              data: {
                x: 'x',
                columns: [['x']]
              }
            });
            chart.element = element.get(0);

            $scope.$on(Configuration.events.TRIALS_LOADED,
              function(event, trials) {
                var minYear = null;
                var maxYear = null;
                _.forEach(trials, function(trial) {
                  if ((trial.year < minYear) || (minYear === null)) {
                    minYear = trial.year;
                  }
                  if ((trial.year > maxYear) || (maxYear === null)) {
                    maxYear = trial.year;
                  }
                });

                var data = {
                  x: new Array(maxYear - minYear + 1),
                  all: _.fill(new Array(maxYear - minYear + 1), 0),
                  completed: _.fill(new Array(maxYear - minYear + 1), 0),
                  death: new Array(maxYear - minYear + 1)
                };

                for (var i = 0; i < data.x.length; i++) {
                  data.x[i] = minYear + i;
                }

                var deathMax = 10;
                _.forEach(trials, function(trial) {
                  var i = trial.year - minYear;
                  data.all[i] = (data.all[i] || 0) + trial.participants;
                  if (trial.completed) {
                    data.completed[i] = (data.completed[i] || 0) +
                      trial.participants;
                  }
                  if (trial.participants > deathMax) {
                    deathMax = trial.participants;
                  }
                });

                data.death = _.map(data.death, function(item) {
                  return Math.round(Math.random() * deathMax);
                });

                chart.load({
                  columns: _.map(data, function(items, key) {
                    var result = [legends[key] || key];
                    [].push.apply(result, items);
                    return result;
                  })
                });
                element.show();
                chart.flush();
              });
          }
        };
      }
    ]);

})(angular);