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
        value: function fetchData(apiPath, options, queryParams) {
            var requestInit = Object.assign({}, options, defaultOptions);
            var hostWithToken = "" + this.host + apiPath + "?" + _queryString2.default.stringify(this.queryParams) + "&" + _queryString2.default.stringify(queryParams);
            return (0, _isomorphicFetch2.default)(hostWithToken, requestInit).then(function(x) {
                return x.json();
            });
        }
    }, {
        key: "fetchDataText",
        value: function fetchDataText(apiPath, options, queryParams) {
            var requestInit = Object.assign({}, options, defaultOptions);
            var hostWithToken = "" + this.host + apiPath + "?" + _queryString2.default.stringify(this.queryParams) + "&" + _queryString2.default.stringify(queryParams);
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
        key: "collectionList",
        value: function collectionList(collectionName) {
            return this.fetchData("/api/collections/listCollections", {
                method: "GET"
            });
        }
    }, {
        key: "collectionGet",
        value: function collectionGet(collectionName, options) {
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
                save: function save(success, error) {
                    console.warn("collection.().save() not implemented yet");
                    return api;
                },
                remove: function remove(success, error) {
                    console.warn("collection.().remove() not implemented yet");
                    return api;
                },
                get: function get(success, error) {
                    _this.collectionGet(collectionName, options).then(success).catch(error);
                    return api;
                },
                schema: function schema(success, error) {
                    _this.collectionSchema(collectionName, options).then(success).catch(error);
                    return api;
                },
                watch: function watch(success, error) {
                    var getCollection = function getCollection() {
                        return _this.collectionGet(collectionName, options).then(success).catch(error);
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
        key: "regionGet",
        value: function regionGet(regionName) {
            return this.fetchDataText("/api/regions/get/" + regionName, {
                method: "GET"
            });
        }
    }, {
        key: "regionList",
        value: function regionList() {
            return this.fetchDataText("/api/regions/listRegions", {
                method: "GET"
            });
        }
    }, {
        key: "regionData",
        value: function regionData(regionName) {
            return this.fetchData("/api/regions/data/" + regionName, {
                method: "GET"
            });
        }
    }, {
        key: "region",
        value: function region(regionName) {
            var _this2 = this;
            var api = {
                data: function data(success, error) {
                    _this2.regionData(regionName).then(success).catch(error);
                    return api;
                },
                get: function get(success, error) {
                    _this2.regionGet(regionName).then(success).catch(error);
                    return api;
                }
            };
            return api;
        }
    }, {
        key: "assets",
        value: function assets(options) {
            return this.fetchData("/api/cockpit/assets", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }, options);
        }
    }, {
        key: "image",
        value: function image(assetId, _ref2) {
            var width = _ref2.width, height = _ref2.height, quality = _ref2.quality;
            return this.fetchDataText("/api/cockpit/image", {
                method: "GET"
            }, {
                src: assetId,
                w: width,
                h: height,
                q: quality,
                d: 1
            });
        }
    }, {
        key: "authUser",
        value: function authUser(user, password) {
            return this.fetchData("/api/cockpit/authUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user: user,
                    password: password
                })
            });
        }
    }, {
        key: "listUsers",
        value: function listUsers(options) {
            return this.fetchData("/api/cockpit/listUsers", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }, options);
        }
    } ]);
    return CockpitSDK;
}();

CockpitSDK.events = {
    SAVE: "save",
    PREVIEW: "preview"
};

module.exports = CockpitSDK;