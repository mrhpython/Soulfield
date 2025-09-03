// backend/adapters/jina/index.cjs
// Jina Rerank adapter (works on Node 20+ with built-in fetch).
// Falls back to node-fetch only if global fetch is not available.

const ensureFetch = async () => {
  if (typeof fetch !== "undefined") return fetch; // Node 18+/20+ native
  const mod = await import("node-fetch");        // fallback for older nodes
  return mod.default;
};

const JINA_API_KEY = process.env.JINA_API_KEY || "";
const JINA_MODEL   = process.env.JINA_MODEL   || "jina-reranker-v1-base-en"; // use any valid model id
const BASE_URL     = "https://api.jina.ai/v1/rerank";

/** Rerank a list of plain-text docs against a query */
async function rerank({ query, documents, topK = 3 }) {
  if (!JINA_API_KEY) throw new Error("JINA_API_KEY not set");
  if (!query) throw new Error("query missing");
  if (!Array.isArray(documents) || documents.length === 0) {
    throw new Error("documents array required");
  }

  const f = await ensureFetch();

  const body = {
    model: JINA_MODEL,
    query,
    documents,     // <- important: Jina expects this field
    top_n: topK
  };

  const resp = await f(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${JINA_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`[jina] ${resp.status} ${resp.statusText} ${err}`);
  }

  const data = await resp.json();
  // Normalize to { index, text, score }
  return (data.results || []).map(r => ({
    index: r.index,
    text : r.document,
    score: r.relevance_score
  }));
}

/** Optional: passthrough (not used by handler) */
async function search() {
  return { results: [] };
}

module.exports = { rerank, search };

