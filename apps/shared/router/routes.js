const routes = {
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

module.exports = { routes };
