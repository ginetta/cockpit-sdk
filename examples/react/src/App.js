import React, { Component } from 'react';
import './App.css';

import CockpitSDK from './lib';

const { protocol, hostname } = window.location;
const protocolWs = protocol.replace('http', 'ws');

const cockpit = new CockpitSDK({
  host: `${protocol}//${hostname}:8080`,
  webSocket: `${protocolWs}//${hostname}:4000`,
  accessToken: '12a3456b789c12d34567ef8a9bc01d',
});

// cockpit.assets({}).then(console.log);
// cockpit.authUser('user', 'password').then(console.log);

const toDictionary = (acc, entry) => ({ ...acc, [entry._id]: entry });

class App extends Component {
  state = {
    entries: [],
  };

  componentWillMount() {
    const collection = cockpit.collection('portfolio', {
      filter: { published: true },
      limit: 10,
    });

    collection.watch(data => {
      const entries = data.entries.reduce(toDictionary, {});

      this.setState({
        ...data,
        entries,
      });
    });

    collection.on('save', this.updateEntry.bind(this));
    collection.on('preview', this.updateEntry.bind(this));
  }

  // Save and preview sends only the entry so we nee to add it
  // back to the collection
  updateEntry({ entry }) {
    if (!this.state.entries[entry._id]) return;

    this.setState(prev => ({
      entries: { ...prev.entries, [entry._id]: entry },
    }));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome Real-time Cockpit</h1>
        </header>

        <main className="App-main">
          <ul>
            {Object.values(this.state.entries).map(x => (
              <li key={x._id}>
                <h3>{x.title}</h3>
                <p>{x.description}</p>
              </li>
            ))}
          </ul>

          <pre className="App-pre">
            {JSON.stringify(this.state, null, '  ')}
          </pre>
        </main>
      </div>
    );
  }
}

export default App;
