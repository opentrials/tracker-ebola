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

  it('Should get the right object with id=3NCT02342171', function (done) {
    services.data.get().then(function(data) {
      var item = lodash.find(data, function(value) {
        if (value['Trial ID'] === 'NCT02342171') return true;
      });
      assert.ok(item, 'trial found');
      assert.strictEqual(item['Trial ID'], 'NCT02342171');
      assert.strictEqual(item['Title'], 'Emergency Evaluation of Convalescent Plasma for Ebola Viral Disease (EVD) in Guinea');
      assert.strictEqual(item['Recruitment'], 'Completed');
      //assert.strictEqual(item['Study Results'], null);
      assert.deepEqual(item['Conditions'], ['Hemorrhagic Fever, Ebola']);
      assert.deepEqual(item['Interventions'], ['Other: Convalescent Plasma']);
      assert.isArray(item['Sponsor/Collaborators']);
      assert.strictEqual(item['Sponsor/Collaborators'][0], 'Institute of Tropical Medicine, Belgium');
      assert.deepEqual(item['Age Groups'], ['Child', 'Adult', 'Senior']);
      assert.deepEqual(item['Phases'], ['Phase 2', 'Phase 3']);
      assert.strictEqual(item['Enrollment'], 102);
      assert.deepEqual(item['Funded Bys'], ['Other']);
      assert.strictEqual(item['Start Date'].getTime(), (new Date('2015-02-01')).getTime());
      assert.strictEqual(item['Completion Date'].getTime(), (new Date('2015-07-01')).getTime());
      //assert.strictEqual(item['Results First Received'], null);
      assert.strictEqual(item['Primary Completion Date'].getTime(), (new Date('2015-07-01')).getTime());
      assert.strictEqual(item['Country'], 'Guinea');
      assert.strictEqual(item['Source'], 'Clinical Trials');
      assert.strictEqual(item['URL'], 'https://ClinicalTrials.gov/show/NCT02342171');
      done();
    });
  });

});
