import qs from 'query-string';
import fetch from 'isomorphic-fetch';
import CockpitRealTime from './CockpitRealTime';

class CockpitSDK {
  static events = {
    SAVE: 'save',
    PREVIEW: 'preview',
  };

  defaultOptions = {};
  fetchInitOptions = {
    mode: 'cors',
    cache: 'default',
  };

  getImageOptions = options =>
    typeof options === 'number' ? { width: options } : options;

  constructor({
    accessToken,
    defaultOptions,
    fetchInitOptions,
    host,
    lang,
    webSocket,
    ...rest
  }) {
    const invalidConfig = Object.keys(rest);

    if (invalidConfig.length)
      console.error(
        'Invalid keys:',
        invalidConfig,
        '\n',
        'Valid keys are:',
        'accessToken, defaultOptions, fetchInitOptions, host, lang, webSocket',
      );

    this.host = host;
    this.lang = lang;
    this.fetchInitOptions = { ...this.fetchInitOptions, ...fetchInitOptions };
    this.defaultOptions = { ...this.defaultOptions, ...defaultOptions };
    this.accessToken = accessToken;
    this.webSocket = webSocket;
    this.queryParams = {
      lang: this.lang,
      token: this.accessToken,
    };

    if (webSocket) {
      this.setWebsocket(webSocket);
    }
  }

  fetchData(apiPath, options, queryParams) {
    const requestInit = {
      ...options,
      ...this.fetchInitOptions,
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
      ...this.fetchInitOptions,
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
      body: this.stringifyOptions(options),
    });
  }

  // @param {string} collectionName
  // @param {Request} data
  collectionSave(collectionName, data) {
    return this.fetchData(`/api/collections/save/${collectionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: this.stringifyOptions({ data }),
    });
  }

  // @param {string} collectionName
  // @param {Request} filter
  collectionRemove(collectionName, filter) {
    return this.fetchData(`/api/collections/remove/${collectionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      filter: this.stringifyOptions(filter),
    });
  }

  stringifyOptions(options) {
    return JSON.stringify({ ...this.defaultOptions, ...options });
  }

  // @param {string} collectionName
  // @param {Request} options
  collection(collectionName, options) {
    return {
      get: (success, error) => {
        this.collectionGet(collectionName, options)
          .then(success)
          .catch(error);
      },

      promise: new Promise((success, error) => {
        this.collectionGet(collectionName, options)
          .then(success)
          .catch(error);
      }),

      schema: (success, error) => {
        this.collectionSchema(collectionName, options)
          .then(success)
          .catch(error);
      },

      // @param {function} success
      // @param {function} error
      watch: (success, error) => {
        const getCollection = () =>
          this.collectionGet(collectionName, options)
            .then(success)
            .catch(error);

        getCollection();

        if (!this.webSocket) return;

        this.webSocket.on(
          CockpitRealTime.events.COLLECTIONS_SAVE_AFTER,
          getCollection,
          error,
        );

        this.webSocket.on(
          `${CockpitRealTime.events.COLLECTIONS_SAVE_AFTER}.${collectionName}`,
          getCollection,
          error,
        );
      },

      // @param {string} event
      // @param {function} success
      // @param {function} error
      on: (event, success, error) => {
        const cockpitEvent = {
          save: CockpitRealTime.events.COLLECTIONS_SAVE_AFTER,
          preview: CockpitRealTime.events.COLLECTIONS_PREVIEW,
        };

        if (!this.webSocket) return;

        this.webSocket.on(cockpitEvent[event], success, error);
      },
    };
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
    return {
      data: (success, error) => {
        this.regionData(regionName)
          .then(success)
          .catch(error);
      },

      get: (success, error) => {
        this.regionGet(regionName)
          .then(success)
          .catch(error);
      },
    };
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

  imageGet(assetId, { width, height, quality }) {
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

  image(assetId, options) {
    if (!options || options === {} || options === [])
      return `${this.host}/${assetId}`;

    if (Array.isArray(options)) return this.imageSrcSet(assetId, options);

    const opts = this.getImageOptions(options);

    const { width, height, quality, ...rest } = opts;

    return `${this.host}/api/cockpit/image?${qs.stringify({
      ...this.queryParams,
      src: assetId,
      w: width,
      h: height,
      q: quality,
      d: 1,
      o: 1,
      ...rest,
    })}`;
  }

  imageSrcSet(assetId, widths = []) {
    if (!widths) return '';

    return widths
      .map(width => {
        if (typeof width === 'object')
          return `${this.image(assetId, { width: width.width })} ${
            width.srcSet || width.width ? `${width.width}w` : ''
          }`;

        return `${this.image(assetId, { width })} ${width}w`;
      })
      .join(', ');
  }

  authUser(user, password) {
    return this.fetchData('/api/cockpit/authUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: this.stringifyOptions({ user, password }),
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

  setWebsocket(host) {
    this.webSocket = new CockpitRealTime({ host });
  }
}

export default CockpitSDK;
