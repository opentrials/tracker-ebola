'use strict';

var _ = require('lodash');

module.exports = {
  collectTrialsInfo: collectTrialsInfo,
  collectDataForChart: collectDataForChart
};

/**
 * Collects some useful data from trials, such as unique sources, total
 * number of trials and so on
 */
function collectTrialsInfo(trials) {
  var result = {
    sources: [],
    funders: [],
    completedTrials: 0,
    publishedTrials: 0
  };
  _.forEach(trials, function(trial) {
    if (trial.isCompleted) {
      result.completedTrials++;
    }
    if (trial.isPublished) {
      result.publishedTrials++;
    }
    result.sources.push(trial.source);
    [].push.apply(result.funders, trial.funders);
  });
  result.sources = _.uniq(result.sources);
  result.funders = _.uniq(result.funders);
  return result;
}

function mapTrialsData(trials, cases) {
  var now = new Date();
  var result = {};
  var defaultItem = {
    key: null,
    all: 0,
    completed: 0,
    deaths: 0
  };

  _.forEach(trials, function(trial) {
    if (trial.startDate && trial.participantCount) {
      var current;

      var from = trial.startDate;
      from = from.getUTCFullYear() * 12 + from.getUTCMonth();
      var to = (trial.isCompleted && trial.completionDate) ?
        trial.completionDate : now;

      to = to.getUTCFullYear() * 12 + to.getUTCMonth();

      current = result[from] || _.clone(defaultItem);
      current.key = from;
      current.all += trial.participantCount;
      result[from] = current;

      if (trial.isCompleted) {
        current = result[to] || _.clone(defaultItem);
        current.key = to;
        current.completed += trial.participantCount;
        result[to] = current;
      }
    }
  });

  _.forEach(cases, function(item) {
    var i = item.year * 12 + (item.month - 1);
    var current = result[i] || _.clone(defaultItem);
    current.key = i;
    current.deaths += item.deaths;
    result[i] = current;
  });

  return _.sortBy(_.values(result), function(item) {
    return item.key;
  });
}

function reduceTrialsData(trialsData, fromDate, detalizationBreakpoint) {
  var result = [];
  var collected = {
    all: 0,
    completed: 0,
    deaths: 0
  };

  var increment = 12;
  if ((fromDate > detalizationBreakpoint) && (increment != 1)) {
    fromDate = detalizationBreakpoint;
    increment = 1;
  }

  _.forEach(trialsData, function(item) {
    collected.all += item.all;
    collected.completed += item.completed;
    collected.deaths += item.deaths;
    while (item.key >= fromDate) {
      var temp = _.clone(collected);
      temp.year = Math.floor(fromDate / 12);
      temp.month = fromDate % 12;
      result.push(temp);
      fromDate += increment;
      if ((fromDate > detalizationBreakpoint) && (increment != 1)) {
        fromDate = detalizationBreakpoint + 1;
        increment = 1;
      }
    }
  });
  return result;
}

function collectDataForChart(trials, cases) {
  var minYear = null;
  _.forEach(trials, function(trial) {
    if (trial.startDate) {
      var year = trial.startDate.getUTCFullYear();
      if ((year < minYear) || (minYear === null)) {
        minYear = year;
      }
    }
  });

  var breakpoint = (new Date()).getUTCFullYear() - 1;

  var trialsData = mapTrialsData(trials, cases);
  trialsData = reduceTrialsData(trialsData, minYear * 12,
    breakpoint * 12);

  var months = ['01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'];

  var result = {
    x: [],
    all: [],
    completed: [],
    death: []
  };
  _.forEach(trialsData, function(item) {
    if (item.year < breakpoint) {
      result.x.push(item.year);
    } else {
      result.x.push(item.year + '/' + months[item.month]);
    }
    result.all.push(item.all);
    result.completed.push(item.completed);
    result.death.push(item.deaths);
  });

  return result;
}

function collectDataForChart2(trials) {
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
