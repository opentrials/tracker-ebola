'use strict';

const _ = require('lodash');
const moment = require('moment');

const timeFormat = 'YYYY-MM-DD';
const today = moment.utc();

/**
 * Collects some useful data from trials, such as unique sources, total
 * number of trials and so on
 */
function collectTrialsInfo(trials) {
  let result = {
    completedTrials: 0,
    reportedTrials: 0,
    delayedCompletedTrials: 0,
    mostDelayed: { date: today, days: 0, id: '' },
    leastDelayed: { date: moment([1900, 1, 1]), days: 0, id: '' },
    averageDelay: 0,
    participants: {
      completedRecruitment: 0,
      reportedResults: 0,
      completedRecruitmentNotReported: 0,
      total: 0,
    },
  };
  _.forEach(trials, function(trial) {
    if (trial.isCompleted) {
      result.completedTrials++;
    }
    if (trial.resultsAvailable) {
      result.reportedTrials++;
    }
    if (trial.completionDate.isBefore(today) && !trial.resultsAvailable) {
      result.delayedCompletedTrials++;
      result.averageDelay += trial.publicationDelayDays; // will get divided at the end
    }
    if (!trial.resultsAvailable && trial.completionDate.isBefore(result.mostDelayed.date)) {
      result.mostDelayed.date = trial.completionDate;
      // result.mostDelayed.days = moment().diff(trial.completionDate, 'days');
      result.mostDelayed.days = trial.publicationDelayDays;
      result.mostDelayed.id = trial.trialId;
    }
    if (trial.completionDate.isBefore(today) && trial.completionDate.isAfter(result.leastDelayed.date)) {
      result.leastDelayed.date = trial.completionDate;
      // result.leastDelayed.days = today.diff(trial.completionDate, 'days');
      result.leastDelayed.days = trial.publicationDelayDays;
      result.leastDelayed.id = trial.trialId;
    }
    if (trial.hasCompletedRecruitment) {
      result.participants.completedRecruitment += trial.participantCount;
    }
    if (trial.resultsAvailable) {
      result.participants.reportedResults += trial.participantCount;
    }
    if (trial.completionDate.isBefore(today)
        && !trial.resultsAvailable) {
      result.participants.completedRecruitmentNotReported += trial.participantCount;
    }
  });
  result.averageDelay = Math.round(result.averageDelay / result.delayedCompletedTrials);
  result.sources = _.uniq(result.sources);
  result.funders = _.uniq(result.funders);
  return result;
}

function mapTrialsData(trials, cases) {
  let result = {};
  const defaultItem = {
    key: null,
    all: 0,
    completed: 0,
    deaths: 0
  };

  _.forEach(trials, function(trial) {
    if (trial.startDate && trial.participantCount) {
      let current;

      let from = moment(trial.startDate, timeFormat);
      from = from.year() * 12 + from.month();
      let to = (trial.isCompleted && trial.completionDate)
          ? moment(trial.completionDate, timeFormat)
          : today;

      to = to.year() * 12 + to.month();

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
    let i = item.year * 12 + (item.month - 1);
    let current = result[i] || _.clone(defaultItem);
    current.key = i;
    current.deaths += item.deaths;
    result[i] = current;
  });

  return _.sortBy(_.values(result), function(item) {
    return item.key;
  });
}

function reduceTrialsData(trialsData, fromDate, detalizationBreakpoint) {
  let result = [];
  let collected = {
    all: 0,
    completed: 0,
    deaths: 0
  };

  let detailedIncrement = 3; // In months

  let increment = 12; // In months
  if (fromDate >= detalizationBreakpoint) {
    increment = detailedIncrement;
    fromDate = Math.floor(detalizationBreakpoint / increment) * increment;
  }

  _.forEach(trialsData, function(item) {
    collected.all += item.all;
    collected.completed += item.completed;
    collected.deaths += item.deaths;
    while (item.key >= fromDate) {
      let temp = _.clone(collected);
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
  let minYear = null;
  _.forEach(trials, function(trial) {
    if (trial.startDate) {
      let year = trial.startDate.year();
      if ((year < minYear) || (minYear === null)) {
        minYear = year;
      }
    }
  });

  const breakpoint = today.year() - 1;

  let trialsData = mapTrialsData(trials, cases);
  trialsData = reduceTrialsData(trialsData, minYear * 12,
    breakpoint * 12);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const quarters = ['I', 'II', 'III', 'IV'];

  let result = {
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

module.exports = {
  collectTrialsInfo,
  collectDataForChart,
};
