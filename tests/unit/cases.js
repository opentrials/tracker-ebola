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

  it('Should get the right object with year=2015, month=1', function (done) {
    services.cases.get().then(function(data) {
      var item = lodash.find(data, function(value) {
        if (value['Year'] === 2015 && value['Month'] === 1) return true;
      });
      assert.ok(item, 'case found');
      assert.strictEqual(item['Year'], 2015);
      assert.strictEqual(item['Month'], 1);
      assert.strictEqual(item['Cases'], 1953);
      assert.strictEqual(item['Deaths'], 939);
      assert.strictEqual(item['Cases Summary'], 22124);
      assert.strictEqual(item['Deaths Summary'], 8829);
      assert.strictEqual(item['Datapackage'], 'http://apps.who.int/gho/data/view.ebola-sitrep.ebola-summary-20150130?lang=en');
      done();
    });
  });

});
