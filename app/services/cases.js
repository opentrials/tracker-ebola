'use strict';
var csv = require('csv');
var request = require('request');
var Promise = require('bluebird');
var _ = require('lodash');
var config =  require('../config');

/**
 * Module provides tracker data service
 */
module.exports = {
  get: getData,
  getMapped: getMappedData
};

/**
 * Load and return normalized tracker data
 *
 * @returns {Promise}
 */
function getMappedData() {
  return loadData().then(parseData).then(cleanData).then(processData);
}

function processData(trials) {
  return new Promise(function(resolve, reject) {
    var results = _.map(trials, function(trial) {
      return {
        year: trial.Year,
        month: trial.Month,
        cases: trial.Cases,
        deaths: trial.Deaths,
        dataPackage: trial.Datapackage
      };
    });
    resolve(results);
  });
}

/**
 * Load and return cases and deaths data
 *
 * @returns {Promise}
 */
function getData() {
  return loadData().then(parseData).then(cleanData);
}

//TODO: add timeout
function loadData() {
  return new Promise(function(resolve, reject) {
    request(config.get('database:cases'), function(err, res, data) {
      if (!err && res.statusCode === 200) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function parseData(data) {
  return new Promise(function(resolve, reject) {
    var options = {columns: true, auto_parse: true}; // jscs:disable
    csv.parse(data, options, function(err, data) {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function cleanData(data) {
  return data;
}
