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

      if (trial.isCompleted) {
        current = result[from] || _.clone(defaultItem);
        current.key = from;
        current.all += trial.participantCount;
        result[from] = current;
      }

      if (trial.isPublished) {
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

  var detailedIncrement = 3; // In months

  var increment = 12; // In months
  if (fromDate >= detalizationBreakpoint) {
    increment = detailedIncrement;
    fromDate = Math.floor(detalizationBreakpoint / increment) * increment;
  }

  _.forEach(trialsData, function(item) {
    collected.all += item.all;
    collected.completed += item.completed;
    collected.deaths += item.deaths;
    while (item.key >= fromDate) {
      var temp = _.clone(collected);
      temp.year = Math.floor(fromDate / 12);
      temp.month = fromDate % 12;
      temp.quarter = Math.floor((fromDate % 12) / 3);
      result.push(temp);
      collected.deaths = 0;
      fromDate += increment;
      if (
        (fromDate >= detalizationBreakpoint) &&
        (increment != detailedIncrement)
      ) {
        increment = detailedIncrement;
        fromDate = Math.floor(detalizationBreakpoint / increment) * increment;
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

  var quarters = ['I', 'II', 'III', 'IV'];
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
      result.x.push(item.year + ', ' + quarters[item.quarter]);
    }
    result.all.push(item.all);
    result.completed.push(item.completed);
    result.death.push(item.deaths);
  });

  return result;
}
