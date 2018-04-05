import qs from 'query-string';
import fetch from 'isomorphic-fetch';
import { stringifyObject } from './utils/queryString';

class CockpitSDK {
  static events = {
    SAVE: 'save',
    PREVIEW: 'preview',
  };

  defaultEndpoints = {
    cockpitAssets: '/api/cockpit/assets',
    cockpitAuthUser: '/api/cockpit/authUser',
    cockpitImage: '/api/cockpit/image',
    cockpitListUsers: '/api/cockpit/listUsers',
    collectionsCollection: '/api/collections/collection/',
    collectionsGet: '/api/collections/get/',
    collectionsListCollections: '/api/collections/listCollections',
    collectionsRemove: '/api/collections/remove/',
    collectionsSave: '/api/collections/save/',
    regionsData: '/api/regions/data/',
    regionsGet: '/api/regions/get/',
    regionsListRegions: '/api/regions/listRegions',
    singletonsGet: '/api/singletons/get/',
    singletonsListSingletons: '/api/singletons/listSingletons',
  };

  endpoints = {};

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
    apiEndpoints = {},
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
    this.endpoints = { ...this.defaultEndpoints, ...apiEndpoints };
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
    return this.fetchData(
      `${this.endpoints.collectionsCollection}${collectionName}`,
      {
        method: 'GET',
      },
    );
  }

  collectionList() {
    return this.fetchData(this.endpoints.collectionsListCollections, {
      method: 'GET',
    });
  }

  // @param {string} collectionName
  // @param {Request} options
  collectionGet(collectionName, options) {
    return this.fetchData(`${this.endpoints.collectionsGet}${collectionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: this.stringifyOptions(options),
    });
  }

  // @param {string} collectionName
  // @param {Request} data
  collectionSave(collectionName, data) {
    return this.fetchData(
      `${this.endpoints.collectionsSave}${collectionName}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: this.stringifyOptions({ data }),
      },
    );
  }

  // @param {string} collectionName
  // @param {Request} filter
  collectionRemove(collectionName, filter) {
    return this.fetchData(
      `${this.endpoints.collectionsRemove}${collectionName}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        filter: this.stringifyOptions(filter),
      },
    );
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
          this.CockpitRealTime.events.COLLECTIONS_SAVE_AFTER,
          getCollection,
          error,
        );

        this.webSocket.on(
          `${
            this.CockpitRealTime.events.COLLECTIONS_SAVE_AFTER
          }.${collectionName}`,
          getCollection,
          error,
        );
      },

      // @param {string} event
      // @param {function} success
      // @param {function} error
      on: (event, success, error) => {
        const cockpitEvent = {
          save: this.CockpitRealTime.events.COLLECTIONS_SAVE_AFTER,
          preview: this.CockpitRealTime.events.COLLECTIONS_PREVIEW,
        };

        if (!this.webSocket) return;

        this.webSocket.on(cockpitEvent[event], success, error);
      },
    };
  }

  // @param {string} regionName
  // @param {Request} options
  regionGet(regionName, options) {
    return this.fetchDataText(`${this.endpoints.regionsGet}${regionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: this.stringifyOptions(options),
    });
  }

  singletonList() {
    return this.fetchData(this.endpoints.singletonsListSingletons, {
      method: 'GET',
    });
  }

  // @param {string} singletonName
  // @param {Request} options
  singletonGet(singletonName, options) {
    return this.fetchData(`${this.endpoints.singletonsGet}${singletonName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: this.stringifyOptions(options),
    });
  }

  regionList() {
    return this.fetchData(this.endpoints.RegionsListRegions, {
      method: 'GET',
    });
  }

  // @param {string} regionName
  regionData(regionName) {
    return this.fetchData(`${this.endpoints.regionsData}${regionName}`, {
      method: 'GET',
    });
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
      this.endpoints.cockpitAssets,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      options,
    );
  }

  imageGet(assetId, { width, height, quality }) {
    return this.fetchDataText(
      this.endpoints.cockpitImage,
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

    const { width, height, quality, pixelRatio = 1, filters, ...rest } = opts;
    const f = stringifyObject(filters);

    return `${this.host}${this.endpoints.cockpitImage}?${qs.stringify({
      ...this.queryParams,
      w: width ? Number(width) * pixelRatio : undefined,
      h: height ? Number(height) * pixelRatio : undefined,
      src: assetId,
      q: quality,
      d: 1,
      o: 1,
      ...rest,
    })}${f || ''}`;
  }

  imageSrcSet(assetId, widths = []) {
    if (!widths) return '';

    return widths
      .map(width => {
        if (typeof width === 'object') {
          const { srcSet, ...opts } = width;

          return `${this.image(assetId, opts)} ${
            srcSet || opts.width ? `${srcSet || `${opts.width}w`}` : ''
          }`;
        }

        return `${this.image(assetId, { width })} ${width}w`;
      })
      .join(', ');
  }

  authUser(user, password) {
    return this.fetchData(this.endpoints.cockpitAuthUser, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: this.stringifyOptions({ user, password }),
    });
  }

  listUsers(options) {
    return this.fetchData(
      this.endpoints.cockpitListUsers,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      options,
    );
  }

  setWebsocket(host) {
    // eslint-disable-next-line global-require
    this.CockpitRealTime = require('./CockpitRealTime');

    this.webSocket = this.CockpitRealTime({ host });
  }
}

export default CockpitSDK;
