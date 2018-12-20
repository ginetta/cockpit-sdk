'use strict';

var _CockpitSDK = require('../CockpitSDK');

var _CockpitSDK2 = _interopRequireDefault(_CockpitSDK);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('Expect Cockpit.image to return array of numbers', function () {
  var cockpit = new _CockpitSDK2.default({
    host: 'foo',
    accessToken: 'bar',
    lang: 'biz'
  });
  var imageOptions = [10, 20, 30];

  var result = cockpit.image('bux', imageOptions);

  expect(result).toBe('' + 'foo/api/cockpit/image?d=1&lang=biz&o=1&src=bux&token=bar&w=10 10w, ' + 'foo/api/cockpit/image?d=1&lang=biz&o=1&src=bux&token=bar&w=20 20w, ' + 'foo/api/cockpit/image?d=1&lang=biz&o=1&src=bux&token=bar&w=30 30w');
});

test('Expect Cockpit.image to return height', function () {
  var cockpit = new _CockpitSDK2.default({
    host: 'foo',
    accessToken: 'bar',
    lang: 'biz'
  });
  var imageOptions = {
    width: 200,
    height: 100
  };

  var result = cockpit.image('bux', imageOptions);

  expect(result).toBe('foo/api/cockpit/image?d=1&h=100&lang=biz&o=1&src=bux&token=bar&w=200');
});

test('Expect Cockpit.image with pixel ratio', function () {
  var cockpit = new _CockpitSDK2.default({
    host: 'foo',
    accessToken: 'bar',
    lang: 'biz'
  });
  var imageOptions = {
    width: 200,
    height: 100,
    pixelRatio: 2
  };

  var result = cockpit.image('bux', imageOptions);

  expect(result).toBe('foo/api/cockpit/image?d=1&h=200&lang=biz&o=1&src=bux&token=bar&w=400');
});

test('Expect Cockpit.image with array to return height', function () {
  var cockpit = new _CockpitSDK2.default({
    host: 'foo',
    accessToken: 'bar',
    lang: 'biz'
  });
  var imageOptions1 = {
    width: 200,
    height: 100
  };

  var imageOptions2 = {
    width: 20,
    height: 10
  };

  var result = cockpit.image('bux', [imageOptions1, imageOptions2]);

  expect(result).toBe('' + 'foo/api/cockpit/image?d=1&h=100&lang=biz&o=1&src=bux&token=bar&w=200 200w, ' + 'foo/api/cockpit/image?d=1&h=10&lang=biz&o=1&src=bux&token=bar&w=20 20w');
});

test('Expect Cockpit.image with array to return pixel ratio', function () {
  var cockpit = new _CockpitSDK2.default({
    host: 'foo',
    accessToken: 'bar',
    lang: 'biz'
  });
  var imageOptions1 = {
    pixelRatio: 2,
    width: 200,
    height: 100
  };

  var imageOptions2 = {
    pixelRatio: 2,
    width: 20,
    height: 10
  };

  var result = cockpit.image('bux', [imageOptions1, imageOptions2]);

  expect(result).toBe('' + 'foo/api/cockpit/image?d=1&h=200&lang=biz&o=1&src=bux&token=bar&w=400 200w, ' + 'foo/api/cockpit/image?d=1&h=20&lang=biz&o=1&src=bux&token=bar&w=40 20w');
});

test('Expect Cockpit.image with array to return different srcSet', function () {
  var cockpit = new _CockpitSDK2.default({
    host: 'foo',
    accessToken: 'bar',
    lang: 'biz'
  });
  var imageOptions1 = {
    width: 200,
    height: 100,
    srcSet: '1x'
  };

  var imageOptions2 = Object.assign({}, imageOptions1, {
    pixelRatio: 2,
    srcSet: '2x'
  });

  var result = cockpit.image('bux', [imageOptions1, imageOptions2]);

  expect(result).toBe('' + 'foo/api/cockpit/image?d=1&h=100&lang=biz&o=1&src=bux&token=bar&w=200 1x, ' + 'foo/api/cockpit/image?d=1&h=200&lang=biz&o=1&src=bux&token=bar&w=400 2x');
});