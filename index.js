const qs = require(`query-string`);
const fetch = require(`node-fetch`);

const defaultOptions = {
  mode: "cors",
  cache: "default"
}

class Cockpit {
  constructor({ host, accessToken }) {
    this.host = host;
    this.accessToken = accessToken;
    this.queryParams = {
      token: this.accessToken
    };
  }

  // @param {string} apiPath
  async fetchData(apiPath, options) {
    const requestInit = {
      ...options,
      ...defaultOptions
    };

    const hostWithToken = `${this.host}${apiPath}?${qs.stringify(this.queryParams)}`;

    const response = await fetch(hostWithToken, requestInit);
    const json = await response.json();

    return json;
  }

  // @param {string} collection
  async collectionSchema(collection) {
    return this.fetchData(`/api/collections/collection/${collection}`, { method: "GET" });
  }

  // @param {string} collection
  async collectionEntries(collection) {
    return this.fetchData(`/api/collections/get/${collection}`, { method: "GET" });
  }

  // @param {string} collection
  // @param {Request} options
  async collectionEntriesFiltered(collection, options) {
    return this.fetchData(`/api/collections/get/${collection}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options)
    });
  }

  // @param {string} region
  async regionRenderedTemplate(region) {
    return this.fetchData(`/api/regions/get/${region}`, { method: "GET" });
  }

  // @param {string} region
  async regionFormData(region) {
    return this.fetchData(`/api/regions/data/${region}`, { method: "GET" });
  }

  async assets() {
    return this.fetchData(`/api/cockpit/assets`, { method: "GET" });
  }
}

exports.Cockpit = Cockpit;
