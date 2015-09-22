'use strict';

var Browser = require('zombie');
var assert = require('chai').assert;
var lodash = require('lodash');
var paginationService = require('../prototype/services/pagination');
var trialsService = require('../prototype/services/trials');

describe('Trials Service', function() {
  this.timeout(20000);

  it('Should fail when item does not exist', function (done) {
    trialsService.getItem(0).catch(function(){
      done();
    });
  });

  it('Should get a trial with all properties', function (done) {
    trialsService.getItem(200).then(function(item) {
      assert.property(item, 'conditions');
      assert.property(item, 'documents');
      assert.property(item, 'drugs');
      done();
    });
  });

  it('Should get trials using pagination', function (done) {
    var pagination = paginationService.create({
      itemsPerPage: 20,
      currentPage: 1
    });
    trialsService.getItems(pagination).then(function(items) {
      assert(items.length <= pagination.itemsPerPage);
      done();
    });
  });

  it('Should get trials by IDs', function (done) {
    var pagination = paginationService.create({
      itemsPerPage: 20,
      currentPage: 1
    });
    trialsService.getItems(pagination, [200]).then(function(items) {
      assert.equal(items.length, 1);
      done();
    });
  });

  it('Should search trials', function (done) {
    trialsService.getItem(200).then(function(item) {
      var pagination = paginationService.create({
        itemsPerPage: 20,
        currentPage: 1
      });
      trialsService.getItems(pagination, {
        phrase: item.publicTitle
      }).then(function (items) {
        assert.isAbove(items.length, 0);
        done();
      });
    });
  });

});
