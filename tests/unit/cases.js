'use strict';

var reqdir = require('require-dir');
var lodash = require('lodash');
var assert = require('chai').assert;
var services = reqdir('../../app/services')

describe('Cases Service', function() {

  it('Should get an items array', function (done) {
    services.cases.get().then(function(data) {
      assert.isArray(data);
      assert.isAbove(data.length, 5);
      done();
    });
  });

});
