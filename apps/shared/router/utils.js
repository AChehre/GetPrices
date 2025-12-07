function parseAssets(param) {
  if (!param) return [];
  return param.split(",");
}

module.exports = { parseAssets };
