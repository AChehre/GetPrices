const express = require("express");

const { services } = require("./services/services");
const { getPrices, getAveragePrices } = require("./services/getPrices");

const app = express();
const PORT = 3000;

app.get("/", async (req, res) => {
  try {
    const assets = getAssets(req);
    const prices = await getPrices(assets);
    res.json(prices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch all prices" });
  }
});

app.get("/average", async (req, res) => {
  try {
    const assets = getAssets(req);
    const prices = await getAveragePrices(assets);
    console.log(JSON.stringify(prices));
    res.json(prices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch average prices" });
  }
});

function getAssets(req){
  return req.query.assets ? req.query.assets.split(",") : []; // default empty array
}

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
