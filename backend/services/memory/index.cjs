// backend/services/memory/index.cjs
let impl;
if (process.env.USE_PINECONE === "1") {
  impl = require("./memory-pinecone.cjs");
} else {
  impl = require("./memory.js"); // your existing in-memory / file memory
}

module.exports = impl;
