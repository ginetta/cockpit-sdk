# Cockpit Javascript SDK

#### A Javascript SDK for [Cockpit Headless CMS](https://github.com/agentejo/cockpit)

[![npm version](https://badge.fury.io/js/cockpit-sdk.svg?v2)](https://www.npmjs.com/package/cockpit-sdk)
![size](http://img.badgesize.io/ginetta/cockpit-sdk/master/lib/all.min.js?compression=gzip&label=gzip+size)

## Usage

```sh
npm install cockpit-sdk
# or
yarn add cockpit-sdk
```

If you're using Gatsby you can include the cockpit-sdk with the following:

## Simple Example

```js
const CockpitSDK = require("cockpit-sdk").default;
// or
import CockpitSDK from "cockpit-sdk";

const cockpit = new CockpitSDK({
  host: "http://localhost:8080", // e.g. local docker Cockpit.
  accessToken: "12a3456b789c12d34567ef8a9bc01d"
});

cockpit.collectionGet("posts", { limit: 3 }).then(data => console.log(data));
// { "fields": {...}, "entries": [{...},{...},{...}], "total": 3 }

// Or with the callback api:
cockpit.collection("posts", { limit: 3 }).get(console.log);
cockpit.region("regionName").data(console.log);
```

## Connecting to your Cockpit instance

Connecting your project to Cockpit is done by instantiating CockpitSDK. This object takes multiple parameters.

| Parameter            | Description                                     |
| -------------------- | ----------------------------------------------- |
| **host**             | Your cockpit instance address                   |
| **accessToken**      | Cockpit access token                            |
| **webSocket**        | Websocket address (if used)                     |
| **fetchInitOptions** | [Init options](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters) to apply on every Fetch request                        |
| **defaultOptions**   | Options to be applied on every Cockpit fetch    |
| **authHeader**       | Use the *Authorization* header instead of a query parameter|

<details><summary><b>defaultOptions:</b></summary><p>

```js
  {
    filter: { published: true }, // mongoDB Operators.
    populate: 1 // Resolve linked collection items.
    limit,
    skip,
    apiEndpoints, // See Api endpoints section bellow
    sort: { _created: -1 },
  }
```

</p></details>

## Collections

| Method               | Args                          | Return  |
| -------------------- | ----------------------------- | ------- |
| **collectionSchema** | `(collectionName)`            | Promise |
| **collectionList**   | `()`                          | Promise |
| **collectionGet**    | `(collectionName, options)`   | Promise |
| **collectionSave**   | `(collectionName, data)`      | Promise |
| **collectionRemove** | `(collectionName, filter)`    | Promise |
| **collection**       | `(collectionName, options)`   | -       |
| collection.**get**   | `(success, error)`            | -       |
| collection.**watch** | `(success, error)`            | -       |
| collection.**on**    | `(eventName, success, error)` | -       |

<details><summary><b>options:</b></summary><p>

```js
  {
    filter: { published: true }, // mongoDB Operators.
    populate: 1 // Resolve linked collection items.
    limit,
    skip,
    sort: { _created: -1 },
  }
```

</p></details>

## Assets

| Method          | Args                                                  | Return                     |
| --------------- | ----------------------------------------------------- | -------------------------- |
| **image**       | `(assetId OR assetPath, imageOptions OR widthsArray)` | Path String OR Paths Array |
| **imageSrcSet** | `(assetId OR assetPath, widthsArray)`                 | Paths Array                |
| **imageGet**    | `(assetId OR assetPath, imageOptions)`                | Promise                    |
| **assets**      | `(options)`                                           | Promise                    |

<details><summary><b>imageOptions:</b></summary><p>

```js
{
  width,
  height,
  quality: 85,
  pixelRatio: 2, // default: 1
  mode: 'thumbnail' | 'bestFit' | 'resize' | 'fitToWidth' | 'fitToHeight',
  filters: { darken: 50, pixelate: 40, desaturate: true, flip: 'x', colorize: 'FF0' },
  /* Filters:
  blur | brighten | colorize | contrast | darken | desaturate |
  emboss | flip | invert | opacity | pixelate |
  sepia | sharpen | sketch
  */
}
```

</p></details>

<details><summary><b>widthsArray:</b></summary><p>

```js
[
  100, // Width
  {
    srcSet: "100w" | "2x" | "(max-width: 30em)",
    ...imageOptions
  }
];
```

</p></details>

When `image` method receives an array as second argument it will behave as `imageSrcSet`.

<details><summary><b>Example:</b></summary><p>

```js
cockpit.image(path); // original/path.jpg
cockpit.image(path, { width: 100 });
cockpit.image(path, [100, 480, 960]);
cockpit.image(path, [
  100,
  { width: 480, height: 480 },
  { width: 960, srcSet: "(max-width: 30em)" }
]);
// ['?src=path.jpg&w=100 100w', '?src=path.jpg&w=480&h=480 480w', '?src=path.jpg&w=960 (max-width: 30em)']
```

</p></details>

## User

| Method        | Args               | Return  |
| ------------- | ------------------ | ------- |
| **authUser**  | `(user, password)` | Promise |
| **listUsers** | `(options)`        | Promise |

## Regions

| Method          | Args                    | Return  |
| --------------- | ----------------------- | ------- |
| **region**      | `(regionName, options)` | -       |
| region.**get**  | `(success, error)`      | -       |
| region.**data** | `(success, error)`      | -       |
| **regionGet**   | `(regionName, options)` | Promise |
| **regionData**  | `(regionName, options)` | Promise |

## Forms

| Method         | Args                  | Return |
| -------------- | --------------------- | ------ |
| **formSubmit** | `(formName, options)` | -      |

<details><summary><b>Example:</b></summary><p>

```js
cockpit.formSubmit(
  'contacts',
  {
    field1: 'value1',
    field2: 'value2',
  },
  options,
);
```

</p></details>

# Real-time

## Simple Example

The `collection` method fetches the data on call and on every collection update.

The real-time methods expects callback functions instead of a promise.

```js
cockpit.collection("portfolio").watch(data => console.log(data));

// { "fields": {...}, "entries": [{...},{...},{...}], "total": … }
```

## Real-time Methods

You will need a Websocket middleware server to use the real-time features.

This SKD is working with [Cockpit-Real-time-Server](https://github.com/brunnolou/Cockpit-Real-time-Server)

| Method               | Args                          |
| -------------------- | ----------------------------- |
| **collection**       | `(collectionName, options)`   |
| collection.**get**   | `(success, error)`            |
| collection.**watch** | `(success, error)`            |
| collection.**on**    | `(eventName, success, error)` |

```js
const collection = cockpit.collection("portfolio");
collection.watch(console.log); // { "entries": […], "fields": {...}, "total": … }
collection.on("save", console.log); // { entry: {...}, collection: '', event: '' }
collection.on("preview", console.log); // { entry: {...}, collection: '', event: '' }
```

> _Note that the `.watch` and `.get` methods returns the **whole entries** and the `.on` method just **one entry**_

## Api endpoint

### Default endpoints
| Name                       | Default URL                        |
| -------------------------- | ---------------------------------- |
| cockpitAssets              | '/api/cockpit/assets'              |
| cockpitAuthUser            | '/api/cockpit/authUser'            |
| cockpitImage               | '/api/cockpit/image'               |
| cockpitListUsers           | '/api/cockpit/listUsers'           |
| collectionsCollection      | '/api/collections/collection/'     |
| collectionsGet             | '/api/collections/get/'            |
| collectionsListCollections | '/api/collections/listCollections' |
| collectionsRemove          | '/api/collections/remove/'         |
| collectionsSave            | '/api/collections/save/'           |
| regionsData                | '/api/regions/data/'               |
| regionsGet                 | '/api/regions/get/'                |
| regionsListRegions         | '/api/regions/listRegions'         |
| singletonsGet              | '/api/singletons/get/'             |
| singletonsListSingletons   | '/api/singletons/listSingletons'   |

The default `apiEndpoints` can be updated in the constructor.
```js
new CockpitSDK({
  // ...
  apiEndpoints: {
    cockpitImage: '/api/public/image',
  },
});
```


## Event names

```js
cockpit.collection("portfolio").on(eventName);
```

| Events  |
| ------- |
| save    |
| preview |
