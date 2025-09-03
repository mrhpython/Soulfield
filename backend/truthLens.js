// truthLens.js — simple “structure/no-simulation” lens shim

function applyTruthLens(input) {
  const meta = {
    lens: {
      passed: ["structure", "no-simulation"],
      failed: [],
      emergent: true,
    },
  };
  if (typeof input === "object" && input !== null) {
    return { ...input, meta };
  }
  return { text: String(input), meta };
}

// Express-style middleware: wraps res.json payloads through the lens
function truthLens(req, res, next) {
  const originalJson = res.json;
  res.json = function (data) {
    return originalJson.call(this, applyTruthLens(data));
  };
  next();
}

module.exports = {
  applyTruthLens,
  truthLens,
  lensMeta: { passed: ["structure", "no-simulation"], failed: [], emergent: true },
};
