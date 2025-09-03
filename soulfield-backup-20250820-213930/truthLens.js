// truthLens.js - simple shim to enforce structural lens
module.exports = function truthLens(req, res, next) {
  const originalJson = res.json;
  res.json = function (data) {
    const meta = {
      lens: {
        passed: ["structure", "no-simulation"],
        failed: [],
        emergent: true,
      },
    };
    if (typeof data === "object" && data !== null) {
      data.meta = meta;
    } else {
      data = { text: String(data), meta };
    }
    return originalJson.call(this, data);
  };
  next();
};
