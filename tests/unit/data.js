'use strict';

var reqdir = require('require-dir');
var lodash = require('lodash');
var assert = require('chai').assert;
var services = reqdir('../../app/services')

describe('Data Service', function() {

  it('Should get an items array', function (done) {
    services.data.get().then(function(data) {
      assert.isArray(data);
      assert.isAbove(data.length, 20);
      done();
    });
  });

  it('Should get the right object with id 3', function (done) {
    services.data.get().then(function(data) {
      var item = lodash.find(data, function(value) {
        if (value.Nul === 3) return true;
      });
      assert.ok(item);
      assert.strictEqual(item['Nul'], 3);
      assert.strictEqual(item['Trial ID'], 'NCT02342171');
      assert.strictEqual(item['Title'], 'Emergency Evaluation of Convalescent Plasma for Ebola Viral Disease (EVD) in Guinea');
      assert.strictEqual(item['Recruitment'], 'Completed');
      assert.strictEqual(item['Study Results'], 'No Results Available');
      assert.deepEqual(item['Conditions'], ['Hemorrhagic Fever, Ebola']);
      assert.deepEqual(item['Interventions'], ['Other: Convalescent Plasma']);
      assert.isArray(item['Sponsor/Collaborators']);
      assert.strictEqual(item['Sponsor/Collaborators'][0], 'Institute of Tropical Medicine, Belgium');
      assert.deepEqual(item['Age Groups'], ['Child', 'Adult', 'Senior']);
      assert.deepEqual(item['Phases'], ['Phase 2', 'Phase 3']);
      assert.strictEqual(item['Enrollment'], 102);
      assert.deepEqual(item['Funded Bys'], ['Other']);
      assert.strictEqual(item['Start Date'].getTime(), (new Date('2015-02-15')).getTime());
      assert.strictEqual(item['Completion Date'].getTime(), (new Date('2015-07-15')).getTime());
      assert.strictEqual(item['Results First Received'], 'No Study Results Posted');
      assert.strictEqual(item['Primary Completion Date'].getTime(), (new Date('2015-07-15')).getTime());
      assert.strictEqual(item['URL'], 'https://ClinicalTrials.gov/show/NCT02342171');
      done();
    });
  });

});
