# Cockpit Javascript SDK

#### A Javascript SDK for [Cockpit Headless CMS](https://github.com/agentejo/cockpit)

## Usage

```sh
npm install cockpit-sdk
# Or
yarn add cockpit-sdk
```

## Simple Example

```js
const Cockpit = new CockpitSDK({
  host: "http://localhost:8080", // e.g. local docker Cockpit.
  accessToken: "12a3456b789c12d34567ef8a9bc01d"
});

Cockpit.collectionEntries("posts", { limit: 3 }).then(data =>
  console.log(data)
);
// { "fields": {...}, "entries": [{...},{...},{...}], "total": 3 }
```

## Class methods

All the following methods returns a promise:

| Method                     | Args                           |
| -------------------------- | ------------------------------ |
| **collectionSchema**       | `(collectionName)`             |
| **collectionEntries**      | `(collectionName, options)`    |
| **regionRenderedTemplate** | `(regionName)`                 |
| **regionFormData**         | `(regionName)`                 |
| **image**                  | `(assetId, { width, height })` |
| **assets**                 | –                              |

# Real-time

## Simple Example

The `collection` method fetches the data on call and on every collection update.

The real-time methods expects callback functions instead of a promise.

```js
Cockpit.collection("portfolio").get(data => console.log(data));
// { "fields": {...}, "entries": [{...},{...},{...}], "total": … }
```

## Real-time Methods

| Method             | Args                          |
| ------------------ | ----------------------------- |
| **collection**     | `(collectionName, options)`   |
| collection.**get** | `(success, error)`            |
| collection.**on**  | `(eventName, success, error)` |

```js
Cockpit.collection("portfolio")
  .get(console.log) // { "entries": […], "fields": {...}, "total": … }
  .on("save", console.log) // { entry: {...}, collection: '', event: '' }
  .on("preview", console.log); // { entry: {...}, collection: '', event: '' }
```

> _Note that the `.get` method returns the **whole entries** and the `.on` method just **one entry**_

## Event names
```js
Cockpit.collection("portfolio").on(eventName)
```
| Events  |
| ------- |
| save    |
| preview |
