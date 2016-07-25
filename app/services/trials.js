'use strict';
var csv = require('csv');
var request = require('request');
var Promise = require('bluebird');
var config = require('../config');
var _ = require('lodash');

/**
 * Module provides trials service
 */
module.exports = {
  get: getData,
  getMapped: getMappedData
};

/**
 * Load and return tracker data
 *
 * @returns {Promise}
 */
function getData() {
  return loadData().then(parseData).then(cleanData);
}

/**
 * Load and return normalized tracker data
 *
 * @returns {Promise}
 */
function getMappedData() {
  return loadData().then(parseData).then(cleanData).then(processData);
}

function processData(trials) {
  return new Promise(function (resolve, reject) {
    var daysDivider = 24 * 60 * 60 * 1000;
    var currentDate = new Date();
    var today = Math.round(currentDate.getTime() / daysDivider);
    var results = _.map(trials, function (trial) {
      var result = {
        trialId: trial.trial_id,
        title: trial.title,
        publicTitle: trial.public_title,
        participantCount: trial.participant_count,
        startDate: !!trial.start_date ? new Date(trial.start_date) : null,
        completionDate: (!!trial.completion_date || trial.completion_date !== '-') ?
                        new Date(trial.completion_date) : null,
        investigator: trial.principal_investigator,
        sponsors: trial.sponsor_collaborators,
        isPublished: (
          (('' + trial.results_available).toUpperCase() == 'Yes') &&
          (('' + trial.preliminary_or_full).toUpperCase() == 'FULL')

        ),
        url: trial.url,
        funders: trial.funded_by,
        source: trial.source
      };

      if (!_.isArray(result.sponsors)) {
        result.sponsors = [];
      }

      if (!_.isArray(result.funders)) {
        result.funders = [];
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

      // 1. completed but not published - days DESC
      // 2. not completed - days DESC
      // 3. completed and published days DESC
      if (result.isCompleted) {
        if (result.isPublished) {
          result.publicationDelay = -result.daysAfterCompletion;
        } else {
          result.publicationDelay = -(2000000 + result.daysAfterCompletion);
        }
      } else {
        result.publicationDelay = -(1000000 + result.daysAfterStart);
      }

      return result;
    });

    results = _.sortBy(results, function (item) {
      return item.publicationDelay;
    });

    resolve(results);
  });
}

//TODO: add timeout
function loadData() {
  return new Promise(function (resolve, reject) {
    request(config.get('database:trials'), function (err, res, data) {
      if (!err && res.statusCode === 200) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function parseData(data) {
  return new Promise(function (resolve, reject) {
    var options = { columns: true, auto_parse: true }; // jscs:disable
    csv.parse(data, options, function (err, data) {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function cleanData(data) {
  return new Promise(function (resolve, reject) {
    data.forEach(function (item) {
      Object.keys(item).forEach(function (key) {
        item[key] = cleanNull(item[key]);
      });
      item['Conditions'] = cleanArray(item['Conditions']);
      item['Interventions'] = cleanArray(item['Interventions']);
      item['Sponsor/Collaborators'] = cleanArray(item['Sponsor/Collaborators']);
      item['Age Groups'] = cleanArray(item['Age Groups']);
      item['Phases'] = cleanArray(item['Phases']);
      item['Funded Bys'] = cleanArray(item['Funded Bys']);
      item['Start Date'] = cleanDate(item['Start Date']);
      item['Completion Date'] = cleanDate(item['Completion Date']);
      item['Primary Completion Date'] = cleanDate(item['Primary Completion Date']);
    });
    resolve(data);
  });
}

function cleanNull(value) {
  if (value === 'Null') {
    value = null;
  }
  return value;
}

function cleanArray(value) {
  if (value === null) {
    return value;
  }
  try {
    value = value.split('|');
  } catch (err) {
    return [];
  }
  return value;
}

function cleanDate(value) {
  if (value === null) {
    return value;
  }
  try {
    // Join with "-" to make it ISO format with UTC
    value = new Date(value.split('/').reverse().join('-'));
    if (!value.getTime()) {
      throw Error('Bad date');
    }
  } catch (err) {
    return '';
  }
  return value;
}
