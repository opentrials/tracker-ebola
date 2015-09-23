'use strict';

var reqdir = require('require-dir');
var lodash = require('lodash');
var assert = require('chai').assert;
var services = reqdir('../../prototype/services')

describe('Data Service', function() {

  it('Should get an items array', function (done) {
    services.data.get().then(function(data) {
      assert.isArray(data);
      assert.isAbove(data.length, 20);
      done();
    });
  });

  it('Should get the right object with id 1', function (done) {
    services.data.get().then(function(data) {
      var item = lodash.find(data, function(value) {
        if (value.Nul === '1') return true;
      });
      assert.equal(item['Nul'], '1');
      assert.equal(item['Trial ID'], 'NCT02326194');
      done();
    });
  });

});
