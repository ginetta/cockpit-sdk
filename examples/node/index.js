const CockpitSDK = require("../../lib");

const Cockpit = new CockpitSDK({
  host: "http://localhost:8080", // e.g. local docker Cockpit.
  accessToken: "12a3456b789c12d34567ef8a9bc01d"
});

Cockpit.collectionEntries("Portfolioitems", { limit: 3 }).then(data =>
  console.log(data)
);
