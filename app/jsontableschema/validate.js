'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _tv = require('tv4');

var _tv2 = _interopRequireDefault(_tv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 Validate that `schema` is a valid JSON Table Schema.

 Args:
 * `schema`: a dict to check if it is valid JSON Table Schema

 Returns:
 * A tuple of `valid`, `errors`
 */

exports.default = function (schema) {
  var fieldNames = _lodash2.default.map(schema.fields || [], _lodash2.default.property('name'));

  return new Promise(function (resolve, reject) {
    (0, _isomorphicFetch2.default)('http://schemas.datapackages.org/json-table-schema.json').then(function (response) {
      if (response.status >= 400) {
        return reject(['Failed to download JSON schema']);
      }
      return response.json();
    }).then(function (standard) {
      var result = _tv2.default.validateMultiple(schema, standard);
      if (result.valid) {
        var validation = extra();
        if (validation.valid) {
          resolve(true);
        } else {
          reject(validation.errors);
        }
      } else {
        reject(errors(result.errors));
      }
    });
  });

  /**
   * Extract useful information from the tv4 errors object
   * @param values
   * @returns {Array}
   */
  function errors(values) {
    var result = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var error = _step.value;

        result.push(message(error));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return result;
  }

  /**
   * Create useful message from the each error occur
   * @param error
   * @returns {*}
   */
  function message(error) {
    var result = error.message;
    if (error.dataPath) {
      result += ' in "' + String(error.dataPath) + '"';
    }
    if (error.schemaPath) {
      result += ' schema path: "' + String(error.schemaPath) + '"';
    }
    return result;
  }

  /**
   * Extra validation for schema which can't be covered by tv4 validator
   * - primary key
   * @returns {{valid: boolean, errors: Array}}
   */
  function extra() {
    var errs = [];
    var valid = true;

    /**
     * Schema may contain a `primary key`
     */
    if (schema.primaryKey) {
      var primaryKey = schema.primaryKey;
      // Ensure that the primary key matches field names
      if (_lodash2.default.isString(primaryKey)) {
        if (!_lodash2.default.includes(fieldNames, primaryKey)) {
          valid = false;
          errs.push('primary key ' + String(primaryKey) + ' must match schema field names');
        }
      } else if (_lodash2.default.isArray(primaryKey)) {
        _lodash2.default.each(primaryKey, function (pk) {
          if (!_lodash2.default.includes(fieldNames, pk)) {
            valid = false;
            errs.push('primary key ' + String(pk) + ' must match schema field names');
          }
        });
      }
    }

    /**
     * Schema may contain a `foreign keys`
     */
    if (schema.foreignKeys) {
      var foreignKeys = schema.foreignKeys;
      _lodash2.default.each(foreignKeys, function (fk) {
        if (_lodash2.default.isString(fk.fields)) {
          if (!_lodash2.default.includes(fieldNames, fk.fields)) {
            valid = false;
            errs.push('foreign key ' + String(fk.fields) + ' must match schema field names');
          }

          if (!_lodash2.default.isString(fk.reference.fields)) {
            valid = false;
            errs.push('foreign key ' + String(fk.reference.fields) + ' must be same type as ' + String(fk.fields));
          }
        } else if (_lodash2.default.isArray(fk.fields)) {
          _lodash2.default.each(fk.fields, function (field) {
            if (!_lodash2.default.includes(fieldNames, field)) {
              valid = false;
              errs.push('foreign key ' + String(field) + ' must match schema field names');
            }
          });
          if (!_lodash2.default.isArray(fk.reference.fields)) {
            valid = false;
            errs.push('foreign key ' + String(fk.reference.fields) + ' must be same type as ' + String(fk.fields));
          } else {
            if (fk.reference.fields.length !== fk.fields.length) {
              valid = false;
              errs.push('foreign key fields must contain the same number ' + 'entries as reference.fields');
            }
          }
        }

        if (fk.reference.resource === 'self') {
          if (_lodash2.default.isString(fk.reference.fields)) {
            if (!_lodash2.default.includes(fieldNames, fk.reference.fields)) {
              valid = false;
              errs.push('foreign key ' + String(fk.fields) + ' must be found in the schema field names');
            }
          } else if (_lodash2.default.isArray(fk.reference.fields)) {
            _lodash2.default.each(fk.reference.fields, function (field) {
              if (!_lodash2.default.includes(fieldNames, field)) {
                valid = false;
                errs.push('foreign key ' + String(field) + ' must be found in the schema field names');
              }
            });
          }
        }
      });
    }

    return {
      valid: valid,
      errors: errs
    };
  }
};
//# sourceMappingURL=validate.js.map