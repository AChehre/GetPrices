const axios = require("axios");
const { AssetType } = require("../assetTypes");

const items = [
  { asset: AssetType.USDT, symbol: "USDTTMN" },
  { asset: AssetType.BITCOIN, symbol: "BTCTMN" },
];

async function getWallexPrices() {
  try {
    const prices = [];

    const res = await axios.get("https://api.wallex.ir/v1/markets");

    if (!res.data.success) {
      throw new Error("Wallex returned invalid response");
    }

    const symbols = res.data.result.symbols;

    for (const item of items) {
      const entry = symbols[item.symbol];

      if (!entry) {
        throw new Error(`Symbol ${item.symbol} not found in Wallex response`);
      }

      let price = parseFloat(entry.stats.bidPrice);

      prices.push({
        type: item.asset,
        price,
        timestamp: new Date(),
      });
    }

    return { success: true, data: prices };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

const wallexService = {
  title: "Wallex",
  service: getWallexPrices,
  assets: items.map((x) => x.asset),
};

module.exports = { wallexService };
