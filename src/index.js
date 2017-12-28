import qs from "query-string";
import fetch from "isomorphic-fetch";
import CockpitRealTime from "./CockpitRealTime";

const defaultOptions = {
	mode: "cors",
	cache: "default"
};

// @todo language support
// @todo pagination
// @todo item by slug

class CockpitSDK {
	static events = {
		SAVE: 'save',
		PREVIEW: 'preview',
	}

	constructor({ host, accessToken, lang, websocket }) {
		this.host = host;
		this.lang = lang;
		this.accessToken = accessToken;
		this.websocket = websocket;
		this.queryParams = {
			lang: this.lang,
			token: this.accessToken
		};

		if (websocket) {
			this.websocket = new CockpitRealTime({ host: websocket });
		}
	}

	async fetchData(apiPath, options) {
		const requestInit = {
			...options,
			...defaultOptions
		};

		const hostWithToken = `${this.host}${apiPath}?${qs.stringify(
			this.queryParams
		)}`;

		const response = await fetch(hostWithToken, requestInit);
		const json = await response.json();

		return json;
	}

	// @param {string} apiPath
	async fetchDataText(apiPath, options, additionalOptions) {
		const requestInit = {
			...options,
			...defaultOptions
		};

		const hostWithToken = `${this.host}${apiPath}?${qs.stringify(
			this.queryParams
		)}&${qs.stringify(additionalOptions)}`;
		const response = await fetch(hostWithToken, requestInit);
		const result = await response.text();

		return result;
	}

	// @param {string} collectionName
	async collectionSchema(collectionName) {
		return this.fetchData(`/api/collections/collection/${collectionName}`, {
			method: "GET"
		});
	}

	// @param {string} collectionName
	// @param {Request} options
	async collectionEntries(collectionName, options) {
		return this.fetchData(`/api/collections/get/${collectionName}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(options)
		});
	}

	// @param {string} collectionName
	// @param {Request} options
	collection(collectionName, options) {
		const api = {
			// @param {function} success
			// @param {function} error
			get: (success, error) => {
				const getCollection = () =>
					this.collectionEntries(collectionName, options)
						.then(success)
						.catch(error);

				this.websocket.on(
					CockpitRealTime.events.COLLECTIONS_SAVE_AFTER,
					getCollection,
					error
				);

				this.websocket.on(
					CockpitRealTime.events.COLLECTIONS_SAVE_AFTER + '.' + collectionName,
					getCollection,
					error
				);

				getCollection();

				return api;
			},

			// @param {string} event
			// @param {function} success
			// @param {function} error
			on: (event, success, error) => {
				const cockpitEvent = {
					save: CockpitRealTime.events.COLLECTIONS_SAVE_AFTER,
					preview: CockpitRealTime.events.COLLECTIONS_PREVIEW
				};

				this.websocket.on(cockpitEvent[event], success, error);

				return api;
			}
		};

		return api;
	}

	// @param {string} regionName
	async regionRenderedTemplate(regionName) {
		return this.fetchData(`/api/regions/get/${regionName}`, { method: "GET" });
	}

	// @param {string} regionName
	async regionFormData(regionName) {
		return this.fetchData(`/api/regions/data/${regionName}`, { method: "GET" });
	}

	async assets() {
		return this.fetchData("/api/cockpit/assets", { method: "GET" });
	}

	async image(assetId, { width, height }) {
		return this.fetchDataText(
			"/api/cockpit/image",
			{ method: "GET" },
			{
				src: assetId,
				w: width,
				h: height,
				d: 1
			}
		);
	}
}

module.exports = CockpitSDK;
