'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _d3TimeFormat = require('d3-time-format');

var _utilities = require('./utilities');

var _utilities2 = _interopRequireDefault(_utilities);

var _constraints = require('./constraints');

var _constraints2 = _interopRequireDefault(_constraints);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Abstract = function () {
  function Abstract(field) {
    _classCallCheck(this, Abstract);

    this.format = 'default';
    this.formats = ['default'];
    this.field = field || {};

    if (field && field.format) {
      this.format = field.format;
    }
  }

  /**
   * Try to cast the value
   *
   * @param value
   * @param skipConstraints
   * @returns {*} casted value
   * @throws Error if value can't be casted
   */


  _createClass(Abstract, [{
    key: 'cast',
    value: function cast(value) {
      var skipConstraints = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      var format = void 0,
          castValue = void 0;

      if (_utilities2.default.isNull(value)) {
        if (!skipConstraints) {
          _constraints2.default.check_required(this.field.name, value, this.isRequired());
        }
        return null;
      }

      // check some constraints before cast
      if (!skipConstraints) {
        var pattern = this.getConstraint('pattern');
        if (pattern) {
          _constraints2.default.check_pattern(this.field.name, value, pattern);
        }
      }

      // Cast with the appropriate handler, falling back to default if none
      if (this.format.indexOf('fmt') === 0) {
        format = 'fmt';
      } else {
        format = this.format;
      }

      var handler = 'cast' + String(format.charAt(0).toUpperCase() + format.substring(1));

      try {
        if (this.hasFormat(format) && this[handler]) {
          castValue = this[handler](value);
        } else {
          castValue = this.castDefault(value);
        }
      } catch (e) {
        throw new Error('Invalid Cast Error');
      }

      if (!skipConstraints) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _lodash2.default.keys(this.field.constraints)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var constraint = _step.value;

            switch (constraint) {
              case 'unique':
              case 'pattern':
              case 'required':
                continue;
              default:
                if (this.constraints.indexOf(constraint) === -1) {
                  throw new Error('Field type \'' + String(this.field.type) + '\' does ' + ('not support the \'' + String(constraint) + '\' constraint'));
                }
                _constraints2.default['check_' + String(constraint)](this.field.name, castValue, this.field.constraints[constraint]);
            }
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
      return castValue;
    }

    /**
     * Test if it possible to cast the value
     *
     * @param value
     * @param skipConstraints
     * @returns {boolean}
     */

  }, {
    key: 'test',
    value: function test(value) {
      var skipConstraints = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      try {
        this.cast(value, skipConstraints);
        return true;
      } catch (e) {
        return false;
      }
    }

    /**
     * Method should be implemented by every type
     * @throws Error
     */

  }, {
    key: 'castDefault',
    value: function castDefault() {
      throw new Error();
    }
  }, {
    key: 'hasFormat',
    value: function hasFormat(format) {
      return !!_lodash2.default.includes(this.formats, format);
    }
  }, {
    key: 'getConstraint',
    value: function getConstraint(value) {
      return this.field.constraints[value];
    }
  }, {
    key: 'isRequired',
    value: function isRequired() {
      return !!this.getConstraint('required');
    }
  }]);

  return Abstract;
}();

var StringType = function (_Abstract) {
  _inherits(StringType, _Abstract);

  _createClass(StringType, null, [{
    key: 'name',
    get: function get() {
      return 'string';
    }
  }]);

  function StringType(field) {
    _classCallCheck(this, StringType);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StringType).call(this, field));

    _this.constraints = ['required', 'pattern', 'enum', 'minLength', 'maxLength'];
    _this.formats = ['default', 'email', 'uri', 'binary'];
    _this.emailPattern = new RegExp('[^@]+@[^@]+\\.[^@]+');
    _this.uriPattern = new RegExp('^http[s]?://');
    return _this;
  }

  _createClass(StringType, [{
    key: 'castDefault',
    value: function castDefault(value) {
      this.typeCheck(value);
      return value;
    }
  }, {
    key: 'castEmail',
    value: function castEmail(value) {
      this.typeCheck(value);

      if (!this.emailPattern.exec(value)) {
        throw new Error();
      }
      return value;
    }
  }, {
    key: 'castUri',
    value: function castUri(value) {
      this.typeCheck(value);

      if (!this.uriPattern.exec(value)) {
        throw new Error();
      }
      return value;
    }
  }, {
    key: 'castBinary',
    value: function castBinary(value) {
      try {
        this.typeCheck(value);
      } catch (e) {
        if (!Buffer.isBuffer(value)) {
          throw new Error();
        }
      }
      return new Buffer(value).toString();
    }
  }, {
    key: 'typeCheck',
    value: function typeCheck(value) {
      if (_utilities2.default.isNumeric(value) || typeof value !== 'string') {
        throw new Error();
      }
      return true;
    }
  }]);

  return StringType;
}(Abstract);

var IntegerType = function (_Abstract2) {
  _inherits(IntegerType, _Abstract2);

  _createClass(IntegerType, null, [{
    key: 'name',
    get: function get() {
      return 'integer';
    }
  }]);

  function IntegerType(field) {
    _classCallCheck(this, IntegerType);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(IntegerType).call(this, field));

    var groupChar = (field || {}).groupChar || ',',
        decimalChar = (field || {}).decimalChar || '.';

    _this2.constraints = ['required', 'pattern', 'enum', 'minimum', 'maximum'];
    _this2.regex = {
      group: new RegExp('[' + String(groupChar) + ']', 'g'),
      decimal: new RegExp('[' + String(decimalChar) + ']', 'g'),
      percent: new RegExp('[%‰‱％﹪٪]', 'g'),
      currency: new RegExp('[$£€]', 'g')
    };
    return _this2;
  }

  _createClass(IntegerType, [{
    key: 'castDefault',
    value: function castDefault(value) {
      var newValue = this.beforeCast(value);
      // probably it is float number
      if (newValue.indexOf('.') !== -1) {
        throw new Error();
      }
      if (_utilities2.default.isInteger(newValue)) {
        return Number(newValue);
      }
      throw new Error();
    }
  }, {
    key: 'beforeCast',
    value: function beforeCast(value) {
      return String(value).replace(this.regex.group, '').replace(this.regex.percent, '').replace(this.regex.currency, '').replace(this.regex.decimal, '.');
    }
  }]);

  return IntegerType;
}(Abstract);

var NumberType = function (_IntegerType) {
  _inherits(NumberType, _IntegerType);

  _createClass(NumberType, null, [{
    key: 'name',
    get: function get() {
      return 'number';
    }
  }]);

  function NumberType(field) {
    _classCallCheck(this, NumberType);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(NumberType).call(this, field));

    _this3.formats = ['default', 'currency'];
    return _this3;
  }

  _createClass(NumberType, [{
    key: 'castDefault',
    value: function castDefault(value) {
      var newValue = this.beforeCast(value);

      if (!_utilities2.default.isNumeric(newValue)) {
        throw new Error();
      }

      // need to cover the case then number has .00 format
      if (newValue.indexOf('.') !== -1 && _utilities2.default.isInteger(newValue)) {
        var toFixed = newValue.split('.')[1].length;
        return Number(newValue).toFixed(toFixed);
      }
      // here probably normal float number
      if (Number(newValue) == newValue) {
        return Number(newValue);
      }
      throw new Error();
    }
  }, {
    key: 'castCurrency',
    value: function castCurrency(value) {
      return this.castDefault(this.beforeCast(value));
    }
  }]);

  return NumberType;
}(IntegerType);

var BooleanType = function (_Abstract3) {
  _inherits(BooleanType, _Abstract3);

  _createClass(BooleanType, null, [{
    key: 'name',
    get: function get() {
      return 'boolean';
    }
  }]);

  function BooleanType(field) {
    _classCallCheck(this, BooleanType);

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(BooleanType).call(this, field));

    _this4.constraints = ['required', 'pattern', 'enum'];
    return _this4;
  }

  _createClass(BooleanType, [{
    key: 'castDefault',
    value: function castDefault(value) {
      try {
        this.typeCheck(value);
        return value;
      } catch (e) {}

      var v = String(value).trim().toLowerCase();
      if (_utilities2.default.isTrue(v)) {
        return true;
      } else if (_utilities2.default.isFalse(v)) {
        return false;
      }
      throw new Error();
    }
  }, {
    key: 'typeCheck',
    value: function typeCheck(value) {
      if (typeof value === 'boolean') {
        return true;
      }
      throw new Error();
    }
  }]);

  return BooleanType;
}(Abstract);

var ArrayType = function (_Abstract4) {
  _inherits(ArrayType, _Abstract4);

  _createClass(ArrayType, null, [{
    key: 'name',
    get: function get() {
      return 'array';
    }
  }]);

  function ArrayType(field) {
    _classCallCheck(this, ArrayType);

    var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(ArrayType).call(this, field));

    _this5.constraints = ['required', 'pattern', 'enum', 'minLength', 'maxLength'];
    return _this5;
  }

  _createClass(ArrayType, [{
    key: 'castDefault',
    value: function castDefault(value) {
      if (this.typeCheck(value)) {
        return value;
      }
      var val = JSON.parse(value);
      if (this.typeCheck(val)) {
        return val;
      }
      throw new Error();
    }

    /**
     * Type check of value
     *
     * @param value
     * @returns {boolean}
     */

  }, {
    key: 'typeCheck',
    value: function typeCheck(value) {
      if (_lodash2.default.isArray(value)) {
        return true;
      }
      throw new Error();
    }
  }]);

  return ArrayType;
}(Abstract);

var ObjectType = function (_Abstract5) {
  _inherits(ObjectType, _Abstract5);

  _createClass(ObjectType, null, [{
    key: 'name',
    get: function get() {
      return 'object';
    }
  }]);

  function ObjectType(field) {
    _classCallCheck(this, ObjectType);

    var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(ObjectType).call(this, field));

    _this6.constraints = ['required', 'pattern', 'enum', 'minimum', 'maximum'];
    return _this6;
  }

  _createClass(ObjectType, [{
    key: 'castDefault',
    value: function castDefault(value) {
      if (_lodash2.default.isObject(value) && !_lodash2.default.isArray(value) && !_lodash2.default.isFunction(value)) {
        return value;
      }
      var v = JSON.parse(value);
      if (!(v instanceof Object)) {
        throw new Error();
      }
      return v;
    }
  }]);

  return ObjectType;
}(Abstract);

var DateType = function (_Abstract6) {
  _inherits(DateType, _Abstract6);

  _createClass(DateType, null, [{
    key: 'name',
    get: function get() {
      return 'date';
    }
  }]);

  function DateType(field) {
    _classCallCheck(this, DateType);

    var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(DateType).call(this, field));

    _this7.formats = ['default', 'any', 'fmt'];
    _this7.ISO8601 = 'YYYY-MM-DD';
    _this7.constraints = ['required', 'pattern', 'enum', 'minimum', 'maximum'];
    return _this7;
  }

  _createClass(DateType, [{
    key: 'castAny',
    value: function castAny(value) {
      var date = (0, _moment2.default)(new Date(value));
      if (!date.isValid()) {
        throw new Error();
      }
      return date.toDate();
    }
  }, {
    key: 'castDefault',
    value: function castDefault(value) {
      var date = (0, _moment2.default)(value, this.ISO8601, true);
      if (!date.isValid()) {
        throw new Error();
      }
      return date.toDate();
    }
  }, {
    key: 'castFmt',
    value: function castFmt(value) {
      var date = (0, _d3TimeFormat.timeParse)(this.format.replace(/^fmt:/, ''))(value);
      if (date == null) {
        throw new Error();
      }
      return date;
    }
  }]);

  return DateType;
}(Abstract);

var TimeType = function (_DateType) {
  _inherits(TimeType, _DateType);

  _createClass(TimeType, null, [{
    key: 'name',
    get: function get() {
      return 'time';
    }
  }]);

  function TimeType(field) {
    _classCallCheck(this, TimeType);

    var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(TimeType).call(this, field));

    _this8.formats = ['default', 'any', 'fmt'];
    return _this8;
  }

  _createClass(TimeType, [{
    key: 'castDefault',
    value: function castDefault(value) {
      var date = (0, _moment2.default)(value, 'HH:mm:ss', true);

      if (!date.isValid()) {
        throw new Error();
      }
      return date.toDate();
    }
  }]);

  return TimeType;
}(DateType);

var DateTimeType = function (_DateType2) {
  _inherits(DateTimeType, _DateType2);

  _createClass(DateTimeType, null, [{
    key: 'name',
    get: function get() {
      return 'datetime';
    }
  }]);

  function DateTimeType(field) {
    _classCallCheck(this, DateTimeType);

    var _this9 = _possibleConstructorReturn(this, Object.getPrototypeOf(DateTimeType).call(this, field));

    _this9.formats = ['default', 'any', 'fmt'];
    _this9.ISO8601 = _moment2.default.ISO_8601;
    return _this9;
  }

  return DateTimeType;
}(DateType);

var GeoPointType = function (_Abstract7) {
  _inherits(GeoPointType, _Abstract7);

  _createClass(GeoPointType, null, [{
    key: 'name',
    get: function get() {
      return 'geopoint';
    }
  }]);

  function GeoPointType(field) {
    _classCallCheck(this, GeoPointType);

    var _this10 = _possibleConstructorReturn(this, Object.getPrototypeOf(GeoPointType).call(this, field));

    _this10.formats = ['default', 'array', 'object'];
    _this10.constraints = ['required', 'pattern', 'enum'];
    return _this10;
  }

  _createClass(GeoPointType, [{
    key: 'castDefault',
    value: function castDefault(value) {
      try {
        return this.castString(value);
      } catch (e) {}

      try {
        return this.castArray(value);
      } catch (e) {}

      try {
        return this.castObject(value);
      } catch (e) {}
      throw new Error();
    }

    /**
     * Cast string of format "latitude, longitude"
     * @param value
     * @returns {*}
     * @throws Error in case String has incorrect format or wrong values
     * for latitude or longitude
     */

  }, {
    key: 'castString',
    value: function castString(value) {
      if (_lodash2.default.isString(value)) {
        var geoPoint = value.split(',');
        if (geoPoint.length === 2) {
          geoPoint = [geoPoint[0].trim(), geoPoint[1].trim()];
          this.checkRange(geoPoint);
          return this.reFormat(geoPoint);
        }
      }
      throw new Error();
    }
  }, {
    key: 'castArray',
    value: function castArray(value) {
      if (_lodash2.default.isArray(value) && value.length === 2) {
        var longitude = String(value[0]).trim(),
            latitude = String(value[1]).trim(),
            geoPoint = [longitude, latitude];

        this.checkRange(geoPoint);
        return this.reFormat(geoPoint);
      }
      throw new Error();
    }
  }, {
    key: 'castObject',
    value: function castObject(value) {
      if (value && (_lodash2.default.isUndefined(value.longitude) || _lodash2.default.isUndefined(value.latitude))) {
        throw new Error('Invalid Geo Point format');
      }
      var longitude = String(value.longitude).trim(),
          latitude = String(value.latitude).trim(),
          geoPoint = [longitude, latitude];

      this.checkRange(geoPoint);
      return this.reFormat(geoPoint);
    }

    /**
     * Geo point may be passed as a string, an object with keys or an array
     * @param value
     * @returns {boolean}
     */

  }, {
    key: 'typeCheck',
    value: function typeCheck(value) {
      if (_lodash2.default.isString(value) || _lodash2.default.isArray(value) || _lodash2.default.keys(value).length) {
        return true;
      }
      throw new Error();
    }

    /**
     * Check the range of geo points
     *
     * @param geoPoint
     * @throws Error
     */

  }, {
    key: 'checkRange',
    value: function checkRange() {
      var geoPoint = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var longitude = Number(geoPoint[0]),
          latitude = Number(geoPoint[1]);

      if (isNaN(longitude) || isNaN(latitude)) {
        throw new Error('longtitude and latitude should be number');
      }

      if (longitude >= 180 || longitude <= -180) {
        throw new Error('longtitude should be between -180 and 180, ' + ('found: ' + String(longitude)));
      }

      if (latitude >= 90 || latitude <= -90) {
        throw new Error('latitude should be between -90 and 90, ' + ('found: ' + String(latitude)));
      }
    }

    /**
     * Bring array values to the same format
     * @param geoPoint
     * @returns {Array}
     */

  }, {
    key: 'reFormat',
    value: function reFormat(geoPoint) {
      var result = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = geoPoint[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var point = _step2.value;

          point = String(point);
          if (point.indexOf('.') === -1) {
            point = Number(point).toFixed(1);
          }
          result.push(point);
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

      return result;
    }
  }]);

  return GeoPointType;
}(Abstract);

// TODO copy functionality from Python lib


var GeoJSONType = function (_GeoPointType) {
  _inherits(GeoJSONType, _GeoPointType);

  _createClass(GeoJSONType, null, [{
    key: 'name',
    get: function get() {
      return 'geojson';
    }
  }]);

  function GeoJSONType(field) {
    _classCallCheck(this, GeoJSONType);

    var _this11 = _possibleConstructorReturn(this, Object.getPrototypeOf(GeoJSONType).call(this, field));

    _this11.formats = ['default', 'topojson'];
    _this11.constraints = ['required', 'pattern', 'enum'];

    _this11.spec = {
      types: ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon', 'GeometryCollection', 'Feature', 'FeatureCollection']
    };
    return _this11;
  }

  _createClass(GeoJSONType, [{
    key: 'castDefault',
    value: function castDefault(value) {
      return _get(Object.getPrototypeOf(GeoJSONType.prototype), 'castDefault', this).call(this, value);
    }
  }, {
    key: 'castTopojson',
    value: function castTopojson() {
      throw new Error('Not implemented');
    }

    // Geo JSON is always an object

  }, {
    key: 'typeCheck',
    value: function typeCheck(value) {
      if (_lodash2.default.isObject(value) && !_lodash2.default.isFunction(value)) {
        return true;
      }
      throw new Error();
    }
  }]);

  return GeoJSONType;
}(GeoPointType);

var AnyType = function (_Abstract8) {
  _inherits(AnyType, _Abstract8);

  _createClass(AnyType, null, [{
    key: 'name',
    get: function get() {
      return 'any';
    }
  }]);

  function AnyType(field) {
    _classCallCheck(this, AnyType);

    var _this12 = _possibleConstructorReturn(this, Object.getPrototypeOf(AnyType).call(this, field));

    _this12.constraints = ['required', 'pattern', 'enum'];
    return _this12;
  }

  _createClass(AnyType, [{
    key: 'cast',
    value: function cast(value) {
      return value;
    }
  }, {
    key: 'test',
    value: function test() {
      return true;
    }
  }]);

  return AnyType;
}(Abstract);

var Types = {
  IntegerType: IntegerType,
  NumberType: NumberType,
  BooleanType: BooleanType,
  ArrayType: ArrayType,
  ObjectType: ObjectType,
  DateType: DateType,
  TimeType: TimeType,
  DateTimeType: DateTimeType,
  GeoPointType: GeoPointType,
  GeoJSONType: GeoJSONType,
  StringType: StringType,
  AnyType: AnyType
};

/**
 * Guess the type for a value
 *
 * @param options - TODO add description
 */

var Type = function () {
  function Type(options) {
    _classCallCheck(this, Type);

    this.typeOptions = options || {};
  }

  /**
   * Try to find the best suited Type for provided values
   *
   * @param values
   * @returns String - name of the type
   */


  _createClass(Type, [{
    key: 'multiCast',
    value: function multiCast(values) {
      var types = suitableTypes(values, this.typeOptions),
          typeNames = _lodash2.default.keys(Types),
          suitableType = _lodash2.default.find(typeNames, function (type) {
        return _lodash2.default.indexOf(types, type) !== -1;
      });
      return Types[suitableType].name;
    }

    /**
     * Cast the value of the field accordingly to the field type
     * @param field
     * @param value
     * @param skipConstraints
     * @returns {result of cast}
     * @throws Error if cast failed
     */

  }, {
    key: 'cast',
    value: function cast(field, value) {
      var skipConstraints = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      return getType(field).cast(value, skipConstraints);
    }

    /**
     * Test the value if it can be casted for this field type
     * @param field
     * @param value
     * @param skipConstraints
     * @returns boolean
     */

  }, {
    key: 'test',
    value: function test(field, value) {
      var skipConstraints = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      return getType(field).test(value, skipConstraints);
    }
  }]);

  return Type;
}();

/**
 * Return types suitable to the provided multiple values
 *
 * @param values
 * @returns {Array}
 */


exports.default = Type;
function suitableTypes(values, options) {
  var filtered = values.filter(function (v) {
    return !_lodash2.default.isUndefined(v) || _lodash2.default.isEmpty(v);
  }),
      typeNames = _lodash2.default.keys(Types);

  if (filtered.length === 0) {
    return ['AnyType'];
  }

  var typeList = filtered.map(function (value) {
    return typeNames.filter(function (T) {
      return new Types[T](options[Types[T].name]).test(value);
    });
  });
  return _lodash2.default.reduce(typeList, function (memo, types) {
    return _lodash2.default.intersection(memo, types);
  });
}

function getType(field) {
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = _lodash2.default.keys(Types)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var T = _step3.value;

      if (Types[T].name === field.type) {
        return new Types[T](field);
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  throw new Error('Unsupported field type');
}