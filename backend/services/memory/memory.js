// Shim to reuse the root memory implementation from within services
// Exposes add/recall/load which are sufficient for current handlers
module.exports = require("../../../memory.js");

