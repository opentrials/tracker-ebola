'use strict';
const csv = require('csv');
const request = require('request');
const Promise = require('bluebird');
const config = require('../config');
const _ = require('lodash');
const moment = require('moment');

const timeFormat = 'YYYY-MM-DD';
const today = moment.utc();

/**
 * Load and return tracker data
 *
 * @returns {Promise}
 */
function get() {
  return _loadData().then(_parseData).then(_cleanData);
}

/**
 * Load and return normalized tracker data
 *
 * @returns {Promise}
 */
function getMapped() {
  return _loadData().then(_parseData).then(_cleanData).then(_processData);
}

function _processData(trials) {
  return new Promise(function(resolve, reject) {
    let results = _.map(trials, function(trial) {
      const result = {

        // 1:1 mapping with spreadsheet columns, translated to camelCase
        trialId: trial.trial_id,
        publicTitle: trial.public_title,
        title: trial.title,
        recruitment: trial.recruitment,
        studyDesign: trial.study_design,
        conditions: trial.conditions.split('|'),
        interventions: trial.interventions.split('\r|\n|\r\n'),
        sponsorCollaborators: trial.sponsor_collaborators,
        principalInvestigator: trial.principal_investigator,
        ageGroups: trial.age_groups.split('|'),
        phases: trial.phases.split('\r|\n|\r\n'),
        participantCount: trial.participant_count,
        fundedBy: trial.funded_by.split('|'),
        startDate: _cleanDate(trial.start_date),
        completionDate: _cleanDate(trial.completion_date),
        registryCompletionDate: _cleanDate(trial.registry_completion_date),
        resultsFirstReceived: _cleanDate(trial.results_first_received),
        resultsLastSearched: _cleanDate(trial.results_last_searched),
        resultsAvailable:
        ('' + trial.results_available).toUpperCase() === 'YES' ?
          true :
          false,
        interimOrFullOrGrey: trial.interim_or_full_or_grey,
        urlResults: trial.url_results,
        primaryCompletionDate: _cleanDate(trial.primary_completion_date),
        publicationDelayDays: _calculatePublicationDelay(trial),
        country: trial.country.split('\r|\n|\r\n'),
        source: trial.source,
        url: trial.url,
        secondaryRegistryOrId: trial.secondary_registry_or_id,
        correspondence: trial.correspondence,
        // End of the 1:1 mapping, following are the extra attributes

        // Booleans here
        isPublished: (
          (('' + trial.results_available).toUpperCase() === 'YES') &&
          (('' + trial.preliminary_or_full).toUpperCase() !== '')

        ),
        isCompleted: _cleanDate(trial.completion_date).isBefore(today),
        hasCompletedRecruitment: ['Active, not recruiting',
                                  'Closed to recruitment, follow up complete',
                                  'Completed',
                                  'No longer recruiting',
                                  'Terminated',
                                 ].includes(
                                   trial.recruitment),
        isStarted: today.isAfter(trial.start_date),
        isInProgress: today.isAfter(trial.start_date) &&
          today.isBefore(trial.completion_date),

        // Computed values here
        daysAfterCompletion: today.diff(trial.completion_date, 'days'),
      };

      if (!_.isArray(result.sponsors)) {
        result.sponsors = [];
      }

      if (!_.isArray(result.funders)) {
        result.funders = [];
      }

      return result;
    });

    resolve(results);
  });
}

//TODO: add timeout
function _loadData() {
  return new Promise(function(resolve, reject) {
    request(config.get('database:trials'), function(err, res, data) {
      if (!err && res.statusCode === 200) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function _parseData(data) {
  return new Promise(function(resolve, reject) {
    const options = { columns: true, auto_parse: true }; // jscs:disable
    csv.parse(data, options, function(err, data) {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function _cleanData(data) {
  return new Promise(function(resolve, reject) {
    data.forEach(function(item) {
      Object.keys(item).forEach(function(key) {
        item[key] = isNaN(item[key]) ? _.trim(item[key]) : item[key];
        item[key] = _cleanNull(item[key]);
        item[key] = _cleanDash(item[key]);
      });
    });
    resolve(data);
  });
}

function _cleanNull(value) {
  if (value === 'Null') {
    value = null;
  }
  return value;
}

function _cleanDash(value) {
  // If moment.js gets a dash as input, it throws a warning
  if (value === '-') {
    value = '';
  }
  return value;
}

function _cleanDate(value) {
  // use the abstract equality comparison to check against multiple falsy input with ==
  // http://www.ecma-international.org/ecma-262/6.0/#sec-abstract-equality-comparison
  let parsed = moment.utc(undefined);
  try {
    parsed = moment.utc(value, 'YYYY-MM-DD', true);
    if (!parsed.isValid()) {
      throw Error(`Bad date: ${value}`);
    }
  } catch (err) {
    // Not actually catching the error
    // Just letting `moment` return an invalid date
  }
  return parsed;
}

function _calculatePublicationDelay(trial) {
  let delay = 0;
  const resultsFirstReceived = moment.utc(trial.results_first_received);
  const primaryCompletionDate = moment.utc(trial.primary_completion_date);
  const registryCompletionDate = moment.utc(trial.registry_completion_date);

  if (!resultsFirstReceived.isValid()) {
    if (!primaryCompletionDate.isValid() &&
        registryCompletionDate.isBefore(today)) {
      delay = today.diff(registryCompletionDate, 'days');
    } else if (primaryCompletionDate.isBefore(today)) {
      delay = today.diff(primaryCompletionDate, 'days');
    }
  } else {
    if (!primaryCompletionDate.isValid() &&
        registryCompletionDate.isBefore(resultsFirstReceived)) {
      delay = resultsFirstReceived.diff(registryCompletionDate, 'days');
    } else if (primaryCompletionDate.isBefore(resultsFirstReceived)) {
      delay = resultsFirstReceived.diff(primaryCompletionDate, 'days');
    }
  }

  return delay;
}

/**
 * Module provides trials service
 */
module.exports = {
  get,
  getMapped
};
