"use strict";

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

var _queryString = require("query-string");

var _queryString2 = _interopRequireDefault(_queryString);

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _CockpitRealTime = require("./CockpitRealTime");

var _CockpitRealTime2 = _interopRequireDefault(_CockpitRealTime);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var defaultOptions = {
    mode: "cors",
    cache: "default"
};

var CockpitSDK = function() {
    function CockpitSDK(_ref) {
        var host = _ref.host, accessToken = _ref.accessToken, lang = _ref.lang, websocket = _ref.websocket;
        _classCallCheck(this, CockpitSDK);
        this.host = host;
        this.lang = lang;
        this.accessToken = accessToken;
        this.websocket = websocket;
        this.queryParams = {
            lang: this.lang,
            token: this.accessToken
        };
        if (websocket) {
            this.websocket = new _CockpitRealTime2.default({
                host: websocket
            });
        }
    }
    _createClass(CockpitSDK, [ {
        key: "fetchData",
        value: function fetchData(apiPath, options) {
            var requestInit = Object.assign({}, options, defaultOptions);
            var hostWithToken = "" + this.host + apiPath + "?" + _queryString2.default.stringify(this.queryParams);
            return (0, _isomorphicFetch2.default)(hostWithToken, requestInit).then(function(x) {
                return x.json();
            });
        }
    }, {
        key: "fetchDataText",
        value: function fetchDataText(apiPath, options, additionalOptions) {
            var requestInit = Object.assign({}, options, defaultOptions);
            var hostWithToken = "" + this.host + apiPath + "?" + _queryString2.default.stringify(this.queryParams) + "&" + _queryString2.default.stringify(additionalOptions);
            return (0, _isomorphicFetch2.default)(hostWithToken, requestInit).then(function(x) {
                return x.text();
            });
        }
    }, {
        key: "collectionSchema",
        value: function collectionSchema(collectionName) {
            return this.fetchData("/api/collections/collection/" + collectionName, {
                method: "GET"
            });
        }
    }, {
        key: "collectionEntries",
        value: function collectionEntries(collectionName, options) {
            return this.fetchData("/api/collections/get/" + collectionName, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(options)
            });
        }
    }, {
        key: "collection",
        value: function collection(collectionName, options) {
            var _this = this;
            var api = {
                get: function get(success, error) {
                    var getCollection = function getCollection() {
                        return _this.collectionEntries(collectionName, options).then(success).catch(error);
                    };
                    _this.websocket.on(_CockpitRealTime2.default.events.COLLECTIONS_SAVE_AFTER, getCollection, error);
                    _this.websocket.on(_CockpitRealTime2.default.events.COLLECTIONS_SAVE_AFTER + "." + collectionName, getCollection, error);
                    getCollection();
                    return api;
                },
                on: function on(event, success, error) {
                    var cockpitEvent = {
                        save: _CockpitRealTime2.default.events.COLLECTIONS_SAVE_AFTER,
                        preview: _CockpitRealTime2.default.events.COLLECTIONS_PREVIEW
                    };
                    _this.websocket.on(cockpitEvent[event], success, error);
                    return api;
                }
            };
            return api;
        }
    }, {
        key: "regionRenderedTemplate",
        value: function regionRenderedTemplate(regionName) {
            return this.fetchData("/api/regions/get/" + regionName, {
                method: "GET"
            });
        }
    }, {
        key: "regionFormData",
        value: function regionFormData(regionName) {
            return this.fetchData("/api/regions/data/" + regionName, {
                method: "GET"
            });
        }
    }, {
        key: "assets",
        value: function assets() {
            return this.fetchData("/api/cockpit/assets", {
                method: "GET"
            });
        }
    }, {
        key: "image",
        value: function image(assetId, _ref2) {
            var width = _ref2.width, height = _ref2.height;
            return this.fetchDataText("/api/cockpit/image", {
                method: "GET"
            }, {
                src: assetId,
                w: width,
                h: height,
                d: 1
            });
        }
    } ]);
    return CockpitSDK;
}();

CockpitSDK.events = {
    SAVE: "save",
    PREVIEW: "preview"
};

module.exports = CockpitSDK;