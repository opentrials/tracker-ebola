'use strict';

var reqdir = require('require-dir');
var Browser = require('zombie');
var lodash = require('lodash');
var assert = require('chai').assert;
var services = reqdir('../../prototype/services');
var app = require('../../prototype/app');

// Prepare browser
Browser.localhost('127.0.0.1', process.env.PORT || 3001);

// Prepare server
before(function(done) {

  // Run the server
  app.listen(3001, function() {
    done();
  });

});

describe('Add data email link', function() {

  var link = 'mailto:opentrials@okfn.org?subject=Data for the Ebola Trials Tracker';
  var browser = new Browser({maxWait: 5000});
  this.timeout(10000);

  it('Should be available on index', function (done) {
    browser.visit('/', function() {
      browser.assert.link('a', 'Add data', link);
      done();
    });
  });

  it('Should be available on about', function (done) {
    browser.visit('/', function() {
      browser.assert.link('a', 'Add data', link);
      done();
    });
  });

});
