'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _utilities = require('./utilities');

var _utilities2 = _interopRequireDefault(_utilities);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() " +
                             "hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ?
         call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " +
                        typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) {
    Object.setPrototypeOf ?
    Object.setPrototypeOf(subClass, superClass) :
    subClass.__proto__ = superClass;
  }
}

var UniqueConstraintsError = function(_Error) {
  _inherits(UniqueConstraintsError, _Error);

  function UniqueConstraintsError(message) {
    _classCallCheck(this, UniqueConstraintsError);

    var _this = _possibleConstructorReturn(this,
      Object.getPrototypeOf(UniqueConstraintsError).call(this, message));

    _this.message = message;
    _this.name = 'UniqueConstraintsError';
    return _this;
  }

  return UniqueConstraintsError;
}(Error);

exports.default = {
  /**
   * Required value constraint. Supported types: all.
   * @param name
   * @param value
   * @param required
   * @returns {boolean}
   */

  check_required: function check_required(name, value, required) {
    if (required === true) {
      if (_lodash2.default.isUndefined(value) ||
          _utilities2.default.isNull(value) === true) {
        throw new Error('The field "' + String(name) + '" requires a value');
      }
    }
    return true;
  }

  /**
   * Min length constraint. Supported types: sting, array, object.Args
   * @param name
   * @param value
   * @param minLength
   * @returns {boolean}
   * @throws Error
   */
  ,
  check_minLength: function check_minLength(name, value, minLength) {
    if (value.length < minLength) {
      throw new Error('The field \'' + String(name) +
                      '\' must have a minimum length of ' + minLength);
    }
    return true;
  }

  /**
   * Max length constraint. Supported types: sting, array, object.Args
   * @param name
   * @param value
   * @param maxLength
   * @returns {boolean}
   */
  ,
  check_maxLength: function check_maxLength(name, value, maxLength) {
    if (value.length > maxLength) {
      throw new Error('The field \'' + String(name) +
                      '\' must have a maximum length of ' + maxLength);
    }
    return true;
  }

  /**
   * Minimum constraint. Supported types: integer, number, datetime, date, time
   * @param name
   * @param value
   * @param minimum
   * @returns {boolean}
   */
  ,
  check_minimum: function check_minimum(name, value, minimum) {
    var result = false;
    if (_utilities2.default.isNumeric(value)) {
      result = value < minimum;
    } else if (_moment2.default.isMoment(value) === true) {
      result = value.isBefore(minimum);
    } else {
      throw new Error('Unsupported type of value');
    }

    if (result) {
      throw new Error('The field \'' + String(name) +
                      '\' must not be less than ' + String(minimum));
    }
    return true;
  }

  /**
   * Maximum constraint. Supported types: integer, number, datetime, date, time
   * @param name
   * @param value
   * @param maximum
   * @returns {boolean}
   */
  ,
  check_maximum: function check_maximum(name, value, maximum) {
    var result = false;
    if (_utilities2.default.isNumeric(value)) {
      result = value > maximum;
    } else if (_moment2.default.isMoment(value) === true) {
      result = value.isAfter(maximum);
    } else {
      throw new Error('Unsupported type of value');
    }

    if (result) {
      throw new Error('The field \'' + String(name) +
                      '\' must not be more than ' + String(maximum));
    }
    return true;
  }
  /**
   * Pattern constraint for a string value. Supported types: all.
   * Input arguments should NOT be casted to type. Pattern constraint should be
   * checked as a string value before the value is cast. `value` is treated
   * as a string and must match the XML Schema Reg
   * @param name
   * @param value
   * @param pattern
   * @returns {boolean}
   */
  ,
  check_pattern: function check_pattern(name, value, pattern) {
    var v = String(value),
      match = pattern.match(new RegExp('^/(.*?)/([gimy]*)$')),
      regex = new RegExp(match[1], match[2]),
      matches = regex.exec(v);

    if (!matches || matches.length === 0) {
      throw new Error('The value \'' + String(pattern) + '\' for field \'' +
                      String(name) + '\' must match the pattern');
    }
    return true;
  },
  check_enum: function check_enum(name, value, enumerator) {
    var result = void 0;
    if (_lodash2.default.isArray(enumerator)) {
      result = enumerator;
    } else if (_lodash2.default.isObject(enumerator)) {
      result = Object.keys(enumerator);
    }

    if (result && result.indexOf(value) !== -1) {
      return true;
    }
    throw new Error('The value for field \'' + String(name) +
                    '\' must be in the enum array');
  }

  /**
   * Check unique constraints for every header and value independently.
   * Does not take in count the case, when headers which construct primary key
   * should be checked in combination with each other
   *
   * @param fieldName
   * @param value
   * @param headers
   * @param unique
   */
  ,
  check_unique: function check_unique(fieldName, value, headers, unique) {
    if (!_lodash2.default.includes(headers, fieldName)) {
      return;
    }

    if (!unique.hasOwnProperty(fieldName)) {
      unique[fieldName] = [value];
    } else {
      if (_lodash2.default.includes(unique[fieldName], value)) {
        throw new UniqueConstraintsError('Unique constraint violation ' +
                                         'for field name \'' +
                                         String(fieldName) + '\'');
      }
      unique[fieldName].push(value);
    }
  }

  /**
   * Check uniqueness of primary key
   *
   * @param values
   * @param headers
   * @param unique
   */
  ,
  check_unique_primary: function check_unique_primary(values, headers, unique) {
    var key = _lodash2.default.keys(headers).join(''),
      indexes = _lodash2.default.values(headers);

    var value = '';

    if (!unique.hasOwnProperty(key)) {
      unique[key] = [];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = indexes[Symbol.iterator](), _step;
           !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
           _iteratorNormalCompletion = true) {
        var index = _step.value;

        value += values[index].toString();
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

    if (_lodash2.default.includes(unique[key], value)) {
      throw new UniqueConstraintsError('Unique constraint violation for' +
                                       'primary key');
    }
    unique[key].push(value);
  }
};
