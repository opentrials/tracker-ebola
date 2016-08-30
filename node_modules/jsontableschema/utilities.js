'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  REMOTE_SCHEMES: ['http', 'https', 'ftp', 'ftps'],
  NULL_VALUES: ['null', 'none', 'nil', 'nan', '-', ''],
  TRUE_VALUES: ['yes', 'y', 'true', 't', '1'],
  FALSE_VALUES: ['no', 'n', 'false', 'f', '0'],

  isNumeric: function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },
  isInteger: function isInteger(value) {
    if (this.isNumeric(value)) {
      return Number.isInteger(+value);
    }
    return false;
  },
  isNull: function isNull(value) {
    return value === null || this.NULL_VALUES.indexOf(value) !== -1;
  },
  isTrue: function isTrue(value) {
    return value === true || this.TRUE_VALUES.indexOf(value) !== -1;
  },
  isFalse: function isFalse(value) {
    return value === false || this.FALSE_VALUES.indexOf(value) !== -1;
  },
  isURL: function isURL(protocol) {
    if (!protocol) return false;
    return this.REMOTE_SCHEMES.indexOf(protocol.replace(':', '')) !== -1;
  }
};