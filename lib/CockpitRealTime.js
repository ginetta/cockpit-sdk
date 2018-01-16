'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebSocket = require('universal-websocket-client');

var CockpitRealTime = function () {
  function CockpitRealTime(_ref) {
    var host = _ref.host,
        _ref$protocol = _ref.protocol,
        protocol = _ref$protocol === undefined ? 'refresh-protocol' : _ref$protocol;

    _classCallCheck(this, CockpitRealTime);

    this.websocket = new WebSocket(host, protocol);
  }

  _createClass(CockpitRealTime, [{
    key: 'on',
    value: function on(event, success, error) {
      if (!CockpitRealTime.isValidEvent(event)) {
        console.warn('Invalid event:', event);

        return;
      }

      this.websocket.addEventListener('message', function (message) {
        var response = JSON.parse(message.data);

        if (response.event.replace(CockpitRealTime.eventPrefix, '') !== event) return;

        success(Object.assign({}, response, {
          event: response.event
        }));
      });

      this.websocket.addEventListener('error', error);
    }
  }], [{
    key: 'isValidEvent',
    value: function isValidEvent(eventName) {
      if (!eventName) return false;

      if (Object.values(CockpitRealTime.events).includes(eventName)) return true;

      var eventsWithName = Object.values(CockpitRealTime.events).filter(function (x) {
        return x.includes('.%s');
      }).map(function (x) {
        return x.replace('.%s', '');
      });

      return eventsWithName.includes(eventName.split('.').slice(0, -1).join('.'));
    }
  }]);

  return CockpitRealTime;
}();

CockpitRealTime.events = {
  CONNECT: 'connect',
  REGIONS_SAVE_AFTER: 'regions.save.after',
  REGIONS_REMOVE_AFTER: 'regions.remove.after',
  COLLECTIONS_SAVE_AFTER: 'collections.save.after',
  COLLECTIONS_SAVE_AFTER_NAME: 'collections.save.after.%s',
  COLLECTIONS_REMOVE_AFTER: 'collections.remove.after',
  COLLECTIONS_PREVIEW: 'collections.preview'
};
CockpitRealTime.eventPrefix = 'cockpit:';


module.exports = CockpitRealTime;