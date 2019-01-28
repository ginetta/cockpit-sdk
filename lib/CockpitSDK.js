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

var _queryString3 = require('./utils/queryString');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CockpitSDK = function () {
  function CockpitSDK(_ref) {
    var accessToken = _ref.accessToken,
        defaultOptions = _ref.defaultOptions,
        fetchInitOptions = _ref.fetchInitOptions,
        host = _ref.host,
        lang = _ref.lang,
        webSocket = _ref.webSocket,
        _ref$apiEndpoints = _ref.apiEndpoints,
        apiEndpoints = _ref$apiEndpoints === undefined ? {} : _ref$apiEndpoints,
        rest = _objectWithoutProperties(_ref, ['accessToken', 'defaultOptions', 'fetchInitOptions', 'host', 'lang', 'webSocket', 'apiEndpoints']);

    _classCallCheck(this, CockpitSDK);

    this.defaultEndpoints = {
      cockpitAssets: '/api/cockpit/assets',
      cockpitAuthUser: '/api/cockpit/authUser',
      cockpitImage: '/api/cockpit/image',
      cockpitListUsers: '/api/cockpit/listUsers',
      collectionsCollection: '/api/collections/collection/',
      collectionsGet: '/api/collections/get/',
      collectionsListCollections: '/api/collections/listCollections',
      collectionsRemove: '/api/collections/remove/',
      collectionsSave: '/api/collections/save/',
      regionsData: '/api/regions/data/',
      regionsGet: '/api/regions/get/',
      regionsListRegions: '/api/regions/listRegions',
      singletonsGet: '/api/singletons/get/',
      singletonsListSingletons: '/api/singletons/listSingletons',
      formsSubmit: '/api/forms/submit/'
    };
    this.endpoints = {};
    this.defaultOptions = {};
    this.fetchInitOptions = {
      mode: 'cors',
      cache: 'default'
    };

    this.getImageOptions = function (options) {
      return typeof options === 'number' ? { width: options } : options;
    };

    var invalidConfig = Object.keys(rest);

    if (invalidConfig.length) console.error('Invalid keys:', invalidConfig, '\n', 'Valid keys are:', 'accessToken, defaultOptions, fetchInitOptions, host, lang, webSocket');

    this.host = host;
    this.lang = lang;
    this.fetchInitOptions = Object.assign({}, this.fetchInitOptions, fetchInitOptions);
    this.defaultOptions = Object.assign({}, this.defaultOptions, defaultOptions);
    this.endpoints = Object.assign({}, this.defaultEndpoints, apiEndpoints);
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
      var requestInit = Object.assign({}, options, this.fetchInitOptions);

      var hostWithToken = '' + this.host + apiPath + '?' + _queryString2.default.stringify(this.queryParams) + '&' + _queryString2.default.stringify(queryParams);

      return (0, _isomorphicFetch2.default)(hostWithToken, requestInit).then(function (x) {
        return x.json();
      });
    }

    // @param {string} apiPath

  }, {
    key: 'fetchDataText',
    value: function fetchDataText(apiPath, options, queryParams) {
      var requestInit = Object.assign({}, options, this.fetchInitOptions);

      var hostWithToken = '' + this.host + apiPath + '?' + _queryString2.default.stringify(this.queryParams) + '&' + _queryString2.default.stringify(queryParams);

      return (0, _isomorphicFetch2.default)(hostWithToken, requestInit).then(function (x) {
        return x.text();
      });
    }

    // @param {string} collectionName

  }, {
    key: 'collectionSchema',
    value: function collectionSchema(collectionName) {
      return this.fetchData('' + this.endpoints.collectionsCollection + collectionName, {
        method: 'GET'
      });
    }
  }, {
    key: 'collectionList',
    value: function collectionList() {
      return this.fetchData(this.endpoints.collectionsListCollections, {
        method: 'GET'
      });
    }

    // @param {string} collectionName
    // @param {Request} options

  }, {
    key: 'collectionGet',
    value: function collectionGet(collectionName, options) {
      return this.fetchData('' + this.endpoints.collectionsGet + collectionName, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: this.stringifyOptions(options)
      });
    }

    // @param {string} collectionName
    // @param {Request} data

  }, {
    key: 'collectionSave',
    value: function collectionSave(collectionName, data) {
      return this.fetchData('' + this.endpoints.collectionsSave + collectionName, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: this.stringifyOptions({ data: data })
      });
    }

    // @param {string} collectionName
    // @param {Request} filter

  }, {
    key: 'collectionRemove',
    value: function collectionRemove(collectionName, filter) {
      return this.fetchData('' + this.endpoints.collectionsRemove + collectionName, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        filter: this.stringifyOptions(filter)
      });
    }
  }, {
    key: 'stringifyOptions',
    value: function stringifyOptions(options) {
      return JSON.stringify(Object.assign({}, this.defaultOptions, options));
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

          _this.webSocket.on(_this.CockpitRealTime.events.COLLECTIONS_SAVE_AFTER, getCollection, error);

          _this.webSocket.on(_this.CockpitRealTime.events.COLLECTIONS_SAVE_AFTER + '.' + collectionName, getCollection, error);
        },

        // @param {string} event
        // @param {function} success
        // @param {function} error
        on: function on(event, success, error) {
          var cockpitEvent = {
            save: _this.CockpitRealTime.events.COLLECTIONS_SAVE_AFTER,
            preview: _this.CockpitRealTime.events.COLLECTIONS_PREVIEW
          };

          if (!_this.webSocket) return;

          _this.webSocket.on(cockpitEvent[event], success, error);
        }
      };
    }

    // @param {string} regionName
    // @param {Request} options

  }, {
    key: 'regionGet',
    value: function regionGet(regionName, options) {
      return this.fetchDataText('' + this.endpoints.regionsGet + regionName, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: this.stringifyOptions(options)
      });
    }
  }, {
    key: 'singletonList',
    value: function singletonList() {
      return this.fetchData(this.endpoints.singletonsListSingletons, {
        method: 'GET'
      });
    }

    // @param {string} singletonName
    // @param {Request} options

  }, {
    key: 'singletonGet',
    value: function singletonGet(singletonName, options) {
      return this.fetchData('' + this.endpoints.singletonsGet + singletonName, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: this.stringifyOptions(options)
      });
    }
  }, {
    key: 'regionList',
    value: function regionList() {
      return this.fetchData(this.endpoints.RegionsListRegions, {
        method: 'GET'
      });
    }

    // @param {string} regionName
    // @param {Request} options

  }, {
    key: 'regionData',
    value: function regionData(regionName, options) {
      return this.fetchData('' + this.endpoints.regionsData + regionName, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: this.stringifyOptions(options)
      });
    }

    // @param {string} regionName
    // @param {Request} options

  }, {
    key: 'region',
    value: function region(regionName, options) {
      var _this2 = this;

      return {
        data: function data(success, error) {
          _this2.regionData(regionName, options).then(success).catch(error);
        },

        get: function get(success, error) {
          _this2.regionGet(regionName, options).then(success).catch(error);
        }
      };
    }

    // @param {string} formName
    // @param {Request} formData
    // @param {Request} options

  }, {
    key: 'formSubmit',
    value: function formSubmit(formName, formData) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this.fetchData('' + this.endpoints.formsSubmit + formName, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: this.stringifyOptions(Object.assign({ form: formData }, options))
      });
    }
  }, {
    key: 'assets',
    value: function assets(options) {
      return this.fetchData(this.endpoints.cockpitAssets, {
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

      return this.fetchDataText(this.endpoints.cockpitImage, { method: 'GET' }, {
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
          _opts$pixelRatio = opts.pixelRatio,
          pixelRatio = _opts$pixelRatio === undefined ? 1 : _opts$pixelRatio,
          filters = opts.filters,
          rest = _objectWithoutProperties(opts, ['width', 'height', 'quality', 'pixelRatio', 'filters']);

      var f = (0, _queryString3.stringifyObject)(filters);

      return '' + this.host + this.endpoints.cockpitImage + '?' + _queryString2.default.stringify(Object.assign({}, this.queryParams, {
        w: width ? Number(width) * pixelRatio : undefined,
        h: height ? Number(height) * pixelRatio : undefined,
        src: assetId,
        q: quality,
        d: 1,
        o: 1
      }, rest)) + (f || '');
    }
  }, {
    key: 'imageSrcSet',
    value: function imageSrcSet(assetId) {
      var _this3 = this;

      var widths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (!widths) return '';

      return widths.map(function (width) {
        if ((typeof width === 'undefined' ? 'undefined' : _typeof(width)) === 'object') {
          var srcSet = width.srcSet,
              opts = _objectWithoutProperties(width, ['srcSet']);

          return _this3.image(assetId, opts) + ' ' + (srcSet || opts.width ? '' + (srcSet || opts.width + 'w') : '');
        }

        return _this3.image(assetId, { width: width }) + ' ' + width + 'w';
      }).join(', ');
    }
  }, {
    key: 'authUser',
    value: function authUser(user, password) {
      return this.fetchData(this.endpoints.cockpitAuthUser, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: this.stringifyOptions({ user: user, password: password })
      });
    }
  }, {
    key: 'listUsers',
    value: function listUsers(options) {
      return this.fetchData(this.endpoints.cockpitListUsers, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }, options);
    }
  }, {
    key: 'setWebsocket',
    value: function setWebsocket(host) {
      // eslint-disable-next-line global-require
      this.CockpitRealTime = require('./CockpitRealTime');

      this.webSocket = this.CockpitRealTime({ host: host });
    }
  }]);

  return CockpitSDK;
}();

CockpitSDK.events = {
  SAVE: 'save',
  PREVIEW: 'preview'
};
exports.default = CockpitSDK;