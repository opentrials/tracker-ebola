'use strict';

// TODO: split to multiple files?
var reqdir = require('require-dir');
var Browser = require('zombie');
var lodash = require('lodash');
var assert = require('chai').assert;
var app = require('../../app');
var config = require('../../app/config');
var services = reqdir('../../app/services');

// Prepare browser
Browser.localhost('127.0.0.1', process.env.PORT || 3001);

// Prepare server
before(function(done) {

  // Run the server
  app.listen(3001, function() {
    done();
  });

});

describe('Data endpoint', function() {

  var browser = new Browser({maxWait: 5000});
  this.timeout(10000);

  it('Should be alive', function (done) {
    browser.visit('/api/trials', function() {
      browser.assert.success();
      done();
    });
  });

});

describe('Cases endpoint', function() {

  var browser = new Browser({maxWait: 5000});
  this.timeout(10000);

  it('Should be alive', function (done) {
    browser.visit('/api/cases', function() {
      browser.assert.success();
      done();
    });
  });

});

describe('List of trials', function() {

  var browser = new Browser({maxWait: 5000});
  this.timeout(10000);

  it('List should contain some items', function (done) {
    browser.visit('/', function() {
      var list = browser.queryAll('.trial-list > li');
      assert.isAbove(list.length, 0);
      done();
    });
  });

});

describe('Add data email link', function() {

  var link = 'mailto:opentrials@okfn.org?subject=Data for the Ebola Trials Tracker';
  var browser = new Browser({maxWait: 5000});
  this.timeout(10000);

  it('Should be available on index', function (done) {
    browser.visit('/', function() {
      assert.include(browser.html(), link);
      done();
    });
  });

});

describe('Access Token', function() {

  var browser = new Browser({maxWait: 5000});
  // Ensure we have time for request to resolve, etc.
  this.timeout(5000);

  it('Should return 403 Forbidden', function(done) {
    config.set('access:protected', true);
    browser.visit('/', function() {
      assert(browser.statusCode == 403, 'Status should be "403 Forbidden"');
      done();
    });
  });

  it('Should allow access after providing access token', function(done) {
    config.set('access:protected', true);
    browser.visit('/', function() {
      browser.fill('#token', config.get('access:token'));
      browser.document.forms[0].submit();
      browser.wait().then(function() {
        assert.ok(browser.success);
        done();
      });
    });
  });

});
