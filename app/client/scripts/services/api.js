;(function(angular, undefined) {

  function processTrials(trials) {
    // Iterate over trials
    var currentYear = (new Date()).getUTCFullYear();
    trials.forEach(function(trial) {
      trial.participants = trial['Enrollment'] || 0;
      // Completion
      trial['_completion'] = trial['Completion Date'];
      trial.completed = false;
      // Results
      trial['_results'] = trial['Study Results'] || 'No results';
      // Days
      var days = null;
      if (trial['Completion Date']) {
        var today = new Date();
        var completion = new Date(trial['Completion Date']);
        days = Math.floor((today - completion) / 1000 / 60 / 60 / 24);
        trial.completed = completion.getUTCFullYear() <= currentYear;
      }

      if (trial['Start Date']) {
        trial.year = (new Date(trial['Start Date'])).getUTCFullYear();
      } else {
        trial.year = currentYear;
      }

      trial['_days'] = (days > 0) ? days : null;
    });
    return trials;
  }

  function countTrials(trials) {
    var counter = {};
    counter.trials = trials.length;
    counter.completed = trials.filter(function(trial) {
      var key = 'Completion Date';
      return (trial[key] !== null) && (new Date(trial[key]) < new Date());
    }).length;
    counter.resulted = trials.filter(function(trial) {
      var key = 'Study Results';
      return trial[key] !== null;
    }).length;
    counter.source_list = _.uniq(_.pluck(trials, 'Source'));
    counter.sources = counter.source_list.length;
    counter.source_list = counter.source_list.slice(0, -1).join(', ') +
      ' and ' + counter.source_list.slice(-1)[0];
    return counter;
  }

  var Api = function($http, $q, Configuration) {
    this.loadTrials = function() {
      return $q(function(resolve, reject) {
        $http.get(Configuration.api.endpoint).then(function(response) {
          var trials = response.data.results;
          resolve({
            trials: processTrials(trials),
            counter: countTrials(trials)
          });
        }).catch(function() {
          reject();
        });
      });
    };
  };

  angular.module('Application')
    .factory('ApiService', [
      '$http', '$q', 'Configuration',
      function($http, $q, Configuration) {
        return new Api($http, $q, Configuration);
      }
    ]);

})(angular);
