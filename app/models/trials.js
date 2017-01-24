'use strict';
var _ = require('lodash');
var config = require('../config');
var jtm = require('../storage');

/**
 * Module provides tracker data service
 */
module.exports = function() {
  return jtm.define({
    tableName: 'trials',
    resource: config.get('database:trials'),
    descriptor: require('./trials.json'),
    instanceMethods: {
      proceed: function() {
        var daysDivider = 24 * 60 * 60 * 1000;
        var currentDate = new Date();
        var today = Math.round(currentDate.getTime() / daysDivider);
        var trial = this.mapped();
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
                        (('' + trial.preliminary_or_full).toUpperCase() ==
                         'FULL')
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
            var completed = Math.round(
              result.completionDate.getTime() / daysDivider);
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
    }
  });
};
