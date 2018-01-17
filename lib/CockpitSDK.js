'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _CockpitRealTime = require('./CockpitRealTime');

var _CockpitRealTime2 = _interopRequireDefault(_CockpitRealTime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOptions = {
  mode: 'cors',
  cache: 'default'
};

var CockpitSDK = function () {
  function CockpitSDK(_ref) {
    var host = _ref.host,
        accessToken = _ref.accessToken,
        lang = _ref.lang,
        webSocket = _ref.webSocket;

    _classCallCheck(this, CockpitSDK);

    this.getImageOptions = function (options) {
      return typeof options === 'number' ? { width: options } : options;
    };

    this.host = host;
    this.lang = lang;
    this.accessToken = accessToken;
    this.webSocket = webSocket;
    this.queryParams = {
      lang: this.lang,
      token: this.accessToken
    };

    if (webSocket) {
      this.setWebsocket(webSocket);
    }
  }

  _createClass(CockpitSDK, [{
    key: 'fetchData',
    value: function fetchData(apiPath, options, queryParams) {
      var requestInit = Object.assign({}, options, defaultOptions);

      var hostWithToken = '' + this.host + apiPath + '?' + _queryString2.default.stringify(this.queryParams) + '&' + _queryString2.default.stringify(queryParams);

      return (0, _isomorphicFetch2.default)(hostWithToken, requestInit).then(function (x) {
        return x.json();
      });
    }

    // @param {string} apiPath

  }, {
    key: 'fetchDataText',
    value: function fetchDataText(apiPath, options, queryParams) {
      var requestInit = Object.assign({}, options, defaultOptions);

      var hostWithToken = '' + this.host + apiPath + '?' + _queryString2.default.stringify(this.queryParams) + '&' + _queryString2.default.stringify(queryParams);

      return (0, _isomorphicFetch2.default)(hostWithToken, requestInit).then(function (x) {
        return x.text();
      });
    }

    // @param {string} collectionName

  }, {
    key: 'collectionSchema',
    value: function collectionSchema(collectionName) {
      return this.fetchData('/api/collections/collection/' + collectionName, {
        method: 'GET'
      });
    }
  }, {
    key: 'collectionList',
    value: function collectionList() {
      return this.fetchData('/api/collections/listCollections', {
        method: 'GET'
      });
    }

    // @param {string} collectionName
    // @param {Request} options

  }, {
    key: 'collectionGet',
    value: function collectionGet(collectionName, options) {
      return this.fetchData('/api/collections/get/' + collectionName, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });
    }

    // @param {string} collectionName
    // @param {Request} data

  }, {
    key: 'collectionSave',
    value: function collectionSave(collectionName, data) {
      return this.fetchData('/api/collections/save/' + collectionName, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: data })
      });
    }

    // @param {string} collectionName
    // @param {Request} filter

  }, {
    key: 'collectionRemove',
    value: function collectionRemove(collectionName, filter) {
      return this.fetchData('/api/collections/remove/' + collectionName, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        filter: JSON.stringify(filter)
      });
    }

    // @param {string} collectionName
    // @param {Request} options

  }, {
    key: 'collection',
    value: function collection(collectionName, options) {
      var _this = this;

      return {
        get: function get(success, error) {
          _this.collectionGet(collectionName, options).then(success).catch(error);
        },

        promise: new Promise(function (success, error) {
          _this.collectionGet(collectionName, options).then(success).catch(error);
        }),

        schema: function schema(success, error) {
          _this.collectionSchema(collectionName, options).then(success).catch(error);
        },

        // @param {function} success
        // @param {function} error
        watch: function watch(success, error) {
          var getCollection = function getCollection() {
            return _this.collectionGet(collectionName, options).then(success).catch(error);
          };

          getCollection();

          if (!_this.webSocket) return;

          _this.webSocket.on(_CockpitRealTime2.default.events.COLLECTIONS_SAVE_AFTER, getCollection, error);

          _this.webSocket.on(_CockpitRealTime2.default.events.COLLECTIONS_SAVE_AFTER + '.' + collectionName, getCollection, error);
        },

        // @param {string} event
        // @param {function} success
        // @param {function} error
        on: function on(event, success, error) {
          var cockpitEvent = {
            save: _CockpitRealTime2.default.events.COLLECTIONS_SAVE_AFTER,
            preview: _CockpitRealTime2.default.events.COLLECTIONS_PREVIEW
          };

          if (!_this.webSocket) return;

          _this.webSocket.on(cockpitEvent[event], success, error);
        }
      };
    }

    // @param {string} regionName

  }, {
    key: 'regionGet',
    value: function regionGet(regionName) {
      return this.fetchDataText('/api/regions/get/' + regionName, {
        method: 'GET'
      });
    }
  }, {
    key: 'regionList',
    value: function regionList() {
      return this.fetchDataText('/api/regions/listRegions', {
        method: 'GET'
      });
    }

    // @param {string} regionName

  }, {
    key: 'regionData',
    value: function regionData(regionName) {
      return this.fetchData('/api/regions/data/' + regionName, { method: 'GET' });
    }

    // @param {string} collectionName

  }, {
    key: 'region',
    value: function region(regionName) {
      var _this2 = this;

      return {
        data: function data(success, error) {
          _this2.regionData(regionName).then(success).catch(error);
        },

        get: function get(success, error) {
          _this2.regionGet(regionName).then(success).catch(error);
        }
      };
    }
  }, {
    key: 'assets',
    value: function assets(options) {
      return this.fetchData('/api/cockpit/assets', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }, options);
    }
  }, {
    key: 'imageGet',
    value: function imageGet(assetId, _ref2) {
      var width = _ref2.width,
          height = _ref2.height,
          quality = _ref2.quality;

      return this.fetchDataText('/api/cockpit/image', { method: 'GET' }, {
        src: assetId,
        w: width,
        h: height,
        q: quality,
        d: 1
      });
    }
  }, {
    key: 'image',
    value: function image(assetId, options) {
      if (!options || options === {} || options === []) return this.host + '/' + assetId;

      if (Array.isArray(options)) return this.imageSrcSet(assetId, options);

      var opts = this.getImageOptions(options);

      var width = opts.width,
          height = opts.height,
          quality = opts.quality,
          rest = _objectWithoutProperties(opts, ['width', 'height', 'quality']);

      return this.host + '/api/cockpit/image?' + _queryString2.default.stringify(Object.assign({}, this.queryParams, {
        src: assetId,
        w: width,
        h: height,
        q: quality,
        d: 1,
        o: 1
      }, rest));
    }
  }, {
    key: 'imageSrcSet',
    value: function imageSrcSet(assetId) {
      var _this3 = this;

      var widths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (!widths) return '';

      return widths.map(function (width) {
        if ((typeof width === 'undefined' ? 'undefined' : _typeof(width)) === 'object') return _this3.image(assetId, { width: width.width }) + ' ' + (width.srcSet || width.width ? width.width + 'w' : '');

        return _this3.image(assetId, { width: width }) + ' ' + width + 'w';
      }).join(', ');
    }
  }, {
    key: 'authUser',
    value: function authUser(user, password) {
      return this.fetchData('/api/cockpit/authUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user, password: password })
      });
    }
  }, {
    key: 'listUsers',
    value: function listUsers(options) {
      return this.fetchData('/api/cockpit/listUsers', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }, options);
    }
  }, {
    key: 'setWebsocket',
    value: function setWebsocket(host) {
      this.webSocket = new _CockpitRealTime2.default({ host: host });
    }
  }]);

  return CockpitSDK;
}();

CockpitSDK.events = {
  SAVE: 'save',
  PREVIEW: 'preview'
};
exports.default = CockpitSDK;