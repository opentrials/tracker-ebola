'use strict';
var csv = require('csv');
var request = require('request');
var Promise = require('bluebird');
var config =  require('../config');

/**
 * Module provides tracker data service
 */
module.exports = {
  get: getData,
};

/**
 * Load and return tracker data
 *
 * @returns {Promise}
 */
function getData() {
  return loadData().then(parseData).then(cleanData);
}

//TODO: add timeout
function loadData() {
  return new Promise(function(resolve, reject) {
    request(config.get('database:url'), function(err, res, data) {
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
  return new Promise(function(resolve, reject) {
    data.forEach(function(item) {
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
