;(function(angular, undefined) {

  function joinSponsors() {
    var result = this;
    if (this.length > 2) {
      var last = this.pop();
      result = [this.join(', '), last];
      this.push(last);
    }
    return result.join(' and ');
  }

  function processTrials(trials) {
    var daysDivider = 24 * 60 * 60 * 1000;
    var currentDate = new Date();
    var today = Math.round(currentDate.getTime() / daysDivider);
    return _.map(trials, function(trial) {
      var result = {
        trialId: trial['Trial ID'],
        title: trial['Title'],
        publicTitle: trial['Public title'],
        participantCount: trial['Participant Count'],
        startDate: !!trial['Start Date'] ? new Date(trial['Start Date']) : null,
        completionDate: !!trial['Completion Date'] ?
          new Date(trial['Completion Date']) : null,
        investigator: trial['Principal Investigator'],
        sponsors: trial['Sponsor/Collaborators'],
        isPublished: !!trial['Are results available?'],
        url: trial['URL']
      };

      if (result.sponsors) {
        result.sponsors.toHumanReadableString = joinSponsors;
      }

      if (result.startDate) {
        var started = Math.round(result.startDate.getTime() / daysDivider);
        if (result.completionDate) {
          var completed = Math.round(result.completionDate.getTime() /
            daysDivider);
          result.isCompleted = today >= completed;
          result.daysAfterCompletion = today - completed;
          if (result.daysAfterCompletion < 0) {
            result.daysAfterCompletion = 0;
          }
        } else {
          result.isCompleted = false;
          result.daysAfterCompletion = 0;
        }

        result.isStarted = today >= started;
        result.isInProgress = result.isStarted && !result.isCompleted;
        result.isPublished = result.isCompleted && result.isPublished;

        result.daysAfterStart = today - started;
        if (result.daysAfterStart < 0) {
          result.daysAfterStart = 0;
        }
      } else {
        result.isStarted = false;
        result.isCompleted = false;
        result.isInProgress = false;
        result.daysAfterStart = 0;
        result.daysAfterCompletion = 0;
      }

      result.year = result.isCompleted ? result.completionDate.getFullYear()
        : currentDate.getFullYear();

      return result;
    });
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
