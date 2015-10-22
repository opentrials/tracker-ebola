'use strict';

var _ = require('lodash');
var requireDir = require('require-dir');
var services = requireDir('../services');

// Index
module.exports.index = function(req, res) {
  services.trials.getMapped().then(function(data) {
    res.render('index.html', {
      title: 'Ebola',
      subtitle: 'A live tracker of Ebola trials',
      trials: data,
      info: services.trials.collectTrialsInfo(data),
      req: req
    });
  });
};

// About
module.exports.about = function(req, res) {
  res.render('about.html', {
    title: 'About'
  });
};

// Chart

function getTrialsDataForChart(trials) {
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
      var from;
      var i;

      from = trial.startDate.getFullYear();
      for (var j = from; j <= maxYear; j++) {
        i = j - minYear;
        data.all[i] = (data.all[i] || 0) + trial.participantCount;
      }

      if (trial.isCompleted) {
        from = trial.year;
        for (var j = from; j <= maxYear; j++) {
          i = j - minYear;
          data.completed[i] = (data.completed[i] || 0) +
            trial.participantCount;
        }
      }
      if (trial.participantCount > deathMax) {
        deathMax = trial.participantCount;
      }
    }
  });

  data.death = _.map(data.death, function(item) {
    return Math.round(Math.random() * deathMax);
  });

  return data;
}

module.exports.chart = function(req, res) {
  services.trials.getMapped().then(function(data) {
    res.render('graph.html', {
      title: 'Ebola Graph',
      chartData: JSON.stringify(getTrialsDataForChart(data))
    });
  });
};
