'use strict';

var Browser = require('zombie');
var assert = require('chai').assert;
var lodash = require('lodash');
var paginationService = require('../prototype/services/pagination');

describe('Pagination Service', function() {
  this.timeout(2000);

  var pagination = paginationService.create({
    currentPage: 4,
    itemsPerPage: 20
  });

  it('Should restrict currentPage when it is out of range', function (done) {
    assert.equal(pagination.currentPage, 1);
    assert.equal(pagination.currentPageValue, 4);
    done();
  });

  it('Should return currentPage when it is in allowed range', function (done) {
    pagination.itemsCount = 10 * pagination.itemsPerPage;
    assert.equal(pagination.currentPage, 4);
    assert.equal(pagination.currentPageValue, 4);
    done();
  });

  it('Should validate itemsPerPage', function (done) {
    pagination.itemsPerPage = -10;
    assert.equal(pagination.itemsPerPage, 20);
    pagination.itemsPerPage = 10;
    assert.equal(pagination.itemsPerPage, 10);
    done();
  });

  it('Should validate itemsCount', function (done) {
    pagination.itemsCount = -10;
    assert.equal(pagination.itemsCount, 0);
    pagination.itemsCount = 10;
    assert.equal(pagination.itemsCount, 10);
    done();
  });

});
