'use strict';

var reqdir = require('require-dir');
var Browser = require('zombie');
var lodash = require('lodash');
var assert = require('chai').assert;
var app = require('../../app');
var services = reqdir('../../app/services');

// Prepare browser
Browser.localhost('127.0.0.1', process.env.PORT || 3002);

// Prepare server
before(function(done) {

  // Run the server
  app.listen(3002, function() {
    done();
  });

});

describe('Data endpoint', function() {

  var browser = new Browser({maxWait: 5000});
  this.timeout(10000);

  it('Should be alive', function (done) {
    browser.visit('/api/data', function() {
      browser.assert.success();
      done();
    });
  });

  it('Should follow data service return', function (done) {
    browser.visit('/api/data', function() {
      services.data.get().then(function (data) {
        assert.deepEqual(
          JSON.parse(browser.text()),
          JSON.parse(JSON.stringify({'results': data})));
      });
      done();
    });
  });

});
