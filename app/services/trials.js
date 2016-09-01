'use strict';
var csv = require('csv');
var Promise = require('bluebird');
var jts = require('../../jsontableschema');
var config = require('../config');
var schema = require('./schemaTrials.json');
var _ = require('lodash');

/**
 * Module provides trials service
 */
module.exports = {

  /**
   * Load and return normalized tracker data
   *
   * @returns {Promise}
   */
  get: function() {
    return new Promise(function(resolve, reject) {
      new jts.Resource(schema, config.get('database:trials')).then(
        function(resource) {
          var values = [];
          var daysDivider = 24 * 60 * 60 * 1000;
          var currentDate = new Date();
          var today = Math.round(currentDate.getTime() / daysDivider);

          resource.iter(iterator, false, false).then(function() {
            resolve(_.sortBy(values, function(item) {
              return item.publicationDelay;
            }));
          }, function(errors) {
            reject(errors);
          });

          function iterator(items) {
            var trial = resource.map(items);
            values.push(processData(trial, currentDate, today, daysDivider));
          }
        }, function(error) {
          reject(error);
        });
    });
  }
};

function processData(trial, currentDate, today, daysDivider) {
  var result = {
    trialId: trial.trial_id,
    title: trial.title,
    publicTitle: trial.public_title,
    participantCount: trial.participant_count,
    startDate: trial.start_date,
    completionDate: trial.completion_date,
    investigator: trial.principal_investigator,
    sponsors: trial.sponsor_collaborators,
    isPublished: (trial.results_available &&
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
      var completed = Math.round(result.completionDate.getTime() / daysDivider);
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

  result.year = result.isCompleted ? result.completionDate.getFullYear() :
                currentDate.getFullYear();

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
}
