import CockpitRealTime from './CockpitRealTime';
import CockpitSDK from './CockpitSDK';

export default CockpitSDK;
export { CockpitRealTime };


const cockpit = new CockpitSDK({
    host: 'http://ginetta.cockpit.rocks/gatbsy', // e.g. local docker Cockpit.
    accessToken: '22d7923daa89bcb0ff2557e4153289',
});

cockpit.collection('employees', { limit: 1 }).get(() => console.log('success'));
cockpit.collection('employees', { limit: 1 }).get(() => console.log('success'));
cockpit.collection('employees', { limit: 1 }).get(() => console.log('success'));
cockpit.collection('employees', { limit: 1 }).get(() => console.log('success'));