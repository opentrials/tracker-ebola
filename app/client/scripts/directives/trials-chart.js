;(function(angular, undefined) {

  angular.module("Application")
    .directive('trialsChart', [
      'Configuration',
      function(Configuration) {
        return {
          restrict: 'A',
          replace: false,
          template: '',
          scope: true,
          link: function($scope, element, attrs) {
            var className = 'trials-chart-' + (new Date()).getTime() + '-' +
              Math.round(Math.random() * 1000000);

            element.hide();
            element.addClass(className);

            var lines = {
              x: {},
              all: {
                title: 'Patients in known trials',
                color: '#022f5a'
              },
              completed: {
                title: 'Patients in completed trials',
                color: '#12b2e3'
              },
              death: {
                title: 'Ebola deaths',
                color: '#ffd756'
              }
            };

            var colors = {};
            _.forEach(lines, function(line) {
              colors[line.title] = line.color;
            });

            var chart = c3.generate({
              bindto: '.' + className,
              data: {
                x: 'x',
                columns: [['x']]
              },
              legend: {
                position: 'inset'
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
                  if (trial.startDate) {
                    var from = trial.startDate.getFullYear();
                    var to = trial.year;
                    var i;
                    for (var j = from; j <= to; j++) {
                      i = j - minYear;
                      data.all[i] = (data.all[i] || 0) + trial.participantCount;
                    }
                    i = trial.year - minYear;
                    if (trial.isCompleted) {
                      data.completed[i] = (data.completed[i] || 0) +
                      trial.participantCount;
                    }
                    if (trial.participantCount > deathMax) {
                      deathMax = trial.participantCount;
                    }
                  }
                });

                data.death = _.map(data.death, function(item) {
                  return Math.round(Math.random() * deathMax);
                });

                chart.load({
                  columns: _.map(data, function(items, key) {
                    var result = [lines[key].title || key];
                    [].push.apply(result, items);
                    return result;
                  })
                });
                chart.data.colors(colors);
                element.show();
                chart.flush();
              });
          }
        };
      }
    ]);

})(angular);