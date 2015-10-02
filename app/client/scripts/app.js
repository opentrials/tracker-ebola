'use strict';

// Application
var application = angular.module('Application',[]);

// Root controller
application.controller('Controller', ['$scope', '$http', '$interval', function($scope, $http, $interval) { // jscs:disable

  // Run
  update_model();
  $interval(update_model, 5*60*1000); // 5 min

  // Update model
  function update_model() {
    $scope.trials = [];
    $http.get('/api/trials').
      then(function(res) {
          var trials = res.data.results;
          process_trials(trials);
          $scope.trials = trials;
          $scope.counter = count_trials(trials);
      }, function(res) {
          //TODO: implement
          console.log(res);
      });
  }

}]);

/**
 * Process every trial
 *
 * @param {array} trials
 */
function process_trials(trials) {

  // Iterate over trials
  trials.forEach(function (trial) {

    // Completion
    trial['_completion'] = trial['Completion Date'];

    // Results
    trial['_results'] = trial['Study Results'] || 'No results';

    // Days
    var days = null;
    if (trial['Completion Date']) {
      var today = new Date();
      var completion = new Date(trial['Completion Date']);
      days = Math.floor((today - completion)/1000/60/60/24);
    }
    trial['_days'] = (days > 0) ? days : null;

  });

}

/**
 * Count trials
 *
 * @param {array} trials
 */
function count_trials(trials) {

  var counter = {};

  counter.trials = trials.length;
  counter.completed = trials.filter(function(trial) {
    var key = 'Completion Date';
    return trial[key] !== null && (new Date(trial[key]) < new Date());
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
