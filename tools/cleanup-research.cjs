/* Soulfield Research Cleanup Wizard */
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(__dirname,"..");
const RROOT=path.join(ROOT,"workspace","research");
const id=process.argv[2];
if(!id){ console.error("usage: node tools/cleanup-research.cjs <research-id-folder>"); process.exit(2); }
const DIR=path.isAbsolute(id)?id:path.join(RROOT,id);

// --- step 1: trim JSON block in research.md ---
const RPATH=path.join(DIR,"research.md");
if(fs.existsSync(RPATH)){
  let text=fs.readFileSync(RPATH,"utf8");
  // remove code block or raw JSON array
  text=text.replace(/```json[\s\S]*?```/gm,"");
  text=text.replace(/\[[\s\n]*\{[\s\S]*\}[\s\n]*\]/m,"");
  if(!/## Keywords/.test(text)){
    text+="\n\n## Keywords\nSee [keywords.json](./keywords.json) for structured keyword data.\n";
  }
  fs.writeFileSync(RPATH,text.trim()+"\n");
  console.log("✓ cleaned research.md");
}

// --- step 2: normalize keywords.json with priority + cluster ---
const KPATH=path.join(DIR,"keywords.json");
if(fs.existsSync(KPATH)){
  let raw=JSON.parse(fs.readFileSync(KPATH,"utf8"));
  let items=raw.items || raw.keywords || [];
  items=items.map(o=>{
    const kw=(o.keyword||"").toLowerCase();
    const vol=Number(o.volume_est||0);
    const priority=vol>=800?10: vol>=400?8: vol>=150?6: vol>=60?4:2;
    const cluster=/eco|waterless/.test(kw)?"eco":
                  /price|cost/.test(kw)?"pricing":
                  /fleet|corporate/.test(kw)?"fleet":
                  /detail/.test(kw)?"detailing":"core";
    return { ...o, cluster, priority };
  });
  const out={ schema:{
    keyword:"string", intent:"info|nav|comm|trans",
    difficulty:1, volume_est:1, cpc_est:0,
    cluster:"string", priority:1
  }, items };
  fs.writeFileSync(KPATH,JSON.stringify(out,null,2));
  console.log("✓ normalized keywords.json");
}

// --- step 3: add related cross-links ---
["research.md","competitors.md","plan.md"].forEach(fn=>{
  const p=path.join(DIR,fn);
  if(fs.existsSync(p)){
    let text=fs.readFileSync(p,"utf8");
    if(!/related:/i.test(text)){
      text+="\n\n---\nrelated:\n  - research.md\n  - keywords.json\n  - competitors.md\n  - plan.md\n";
      fs.writeFileSync(p,text.trim()+"\n");
      console.log("✓ linked",fn);
    }
  }
});

console.log("Cleanup complete:",DIR);
