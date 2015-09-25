'use strict';
// jscs:disable maximumLineLength
// TODO: use conf.json for default settings
var path = require('path');
var nconf = require('nconf');

/**
 * Module provides config
 */
module.exports = {
  get: function(key) {return nconf.get.call(nconf, key);},
  set: nconf.set.bind(nconf),
  reset: nconf.reset.bind(nconf),
};

// User config
nconf.file({
  file: path.join(__dirname, '../conf.json'),
});

// Default config
nconf.defaults({
  contactEmail: process.env.CONTACT_EMAIL || 'opentrials@okfn.org',
  trackerData: process.env.TRACKER_DATA || 'https://docs.google.com/spreadsheets/d/18QoNBtABuGca8LBc0nXjMfrzWz4gZ2FWlLmtrvX-qyo/pub?gid=0&single=true&output=csv',
  appConfig: {
    port: process.env.PORT || 3000,
  },
  session: {
    name: 'NSESSID',
    secret: 'SECRET_TOKEN',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours,
  },
  access: {
    isProtected: process.env.IS_PROTECTED || false,
    token: process.env.ACCESS_TOKEN || 'ACCESS_TOKEN',
  },
});
