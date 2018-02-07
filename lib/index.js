'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CockpitRealTime = undefined;

var _CockpitRealTime = require('./CockpitRealTime');

var _CockpitRealTime2 = _interopRequireDefault(_CockpitRealTime);

var _CockpitSDK = require('./CockpitSDK');

var _CockpitSDK2 = _interopRequireDefault(_CockpitSDK);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _CockpitSDK2.default;
exports.CockpitRealTime = _CockpitRealTime2.default;


var cockpit = new _CockpitSDK2.default({
    host: 'http://ginetta.cockpit.rocks/gatbsy', // e.g. local docker Cockpit.
    accessToken: '22d7923daa89bcb0ff2557e4153289'
});

cockpit.collection('employees', { limit: 1 }).get(function () {
    return console.log('success');
});
cockpit.collection('employees', { limit: 1 }).get(function () {
    return console.log('success');
});
cockpit.collection('employees', { limit: 1 }).get(function () {
    return console.log('success');
});
cockpit.collection('employees', { limit: 1 }).get(function () {
    return console.log('success');
});