'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _types = require('./types');

var _types2 = _interopRequireDefault(_types);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Return a descriptor from the passed headers and values.
 *
 * @param headers {Array} - a list of header names
 * @param values {Array} - a reader over data, yielding each row as a list of
 *   values
 * @param options {Object}:
 *  - {integer} rowLimit - limit amount of rows to be proceed
 *  - {boolean} explicit - be explicit
 *  - {string} primaryKey - pass in a primary key or iterable of keys
 *  - {object} cast - object with cast instructions for types in the schema:
 *  {
 *  string : { format : 'email' },
 *  number : { format : 'currency' },
 *  date: { format : 'any'}
 *  }
 *
 * @returns {object} a JSON Table Schema as a JSON
 */

exports.default = function (headers, values) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  // Set up default options
  var opts = _lodash2.default.extend({
    rowLimit: null,
    explicit: false,
    primaryKey: null,
    cast: {}
  }, options),
      type = new _types2.default(opts.cast),
      descriptor = { fields: [] };

  if (opts.primaryKey) {
    if (_lodash2.default.isString(opts.primaryKey)) {
      opts.primaryKey = [opts.primaryKey];
    }
    descriptor.primaryKey = opts.primaryKey;
  }

  descriptor.fields = headers.map(function (header) {
    var constraints = {},
        field = {
      name: header,
      title: '',
      description: ''
    };

    if (opts.explicit) {
      constraints.required = true;
    }

    if (_lodash2.default.includes(opts.primaryKey, header)) {
      constraints.unique = true;
    }

    if (!_lodash2.default.isEmpty(constraints)) {
      field.constraints = constraints;
    }

    return field;
  });

  headers.forEach(function (header, index) {
    var columnValues = _lodash2.default.map(values, function (value) {
      return value[index];
    });
    var field = descriptor.fields[index];

    if (opts.rowLimit) {
      columnValues = _lodash2.default.take(columnValues, opts.rowLimit);
    }

    field.type = type.multiCast(columnValues);

    if (opts.cast && opts.cast.hasOwnProperty(field.type)) {
      field.format = opts.cast[field.type].format;
    }

    if (!field.format) {
      field.format = 'default';
    }
  });

  return descriptor;
};