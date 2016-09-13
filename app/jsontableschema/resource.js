'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _csvParse = require('csv-parse');

var _csvParse2 = _interopRequireDefault(_csvParse);

var _streamTransform = require('stream-transform');

var _streamTransform2 = _interopRequireDefault(_streamTransform);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _constraints = require('./constraints');

var _constraints2 = _interopRequireDefault(_constraints);

var _utilities = require('./utilities');

var _utilities2 = _interopRequireDefault(_utilities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @returns Promise
 */

var Resource = function () {
  function Resource(schema, data) {
    _classCallCheck(this, Resource);

    var self = this;
    this.source = data;

    return new Promise(function (resolve, reject) {
      if (schema instanceof _schema2.default) {
        self.schema = schema;
        resolve(self);
      } else {
        new _schema2.default(schema).then(function (model) {
          self.schema = model;
          resolve(self);
        }).catch(function (error) {
          reject(error);
        });
      }
    });
  }

  /**
   * Iter through the given dataset and create the converted dataset
   *
   * @param {Function} callback. Callback function to catch results of casting
   * @param {boolean} failFast. Default is false
   * @param {boolean} skipConstraints. Default is false
   * @throws {Array} of errors if cast failed on some field
   */


  _createClass(Resource, [{
    key: 'iter',
    value: function iter(callback) {
      var failFast = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var skipConstraints = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      var primaryKey = this.schema.primaryKey();
      var uniqueHeaders = getUniqueHeaders(this.schema);

      if (!_lodash2.default.isFunction(callback)) {
        throw new Error('Callback function is required');
      }

      if (primaryKey && primaryKey.length > 1) {
        var headers = this.schema.headers();
        uniqueHeaders = _lodash2.default.difference(uniqueHeaders, primaryKey);
        // using to check unique constraints for the row, because need to check
        // uniquness of the values combination (primary key for example)
        this.primaryHeaders = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = primaryKey[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var header = _step.value;

            // need to know the index of the header, so later it possible to
            // combine correct values in the row
            this.primaryHeaders[header] = headers.indexOf(header);
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
      }
      this.uniqueness = {};
      this.schema.uniqueness = this.uniqueness;
      // using for regular unique constraints for every value independently
      this.schema.uniqueHeaders = uniqueHeaders;

      return proceed(this, getReadStream(this.source), callback, failFast, skipConstraints);
    }
  }]);

  return Resource;
}();

/**
 * Convert provided data to the types of the current schema. If the option
 * `failFast` is given, it will raise the first error it encounters,
 * otherwise an array of errors thrown (if there are any errors occur).
 *
 * @param readStream
 * @param callback
 * @param failFast
 * @param skipConstraints
 */


exports.default = Resource;
function proceed(instance, readStream, callback) {
  var failFast = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
  var skipConstraints = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

  return new Promise(function (resolve, reject) {
    var parser = (0, _csvParse2.default)(),
        errors = [];
    var isFirst = true;

    readStream.then(function (data) {
      if (data.isArray) {
        data.stream.on('data', function (items) {
          cast(instance, reject, callback, errors, items, failFast, skipConstraints);
        }).on('end', function () {
          end(resolve, reject, errors);
        });
      } else {
        data.stream.pipe(parser);
      }
    }, function (error) {
      reject(error);
    });

    parser.on('readable', function () {
      var items = void 0;
      while ((items = parser.read()) !== null) {
        if (isFirst) {
          isFirst = false;
        } else {
          cast(instance, reject, callback, errors, items, failFast, skipConstraints);
        }
      }
    }).on('end', function () {
      end(resolve, reject, errors);
    });
  });
}

/**
 * Get all headers with unique constraints set to true
 * @returns {Array}
 */
function getUniqueHeaders(schema) {
  return _lodash2.default.chain(schema.fields()).filter(function (field) {
    return field.constraints.unique === true;
  }).map(function (field) {
    return field.name;
  }).value();
}

/**
 * Create reabale stream accordingly to the type of the source
 *
 * @param source. Can be:
 * array
 * stream
 * path to local file
 * path to remote file
 * @param callback - receive readable stream
 *
 * @returns Promise with readable stream object on resolve
 */
function getReadStream(source) {
  return new Promise(function (resolve, reject) {
    if (isReadStream(source)) {
      // it can be readable stream by it self
      resolve({ stream: source });
    } else if (_lodash2.default.isArray(source)) {
      (function () {
        // provided array with raw data
        var transformer = (0, _streamTransform2.default)(function (data) {
          return data;
        });
        resolve({ stream: transformer, isArray: true });
        source.forEach(function (item) {
          transformer.write(item);
        });
        transformer.end();
      })();
    } else if (_lodash2.default.isString(source)) {
      // probably it is some URL or local path to the file with the data
      var protocol = _url2.default.parse(source).protocol;
      if (_utilities2.default.isURL(protocol)) {
        var processor = protocol.indexOf('https') !== -1 ? _https2.default : _http2.default;
        // create readable stream from remote file
        processor.get(source, function (res) {
          resolve({ stream: res });
        }, function (error) {
          reject(error);
        });
      } else {
        // assume that it is path to local file
        // create readable stream
        resolve({ stream: _fs2.default.createReadStream(source) });
      }
    } else {
      reject('Unsupported format of source');
    }
  });
}

/**
 * Check if provided value is readable stream
 *
 * @param stream
 * @returns {boolean}
 */
function isReadStream(stream) {
  return stream instanceof _events2.default && _lodash2.default.isFunction(stream.read);
}

function cast(instance, reject, callback, errors, items, failFast, skipConstraints) {
  try {
    var values = instance.schema.castRow(items, failFast, skipConstraints);

    if (!skipConstraints && instance.primaryHeaders) {
      // unique constraints available only from Resource
      _constraints2.default.check_unique_primary(values, instance.primaryHeaders, instance.uniqueness);
    }
    callback(values);
  } catch (e) {
    if (failFast === true) {
      reject(e);
      return;
    }
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = e[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var error = _step2.value;

        errors.push(error);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }
}

function end(resolve, reject, errors) {
  if (errors.length > 0) {
    reject(errors);
  } else {
    resolve();
  }
}