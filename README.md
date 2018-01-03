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

## Class methods

| Method               | Args                           | Promise |
| -------------------- | ------------------------------ | ------- |
| **collectionSchema** | `(collectionName)`             | Yes     |
| **collectionGet**    | `(collectionName, options)`    | Yes     |
| **collection**       | `(collectionName, options)`    | -       |
| collection.**get**   | `(success, error)`             | -       |
| collection.**watch** | `(success, error)`             | -       |
| collection.**on**    | `(eventName, success, error)`  | -       |
| **region**           | `(regionName)`                 | -       |
| region.**get**       | `(success, error)`             | -       |
| region.**data**      | `(success, error)`             | -       |
| **regionGet**        | `(regionName)`                 | Yes     |
| **regionData**       | `(regionName)`                 | Yes     |
| **image**            | `(assetId, { width, height })` | Yes     |
| **assets**           | `(options)`                    | Yes     |
| **authUser**         | `(user, password)`             | Yes     |
| **listUsers**        | `(options)`                    | Yes     |

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
