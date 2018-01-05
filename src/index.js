import qs from 'query-string';
import fetch from 'isomorphic-fetch';
import CockpitRealTime from './CockpitRealTime';

const defaultOptions = {
  mode: 'cors',
  cache: 'default',
};

// @todo language support
// @todo pagination
// @todo item by slug

class CockpitSDK {
  static events = {
    SAVE: 'save',
    PREVIEW: 'preview',
  };

  constructor({ host, accessToken, lang, websocket }) {
    this.host = host;
    this.lang = lang;
    this.accessToken = accessToken;
    this.websocket = websocket;
    this.queryParams = {
      lang: this.lang,
      token: this.accessToken,
    };

    if (websocket) {
      this.websocket = new CockpitRealTime({ host: websocket });
    }
  }

  fetchData(apiPath, options, queryParams) {
    const requestInit = {
      ...options,
      ...defaultOptions,
    };

    const hostWithToken = `${this.host}${apiPath}?${qs.stringify(
      this.queryParams,
    )}&${qs.stringify(queryParams)}`;

    return fetch(hostWithToken, requestInit).then(x => x.json());
  }

  // @param {string} apiPath
  fetchDataText(apiPath, options, queryParams) {
    const requestInit = {
      ...options,
      ...defaultOptions,
    };

    const hostWithToken = `${this.host}${apiPath}?${qs.stringify(
      this.queryParams,
    )}&${qs.stringify(queryParams)}`;

    return fetch(hostWithToken, requestInit).then(x => x.text());
  }

  // @param {string} collectionName
  collectionSchema(collectionName) {
    return this.fetchData(`/api/collections/collection/${collectionName}`, {
      method: 'GET',
    });
  }

  collectionList() {
    return this.fetchData(`/api/collections/listCollections`, {
      method: 'GET',
    });
  }

  // @param {string} collectionName
  // @param {Request} options
  collectionGet(collectionName, options) {
    return this.fetchData(`/api/collections/get/${collectionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });
  }

  // @param {string} collectionName
  // @param {Request} options
  collection(collectionName, options) {
    const api = {
      save: (success, error) => {
        console.warn('collection.().save() not implemented yet');
        error('collection.().save() not implemented yet');

        return api;
      },

      remove: (success, error) => {
        console.warn('collection.().remove() not implemented yet');
        error('collection.().remove() not implemented yet');

        return api;
      },

      get: (success, error) => {
        this.collectionGet(collectionName, options)
          .then(success)
          .catch(error);

        return api;
      },

      schema: (success, error) => {
        this.collectionSchema(collectionName, options)
          .then(success)
          .catch(error);

        return api;
      },

      // @param {function} success
      // @param {function} error
      watch: (success, error) => {
        const getCollection = () =>
          this.collectionGet(collectionName, options)
            .then(success)
            .catch(error);

        this.websocket.on(
          CockpitRealTime.events.COLLECTIONS_SAVE_AFTER,
          getCollection,
          error,
        );

        this.websocket.on(
          `${CockpitRealTime.events.COLLECTIONS_SAVE_AFTER}.${collectionName}`,
          getCollection,
          error,
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
          preview: CockpitRealTime.events.COLLECTIONS_PREVIEW,
        };

        this.websocket.on(cockpitEvent[event], success, error);

        return api;
      },
    };

    return api;
  }

  // @param {string} regionName
  regionGet(regionName) {
    return this.fetchDataText(`/api/regions/get/${regionName}`, {
      method: 'GET',
    });
  }

  regionList() {
    return this.fetchDataText(`/api/regions/listRegions`, {
      method: 'GET',
    });
  }

  // @param {string} regionName
  regionData(regionName) {
    return this.fetchData(`/api/regions/data/${regionName}`, { method: 'GET' });
  }

  // @param {string} collectionName
  region(regionName) {
    const api = {
      data: (success, error) => {
        this.regionData(regionName)
          .then(success)
          .catch(error);

        return api;
      },

      get: (success, error) => {
        this.regionGet(regionName)
          .then(success)
          .catch(error);

        return api;
      },
    };

    return api;
  }

  assets(options) {
    return this.fetchData(
      '/api/cockpit/assets',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      options,
    );
  }

  image(assetId, { width, height, quality }) {
    return this.fetchDataText(
      '/api/cockpit/image',
      { method: 'GET' },
      {
        src: assetId,
        w: width,
        h: height,
        q: quality,
        d: 1,
      },
    );
  }

  authUser(user, password) {
    return this.fetchData('/api/cockpit/authUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, password }),
    });
  }

  listUsers(options) {
    return this.fetchData(
      '/api/cockpit/listUsers',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      options,
    );
  }
}

module.exports = CockpitSDK;
