const express = require("express");

const { services } = require("./services/services");
const { getPrices, getAveragePrices } = require("./services/getPrices");

const { routes } = require("../shared/router/routes");
const { parseAssets } = require("../shared/router/utils");

const handlers = {
  getPrices,
  getAveragePrices,
};

const app = express();
const PORT = 3000;

Object.keys(routes).forEach((path) => {
  const route = routes[path];
  const handler = handlers[route.handlerName];

  app.get(path, async (req, res) => {
    try {
      const assets = route.needsAssets ? parseAssets(req.query.assets) : [];

      const result = await handler(assets);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });
});

Object.entries(services).forEach(([key, service]) => {
  const fn = service.service;
  const serviceName = service.provider.name;
  app.get(`/${serviceName}`, async (req, res) => {
    const result = await fn();
    if (result.success) {
      res.json({
        result: result.data,
        provider: service.provider,
        assets: service.assets,
      });
    } else {
      console.error(result.error);
      res.status(500).json({ error: "Failed to fetch prices" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
