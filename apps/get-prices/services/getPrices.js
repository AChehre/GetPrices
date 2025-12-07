const { services } = require("./services");

async function getPrices(assets = []) {
  const filteredServices = Object.entries(services).filter(([key, service]) => {
    // If no assets provided → include all services
    if (!assets || assets.length === 0) return true;

    // Otherwise include only services matching at least one asset
    return service.assets?.some((a) =>
      assets.map((x) => x.toLowerCase()).includes(a.symbol.toLowerCase())
    );
  });


  const results = await Promise.all(
    filteredServices.map(async ([key, service]) => {
      const fn = service.service;
      const result = await fn(assets);

      return [
        service.provider.name,
        {
          result,
          provider: service.provider,
          assets: service.assets,
        },
      ];
    })
  );

  return results;
}

async function getAveragePrices(assets = []) {
  const results = await getPrices(assets);

  const pricesByAsset = {};

  for (const [, data] of results) {
    if (!data.result.success) continue;

    for (const item of data.result.data) {
      const assetKey = item.type.symbol; // FIXED → use symbol as key

      if (!pricesByAsset[assetKey]) {
        pricesByAsset[assetKey] = [];
      }

      pricesByAsset[assetKey].push(item.price);
    }
  }

  const averages = {};

  for (const [asset, prices] of Object.entries(pricesByAsset)) {
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    averages[asset] = avg;
  }

  return averages;
}

module.exports = { getPrices, getAveragePrices };
