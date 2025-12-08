const basePath = "/api/v1/prices";

const rawRoutes = {
  "/": {
    name: "getPrices",
    handlerName: "getPrices",
    needsAssets: true,
  },
  "/average": {
    name: "getAverage",
    handlerName: "getAveragePrices",
    needsAssets: true,
  },
};

const routes = Object.fromEntries(
  Object.entries(rawRoutes).flatMap(([path, config]) => {
    const withSlash = basePath + path; // "/api/v1/prices/"
    const noSlash = withSlash.replace(/\/$/, ""); // "/api/v1/prices"
    return [
      [withSlash, config],
      [noSlash, config],
    ];
  })
);

module.exports = { routes };
