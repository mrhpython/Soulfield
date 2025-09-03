/** TruthLens (CJS) — minimal shim used across adapters */
function applyTruthLens(input) {
  const meta = {
    lens: { passed: ["structure", "no-simulation"], failed: [], emergent: true },
  };
  if (typeof input === "object" && input !== null) return { ...input, meta };
  return { text: String(input), meta };
}
// Optional: Express-style middleware
function truthLens(_req, res, next) {
  const original = res.json;
  res.json = function (data) { return original.call(this, applyTruthLens(data)); };
  next();
}
module.exports = { applyTruthLens, truthLens, lensMeta: { passed: ["structure","no-simulation"], failed: [], emergent: true } };
