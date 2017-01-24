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
        startDate: _processDate(trial.start_date),
        completionDate: _processDate(trial.completion_date),
        registryCompletionDate: _processDate(trial.registry_completion_date),
        resultsFirstReceived: _processDate(trial.results_first_received),
        resultsLastSearched: _processDate(trial.results_last_searched),
        resultsAvailable:
        ('' + trial.results_available).toUpperCase() === 'YES' ?
          true :
          false,
        interimOrFullOrGrey: trial.interim_or_full_or_grey,
        urlResults: trial.url_results,
        primaryCompletionDate: _processDate(trial.primary_completion_date),
        publicationDelayDays: trial.publication_delay_days,
        country: trial.country.split('\r|\n|\r\n'),
        source: trial.source,
        url: trial.url,
        secondaryRegistryOrId: trial.secondary_registry_or_id,
        correspondence: trial.correspondence,
        // End of the 1:1 mapping, following are the extra attributes

        // Booleans here
        isPublished: (
          (('' + trial.results_available).toUpperCase() === 'YES') &&
          (('' + trial.preliminary_or_full).toUpperCase() === 'FULL')

        ),
        isCompleted: _processDate(trial.completion_date).isBefore(today),
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

    results = _.sortBy(results, function(item) {
      return item.publicationDelay;
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
      });
      item['Conditions'] = _cleanArray(item['Conditions']);
      item['Interventions'] = _cleanArray(item['Interventions']);
      item['Sponsor/Collaborators'] = _cleanArray(item['Sponsor/Collaborators']);
      item['Age Groups'] = _cleanArray(item['Age Groups']);
      item['Phases'] = _cleanArray(item['Phases']);
      item['Funded Bys'] = _cleanArray(item['Funded Bys']);
      item['Start Date'] = _cleanDate(item['Start Date']);
      item['Completion Date'] = _cleanDate(item['Completion Date']);
      item['Primary Completion Date'] = _cleanDate(item['Primary Completion Date']);
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

function _cleanArray(value) {
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

function _cleanDate(value) {
  // use the abstract equality comparison to check against multiple falsy input with ==
  // http://www.ecma-international.org/ecma-262/6.0/#sec-abstract-equality-comparison
  if (value == null) {
    return null;
  }
  try {
    parsed = moment.utc(value, timeFormat);
    if (!parsed.isValid()) {
      throw Error(`Bad date: ${value}`);
    }
  } catch (err) {
    return '';
  }
  return parsed;
}

function _processDate(value) {
  return moment.utc(value, timeFormat, true);
}

/**
 * Module provides trials service
 */
module.exports = {
  get,
  getMapped
};
