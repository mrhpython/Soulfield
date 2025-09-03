// backend/agents/manager.cjs
// Minimal router that picks the right backend based on the brief.
// Uses the moved modules: ../adapters/{jina,infranodus} and ../services/scraper

const jina       = 
    require("../adapters/jina/index.cjs");        // exports: search({query, topK?})
const infranodus = 
    require("../adapters/infranodus/index.cjs");  // exports: run({ topic, texts })
const scraper    = 
    require("../services/scraper/index.cjs");     // exports: run({ url })

function pickRoute(brief = '') {
  const b = String(brief).toLowerCase();

  if (b.includes('scrape')) return 'scraper';
  if (b.includes('semantic')) return 'jina';
  if (b.includes('gap') || b.includes('infranodus')) return 'infranodus';

  // default: semantic search
  return 'jina';
}

async function autoRoute({ brief = '', ...payload }) {
  const route = pickRoute(brief);

  if (route === 'scraper') {
    const url = (brief.match(/https?:\/\/\S+/)?.[0]) || payload.url;
    if (!url) {
      return { ok: false, error: 'No URL provided for scraper' };
    }
    return scraper.run({ url, ...payload });
  }

  if (route === 'jina') {
    // Try to pull a query out of the brief; otherwise fall back to payload.query
    let query = payload.query;
    if (!query) {
      // crude extract for briefs like: "semantic search over workspace about <topic>"
      const m = brief.match(/about\s+(.+)$/i);
      query = m ? m[1].trim() : brief;
    }
    return jina.search({ query, topK: payload.topK ?? 5 });
  }

  if (route === 'infranodus') {
    // Expect either {topic, texts[]} in payload, or try to coerce from the brief
    const topic = payload.topic || brief.replace(/.*?(infranodus|gap)/i, '').trim() || 'topic';
    const texts = Array.isArray(payload.texts) ? payload.texts : (payload.text ? [payload.text] : []);
    return infranodus.run({ topic, texts });
  }

  return { ok: false, error: `Unknown route: ${route}` };
}

module.exports = { autoRoute };
