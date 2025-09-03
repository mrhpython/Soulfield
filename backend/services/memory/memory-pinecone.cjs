// memory-pinecone.cjs

const { Pinecone } = require("@pinecone-database/pinecone");
const fetch = require("node-fetch");

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const INDEX_NAME = process.env.PINECONE_INDEX || "soulfield";
const DIM = 1536;

async function ensureIndex() {
  const existing = await pc.listIndexes();
  if (!existing.indexes.find(i => i.name === INDEX_NAME)) {
    await pc.createIndex({
      name: INDEX_NAME,
      dimension: DIM,
      metric: "cosine",
      spec: { pod: { environment: "gcp-starter" } }
    });
  }
  return pc.index(INDEX_NAME);
}

async function embed(text) {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text
    })
  });
  const js = await res.json();
  if (!js.data) throw new Error("Embedding failed: " + JSON.stringify(js));
  return js.data[0].embedding;
}

async function upsertDocs(docs) {
  const index = await ensureIndex();
  const vectors = [];
  for (const doc of docs) {
    const emb = await embed(doc.text);
    vectors.push({
      id: doc.id,
      values: emb,
      metadata: doc.meta || {}
    });
  }
  await index.upsert(vectors);
  return { ok: true, upserted: docs.length };
}

async function query({ text, topK = 5 }) {
  const index = await ensureIndex();
  const emb = await embed(text);
  const res = await index.query({
    vector: emb,
    topK,
    includeMetadata: true
  });
  return { ok: true, matches: res.matches || [] };
}

// 🔹 Updated deleteDoc — removes base id + chunk ids
async function deleteDoc(id) {
  const index = await ensureIndex();
  const base = String(id);

  // Try deleting the plain id
  try { await index.deleteOne(base); } catch (_) {}

  // Also try a sweep of chunk-style ids (base:0..31)
  const MAX_CHUNKS = 32;
  const ids = Array.from({ length: MAX_CHUNKS }, (_, i) => `${base}:${i}`);
  try {
    await index.deleteMany(ids);
    return { ok: true, deleted: base, mode: "id+chunks", chunksTried: MAX_CHUNKS };
  } catch (e) {
    return { ok: false, deleted: base, error: String(e && e.message || e) };
  }
}

module.exports = {
  ensureIndex,
  embed,
  upsertDocs,
  query,
  deleteDoc,
};

