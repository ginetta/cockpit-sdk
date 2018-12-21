'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var stringifyObject = exports.stringifyObject = function stringifyObject(obj) {
  return obj ? Object.keys(obj).reduce(function (acc, key) {
    return acc + '&f[' + key + ']=' + obj[key];
  }, '') : undefined;
};

exports.default = {};