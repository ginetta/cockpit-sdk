const ws = require('ws/lib/WebSocket');

let { WebSocket } = global;

if (!WebSocket) WebSocket = ws;

class CockpitRealTime {
  static events = {
    CONNECT: 'connect',
    REGIONS_SAVE_AFTER: 'regions.save.after',
    REGIONS_REMOVE_AFTER: 'regions.remove.after',
    COLLECTIONS_SAVE_AFTER: 'collections.save.after',
    COLLECTIONS_SAVE_AFTER_NAME: 'collections.save.after.%s',
    COLLECTIONS_REMOVE_AFTER: 'collections.remove.after',
    COLLECTIONS_PREVIEW: 'collections.preview',
  };

  static eventPrefix = 'cockpit:';

  constructor({ host, protocol = 'refresh-protocol' }) {
    this.websocket = new WebSocket(host, protocol);
  }

  static isValidEvent(eventName) {
    if (!eventName) return false;

    if (Object.values(CockpitRealTime.events).includes(eventName)) return true;

    const eventsWithName = Object.values(CockpitRealTime.events)
      .filter(x => x.includes('.%s'))
      .map(x => x.replace('.%s', ''));

    return eventsWithName.includes(
      eventName
        .split('.')
        .slice(0, -1)
        .join('.'),
    );
  }

  on(event, success, error) {
    if (!CockpitRealTime.isValidEvent(event)) {
      console.warn('Invalid event:', event);

      return;
    }

    this.websocket.addEventListener('message', message => {
      const response = JSON.parse(message.data);

      if (response.event.replace(CockpitRealTime.eventPrefix, '') !== event)
        return;

      success({
        ...response,
        event: response.event,
      });
    });

    this.websocket.addEventListener('error', error);
  }
}

module.exports = CockpitRealTime;
