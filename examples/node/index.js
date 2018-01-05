const CockpitSDK = require('../../lib');

const Cockpit = new CockpitSDK({
  host: 'http://localhost:8080', // e.g. local docker Cockpit.
  websocket: 'ws://localhost:4000',
  accessToken: '12a3456b789c12d34567ef8a9bc01d',
});

Cockpit.collection('portfolio', { limit: 3 }).watch(data => console.log(data));
