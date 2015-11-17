'use strict';

var reqdir = require('require-dir');
var lodash = require('lodash');
var assert = require('chai').assert;
var services = reqdir('../../app/services')

describe('Trials Service', function() {

  it('Should get an items array', function (done) {
    services.trials.get().then(function(data) {
      assert.isArray(data);
      assert.isAbove(data.length, 20);
      done();
    });
  });

});
