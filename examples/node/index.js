const CockpitSDK = require('../../lib').default;

const cockpit = new CockpitSDK({
  host: 'http://localhost:8080', // e.g. local docker Cockpit.
  webSocket: 'ws://localhost:4000',
  accessToken: '12a3456b789c12d34567ef8a9bc01d',
});

cockpit.collection('portfolio', { limit: 3 }).watch(data => console.log(data));
