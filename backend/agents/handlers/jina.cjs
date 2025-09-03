// backend/agents/handlers/jina.cjs
// Semantic search / rerank handler driven by the Jina adapter.
// - Pulls candidate texts from memory (Pinecone-backed via services/memory)
// - Uses Jina reranker when available, otherwise adapter.search or stub
// - Returns uniform result shape

const path = require("path");

// Adapters & services (all relative to backend/)
const jina = require(path.join(__dirname, "..", "..", "adapters", "jina", "index.cjs"));
const memory = require(path.join(__dirname, "..", "..", "services", "memory", "index.cjs"));

/**
 * Shape: run({ query, topK, zone, filter })
 *  - query: string to search for
 *  - topK: how many matches to return (default 3)
 *  - zone: logical zone to pull docs from (default 'docs')
 *  - filter: extra metadata filter (optional)
 */
async function run(opts = {}) {
  const query = String(opts.query || "").trim();
  const topK = Number.isFinite(opts.topK) ? opts.topK : 3;
  const zone = opts.zone || "docs";
  const filter = opts.filter || null;

  if (!query) {
    return { ok: false, results: [], meta: { reason: "empty_query", adapter: "jina" } };
  }

  // 1) Gather candidates from memory (already Pinecone-backed)
  //    If memory has a native query, use that. Else pull some recent docs and rerank.
  let candidates = [];
  let memMeta = { mode: "fetch" };

  try {
    if (typeof memory.query === "function") {
      const mq = await memory.query({ text: query, topK: Math.max(20, topK * 4), zone, filter });
      candidates = (mq.matches || []).map(x => ({
        id: x.id || x.doc_id || x.metadata?.doc_id || "unknown",
        text: x.text || x.chunk || "",
        meta: x.metadata || {},
        score: x.score ?? null
      }));
      memMeta.mode = "query";
    } else if (typeof memory.fetchAllDocs === "function") {
      const docs = await memory.fetchAllDocs({ zone, filter, limit: 200 }); // keep sane
      candidates = (docs || []).flatMap(doc => {
        const chunks = Array.isArray(doc.chunks) ? doc.chunks : [doc.text || ""];
        return chunks.filter(Boolean).map((text, i) => ({
          id: `${doc.id || doc.doc_id || "doc"}:${i}`,
          text,
          meta: { ...(doc.meta || {}), doc_id: doc.id || doc.doc_id }
        }));
      });
    }
  } catch (e) {
    // Don’t fail the handler because memory had an issue
    memMeta.error = e?.message || String(e);
  }

  // If nothing to rank, give a stubby-but-honest response
  if (candidates.length === 0) {
    return {
      ok: true,
      results: [{ doc: "stub", score: 0 }],
      meta: { adapter: "jina", note: "no-candidates", ...memMeta }
    };
  }

  // 2) Rerank using the Jina adapter when available
  let ranked = [];
  let adapterMeta = { adapter: "jina" };

  try {
    if (typeof jina.rerank === "function") {
      ranked = await jina.rerank({
        query,
        documents: candidates.map(c => c.text),
        topK
      });
      // Normalize expected returns: [{text, score, index}]
      ranked = ranked.map(r => {
        const c = candidates[r.index] || {};
        return {
          doc: r.text || c.text || "",
          score: r.score ?? null,
          source: c.meta?.doc_id || c.id || null,
          meta: c.meta || {}
        };
      });
      adapterMeta.mode = "rerank";
    } else if (typeof jina.search === "function") {
      // Some adapters expose a generic search
      const sr = await jina.search({ query, topK });
      ranked = (sr.results || []).map(x => ({
        doc: x.doc || x.text || "",
        score: x.score ?? null,
        source: x.source || null,
        meta: x.meta || {}
      }));
      adapterMeta.mode = "search";
    } else {
      adapterMeta.mode = "stub";
    }
  } catch (e) {
    adapterMeta.error = e?.message || String(e);
  }

  // 3) Fallback: simple cosine-ish by prior score if rerank didn’t return anything
  if (!Array.isArray(ranked) || ranked.length === 0) {
    ranked = candidates
      .slice(0, Math.max(20, topK))
      .map(c => ({ doc: c.text, score: c.score ?? 0, source: c.meta?.doc_id || c.id || null, meta: c.meta || {} }))
      .slice(0, topK);
    adapterMeta.fallback = "memory-slice";
  }

  return { ok: true, results: ranked.slice(0, topK), meta: { ...memMeta, ...adapterMeta, topK, zone } };
}

module.exports = { run };

