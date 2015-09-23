'use strict';
var path = require('path');
var nconf = require('nconf');


// User settings
nconf.file({
  file: path.join(__dirname, '../conf.json'),
});

// Default settings
nconf.defaults({
  trackerData: process.env.TRACKER_DATA || 'https://docs.google.com/spreadsheets/d/18QoNBtABuGca8LBc0nXjMfrzWz4gZ2FWlLmtrvX-qyo/pub?gid=0&single=true&output=csv',
  appConfig: {
    port: process.env.PORT || 3000,
  },
});

// Module interface
module.exports = {
  get: function(key) {
    return nconf.get.call(nconf, key);
  },
  set: nconf.set.bind(nconf),
  reset: nconf.reset.bind(nconf),
};
