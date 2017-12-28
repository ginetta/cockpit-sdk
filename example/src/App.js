import "babel-polyfill";
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import CockpitSDK from "cockpit-sdk";

const { protocol, hostname, port } = window.location;
const protocolWs = protocol.replace("http", "ws");

const Cockpit = new CockpitSDK({
	host: protocol + "//" + hostname + ":8080",
	websocket: protocolWs + "//" + hostname + ":4000",
	accessToken: "12a3456b789c12d34567ef8a9bc01d"
});

Cockpit.collectionSchema('portfolio').then(console.log);

const idFy = (acc, entry) => ({ ...acc, [entry._id]: entry });

class App extends Component {
	state = {
		entries: []
	};

	updateEntry(data) {
		const entry = data.entry;

		if (!this.state.entries[entry._id]) return;

		this.setState(prev => ({
			entries: { ...prev.entries, [entry._id]: entry }
		}));
	}

	componentWillMount() {
		Cockpit.collection(
			"portfolio",
			{
				filter: { published: true },
				limit: 10
			},
			{}
		)
			.get(data => {
				console.log("get: ", data);
				const entries = data.entries.reduce(idFy, {});

				this.setState({
					...data,
					entries
				});
			})
			.on("save", this.updateEntry.bind(this))
			.on("preview", this.updateEntry.bind(this));
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<p className="App-intro">
					To get started, edit <code>src/App.js</code> and save to reload.
				</p>
				<ul>
					{Object.values(this.state.entries).map(x => (
						<li key={x._id}>
							<h3>{x.title}</h3>
							<p>{x.description}</p>
						</li>
					))}
				</ul>

				<pre style={{ textAlign: "left" }}>
					{JSON.stringify(this.state, null, "  ")}
				</pre>
			</div>
		);
	}
}

export default App;
