'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

require('isomorphic-fetch');

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _utilities = require('./utilities');

var _utilities2 = _interopRequireDefault(_utilities);

var _types = require('./types');

var _types2 = _interopRequireDefault(_types);

var _constraints = require('./constraints');

var _constraints2 = _interopRequireDefault(_constraints);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * Model for a JSON Table Schema.
 *
 * Providers handy helpers for ingesting, validating and outputting
 * JSON Table Schemas: http://dataprotocols.org/json-table-schema/
 *
 * @param {string|JSON} source: An url or object that represents a schema
 *
 * @param {boolean} caseInsensitiveHeaders: if True, headers should be
 *   considered case insensitive, and `Schema` forces all headers to lowercase
 *   when they are represented via a model instance. This setting **does not**
 *   mutate the origin that come from the the input schema source.
 *
 * @returns Promise
 */

var Schema = function() {
  function Schema(source) {
    var caseInsensitiveHeaders = arguments.length <= 1 ||
                                 arguments[1] === undefined ? false :
                                 arguments[1];

    _classCallCheck(this, Schema);

    this.caseInsensitiveHeaders = !!caseInsensitiveHeaders;
    this.type = new _types2.default();
    return load(this, source);
  }

  /**
   * Cast value to fieldName's type
   *
   * @param fieldName
   * @param value
   * @param index
   * @param skipConstraints
   *
   * @returns {Type}
   * @throws Error if value can't be casted
   */


  _createClass(Schema, [{
    key: 'castValue',
    value: function castValue(fieldName, value) {
      var index = arguments.length <= 2 || arguments[2] === undefined ? 0 :
                  arguments[2];
      var skipConstraints = arguments.length <= 3 ||
                            arguments[3] === undefined ? true : arguments[3];

      var field = this.getField(fieldName, index);
      return this.type.cast(field, value, skipConstraints);
    }

    /**
     * Check if value to fieldName's type can be casted
     *
     * @param fieldName
     * @param value
     * @param index
     * @param skipConstraints
     *
     * @returns {Boolean}
     */

  }, {
    key: 'testValue',
    value: function testValue(fieldName, value) {
      var index = arguments.length <= 2 || arguments[2] === undefined ? 0 :
                  arguments[2];
      var skipConstraints = arguments.length <= 3 ||
                            arguments[3] === undefined ? true : arguments[3];

      var field = this.getField(fieldName, index);
      return this.type.test(field, value, skipConstraints);
    }

    /**
     * Convert the arguments given to the types of the current schema. Last
     * argument could be { failFast: true|false }.  If the option `failFast` is
     * given, it will raise the first error it encounters, otherwise an array of
     * errors thrown (if there are any errors occur)
     *
     * @param items
     * @param failFast
     * @param skipConstraints
     * @returns {Array}
     */

  }, {
    key: 'castRow',
    value: function castRow(items) {
      var failFast = arguments.length <= 1 || arguments[1] === undefined ?
                     false : arguments[1];
      var skipConstraints = arguments.length <= 2 ||
                            arguments[2] === undefined ? false : arguments[2];

      var headers = this.headers(),
        result = [],
        errors = [];

      if (headers.length !== items.length) {
        throw new Array('The number of items to convert does not match the ' +
                        'number of fields given in the schema');
      }

      for (var i = 0, length = items.length; i < length; i++) {
        try {
          var fieldName = headers[i],
            value = this.castValue(fieldName, items[i], i, skipConstraints);

          if (!skipConstraints) {
            // unique constraints available only from Resource
            if (this.uniqueness && this.uniqueHeaders) {
              _constraints2.default.check_unique(fieldName, value,
                this.uniqueHeaders, this.uniqueness);
            }
          }
          result.push(value);
        } catch (e) {
          var error = void 0;
          switch (e.name) {
            case 'UniqueConstraintsError':
              error = e.message;
              break;
            default:
              error = 'Wrong type for header: ' + String(headers[i]) +
                      ' and value: ' + String(items[i]);
          }
          if (failFast === true) {
            throw new Array(error);
          } else {
            errors.push(error);
          }
        }
      }

      if (errors.length > 0) {
        throw errors;
      }
      return result;
    }

    /**
     * Get fields of schema
     *
     * @returns {Array}
     */

  }, {
    key: 'fields',
    value: function fields() {
      return this.descriptor.fields;
    }

    /**
     * Get foregn keys of schema
     *
     * @returns {Array}
     */

  }, {
    key: 'foreignKeys',
    value: function foreignKeys() {
      return this.descriptor.foreignKeys;
    }

    /**
     * Return the `constraints` object for `fieldName`.
     * @param {string} fieldName
     * @param {number} index
     * @returns {object}
     */

  }, {
    key: 'getConstraints',
    value: function getConstraints(fieldName) {
      var index = arguments.length <= 1 || arguments[1] === undefined ? 0 :
                  arguments[1];

      return this.getField(fieldName, index).constraints;
    }

    /**
     * Return the `field` object for `fieldName`.
     * `index` allows accessing a field name by position, as JTS allows
     * duplicate field names.
     *
     * @param fieldName
     * @param index - index of the field inside the fields array
     * @returns {Object}
     * @throws Error in case fieldName does not exists in the given schema
     */

  }, {
    key: 'getField',
    value: function getField(fieldName) {
      var index = arguments.length <= 1 || arguments[1] === undefined ? 0 :
                  arguments[1];

      var name = fieldName;
      if (this.caseInsensitiveHeaders) {
        name = fieldName.toLowerCase();
      }
      var fields = _lodash2.default.filter(this.fields(), function(F) {
        return F.name === name;
      });

      if (!fields.length) {
        throw new Error('No such field name in schema: ' + String(fieldName));
      }

      if (!index) {
        return fields[0];
      }
      return this.fields()[index];
    }

    /**
     * Return all fields that match the given type
     *
     * @param typeName
     * @returns {Array}
     */

  }, {
    key: 'getFieldsByType',
    value: function getFieldsByType(typeName) {
      return _lodash2.default.filter(this.fields(), function(field) {
        return field.type === typeName;
      });
    }

    /**
     * Get all headers with required constraints set to true
     * @returns {Array}
     */

  }, {
    key: 'requiredHeaders',
    value: function requiredHeaders() {
      return _lodash2.default.chain(this.descriptor.fields)
        .filter(function(field) {
          return field.constraints.required === true;
        }).map(function(field) {
          return field.name;
        }).value();
    }

    /**
     * Check if the field exists in the schema
     *
     * @param fieldName
     * @returns {boolean}
     */

  }, {
    key: 'hasField',
    value: function hasField(fieldName) {
      try {
        return !!this.getField(fieldName);
      } catch (e) {
        return false;
      }
    }

    /**
     * Get names of the headers
     *
     * @returns {Array}
     */

  }, {
    key: 'headers',
    value: function headers() {
      return _lodash2.default.map(this.descriptor.fields, function(field) {
        return field.name;
      });
    }

    /**
     * Get primary key
     * @returns {string|Array}
     */

  }, {
    key: 'primaryKey',
    value: function primaryKey() {
      return this.descriptor.primaryKey;
    }
  }]);

  return Schema;
}();

/**
 * Load a JSON source, from string, URL or buffer
 * @param instance
 * @param source
 * @returns {Promise}
 */


exports.default = Schema;
function load(instance, source) {
  if (_lodash2.default.isString(source)) {
    if (_utilities2.default.isURL(_url2.default.parse(source).protocol)) {
      return new Promise(function(resolve, reject) {
        fetch(source).then(function(response) {
          if (response.status >= 400) {
            reject('Failed to download file due to bad response');
          }
          return response.json();
        }).then(function(json) {
          (0, _validate2.default)(json).then(function() {
            expand(instance, json);
            resolve(instance);
          }).catch(function(errors) {
            reject(errors);
          });
        });
      });
    }
  }
  return new Promise(function(resolve, reject) {
    (0, _validate2.default)(source).then(function() {
      expand(instance, source);
      resolve(instance);
    }).catch(function(errors) {
      reject(errors);
    });
  });
}

/**
 * Expand the schema with additional default properties
 *
 * @param instance
 * @param schema
 * @returns {*}
 */
function expand(instance, schema) {
  var DEFAULTS = {
    constraints: { required: false },
    format: 'default',
    type: 'string'
  };

  instance.descriptor = _lodash2.default.extend({}, schema, {
    fields: _lodash2.default.map(schema.fields || [], function(field) {
      var copyField = _lodash2.default.extend({}, field);

      // Set name to lower case if caseInsensitiveHeaders flag is True
      if (instance.caseInsensitiveHeaders) {
        copyField.name = field.name.toLowerCase();
      }

      // Ensure we have a default type if no type was declared
      if (!field.type) {
        copyField.type = DEFAULTS.type;
      }

      // Ensure we have a default format if no format was declared
      if (!field.format) {
        copyField.format = DEFAULTS.format;
      }

      // Ensure we have a minimum constraints declaration
      if (!field.constraints) {
        copyField.constraints = DEFAULTS.constraints;
      } else if (_lodash2.default.isUndefined(field.constraints.required)) {
        copyField.constraints.required = DEFAULTS.constraints.required;
      }
      return copyField;
    })
  });

  if (_lodash2.default.isString(instance.descriptor.primaryKey)) {
    instance.descriptor.primaryKey = [instance.descriptor.primaryKey];
  }
}