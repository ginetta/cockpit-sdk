# Cockpit Javascript SDK

#### A Javascript SDK for [Cockpit Headless CMS](https://github.com/agentejo/cockpit)

[![npm version](https://badge.fury.io/js/cockpit-sdk.svg?v2)](https://www.npmjs.com/package/cockpit-sdk)

## Usage

```sh
npm install cockpit-sdk
# or
yarn add cockpit-sdk
```

## Simple Example

```js
const Cockpit = new CockpitSDK({
  host: "http://localhost:8080", // e.g. local docker Cockpit.
  accessToken: "12a3456b789c12d34567ef8a9bc01d"
});

Cockpit.collectionGet("posts", { limit: 3 }).then(data => console.log(data));
// { "fields": {...}, "entries": [{...},{...},{...}], "total": 3 }

// Or with the callback api:
Cockpit.collection("posts", { limit: 3 }).get(console.log);
Cockpit.region("regionName").data(console.log);
```

## Collections

| Method               | Args                          | Return  |
| -------------------- | ----------------------------- | ------- |
| **collectionSchema** | `(collectionName)`            | Promise |
| **collectionGet**    | `(collectionName, options)`   | Promise |
| **collection**       | `(collectionName, options)`   | -       |
| collection.**get**   | `(success, error)`            | -       |
| collection.**watch** | `(success, error)`            | -       |
| collection.**on**    | `(eventName, success, error)` | -       |

* **options:**

  ```js
  {
    filter: { published: true }, // mongoDB Operators.
    populate: 1 // Resolve linked collection items.
    limit,
    skip,
    sort: { _created: -1 },
  }
  ```

## Assets

| Method          | Args                                                  | Return                     |
| --------------- | ----------------------------------------------------- | -------------------------- |
| **image**       | `(assetId OR assetPath, imageOptions OR widthsArray)` | Path String OR Paths Array |
| **imageSrcSet** | `(assetId OR assetPath, widthsArray)`                 | Paths Array                |
| **imageGet**    | `(assetId OR assetPath, imageOptions)`                | Promise                    |
| **assets**      | `(options)`                                           | Promise                    |

* **imageOptions:**
  ```js
  {
    width,
    height,
    quality: 85,
    mode: 'thumbnail' | 'bestFit' | 'resize' | 'fitToWidth' | 'fitToHeight',
    // Filters:
    blur, brighten, colorize, contrast, darken, desaturate,
    emboss, flip, invert, opacity, pixelate,
    sepia, sharpen, sketch
  }
  ```
* **widthsArray:**
  ```js
  [
    100, // Width
    {
      srcSet: "100w" | "2x" | "(max-width: 30em)",
      ...imageOptions
    }
  ];
  ```

When `image` method receives an array as second argument it will behave as `imageSrcSet`.

**Example:**

```js
Cockpit.image(path, { width: 8 });
Cockpit.image(path, [100, 480, 960]);
Cockpit.image(path, [
  100,
  { width: 480, height: 480 },
  { width: 960, srcSet: "(max-width: 30em)" }
]);
```

## User

| Method        | Args               | Return  |
| ------------- | ------------------ | ------- |
| **authUser**  | `(user, password)` | Promise |
| **listUsers** | `(options)`        | Promise |

## Regions

| Method          | Args               | Return  |
| --------------- | ------------------ | ------- |
| **region**      | `(regionName)`     | -       |
| region.**get**  | `(success, error)` | -       |
| region.**data** | `(success, error)` | -       |
| **regionGet**   | `(regionName)`     | Promise |
| **regionData**  | `(regionName)`     | Promise |

# Real-time

## Simple Example

The `collection` method fetches the data on call and on every collection update.

The real-time methods expects callback functions instead of a promise.

```js
Cockpit.collection("portfolio").watch(data => console.log(data));
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
Cockpit.collection("portfolio")
  .watch(console.log) // { "entries": […], "fields": {...}, "total": … }
  .on("save", console.log) // { entry: {...}, collection: '', event: '' }
  .on("preview", console.log); // { entry: {...}, collection: '', event: '' }
```

> _Note that the `.watch` and `.get` methods returns the **whole entries** and the `.on` method just **one entry**_

## Event names

```js
Cockpit.collection("portfolio").on(eventName);
```

| Events  |
| ------- |
| save    |
| preview |
