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

function _asyncToGenerator(fn) {
    return function() {
        var gen = fn.apply(this, arguments);
        return new Promise(function(resolve, reject) {
            function step(key, arg) {
                try {
                    var info = gen[key](arg);
                    var value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                if (info.done) {
                    resolve(value);
                } else {
                    return Promise.resolve(value).then(function(value) {
                        step("next", value);
                    }, function(err) {
                        step("throw", err);
                    });
                }
            }
            return step("next");
        });
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
        value: function() {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(apiPath, options) {
                var requestInit, hostWithToken, response, json;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            requestInit = Object.assign({}, options, defaultOptions);
                            hostWithToken = "" + this.host + apiPath + "?" + _queryString2.default.stringify(this.queryParams);
                            _context.next = 4;
                            return (0, _isomorphicFetch2.default)(hostWithToken, requestInit);

                          case 4:
                            response = _context.sent;
                            _context.next = 7;
                            return response.json();

                          case 7:
                            json = _context.sent;
                            return _context.abrupt("return", json);

                          case 9:
                          case "end":
                            return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
            function fetchData(_x, _x2) {
                return _ref2.apply(this, arguments);
            }
            return fetchData;
        }()
    }, {
        key: "fetchDataText",
        value: function() {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(apiPath, options, additionalOptions) {
                var requestInit, hostWithToken, response, result;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            requestInit = Object.assign({}, options, defaultOptions);
                            hostWithToken = "" + this.host + apiPath + "?" + _queryString2.default.stringify(this.queryParams) + "&" + _queryString2.default.stringify(additionalOptions);
                            _context2.next = 4;
                            return (0, _isomorphicFetch2.default)(hostWithToken, requestInit);

                          case 4:
                            response = _context2.sent;
                            _context2.next = 7;
                            return response.text();

                          case 7:
                            result = _context2.sent;
                            return _context2.abrupt("return", result);

                          case 9:
                          case "end":
                            return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
            function fetchDataText(_x3, _x4, _x5) {
                return _ref3.apply(this, arguments);
            }
            return fetchDataText;
        }()
    }, {
        key: "collectionSchema",
        value: function() {
            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(collectionName) {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            return _context3.abrupt("return", this.fetchData("/api/collections/collection/" + collectionName, {
                                method: "GET"
                            }));

                          case 1:
                          case "end":
                            return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));
            function collectionSchema(_x6) {
                return _ref4.apply(this, arguments);
            }
            return collectionSchema;
        }()
    }, {
        key: "collectionEntries",
        value: function() {
            var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(collectionName, options) {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            return _context4.abrupt("return", this.fetchData("/api/collections/get/" + collectionName, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(options)
                            }));

                          case 1:
                          case "end":
                            return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));
            function collectionEntries(_x7, _x8) {
                return _ref5.apply(this, arguments);
            }
            return collectionEntries;
        }()
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
        value: function() {
            var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(regionName) {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            return _context5.abrupt("return", this.fetchData("/api/regions/get/" + regionName, {
                                method: "GET"
                            }));

                          case 1:
                          case "end":
                            return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));
            function regionRenderedTemplate(_x9) {
                return _ref6.apply(this, arguments);
            }
            return regionRenderedTemplate;
        }()
    }, {
        key: "regionFormData",
        value: function() {
            var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(regionName) {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            return _context6.abrupt("return", this.fetchData("/api/regions/data/" + regionName, {
                                method: "GET"
                            }));

                          case 1:
                          case "end":
                            return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));
            function regionFormData(_x10) {
                return _ref7.apply(this, arguments);
            }
            return regionFormData;
        }()
    }, {
        key: "assets",
        value: function() {
            var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            return _context7.abrupt("return", this.fetchData("/api/cockpit/assets", {
                                method: "GET"
                            }));

                          case 1:
                          case "end":
                            return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));
            function assets() {
                return _ref8.apply(this, arguments);
            }
            return assets;
        }()
    }, {
        key: "image",
        value: function() {
            var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(assetId, _ref9) {
                var width = _ref9.width, height = _ref9.height;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            return _context8.abrupt("return", this.fetchDataText("/api/cockpit/image", {
                                method: "GET"
                            }, {
                                src: assetId,
                                w: width,
                                h: height,
                                d: 1
                            }));

                          case 1:
                          case "end":
                            return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));
            function image(_x11, _x12) {
                return _ref10.apply(this, arguments);
            }
            return image;
        }()
    } ]);
    return CockpitSDK;
}();

CockpitSDK.events = {
    SAVE: "save",
    PREVIEW: "preview"
};

module.exports = CockpitSDK;