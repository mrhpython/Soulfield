const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(path.join(__dirname, ".."));              // /home/michael/soulfield
const WRITE_ROOT = path.join(ROOT);                                  // keep all inside project

function safe(p){ const full = path.resolve(path.join(ROOT, p)); if(!full.startsWith(ROOT)) throw new Error("path outside root"); return full; }

module.exports = {
  async handle(body){
    const { tool, action, args = {} } = body || {};
    if(tool !== "fs") return { error: "unsupported tool" };

    if(action === "list"){
      const dir = safe(args.dir || ".");
      const items = fs.readdirSync(dir, { withFileTypes:true }).map(d => ({ name:d.name, type:d.isDirectory()?"dir":"file" }));
      return { ok:true, dir: path.relative(ROOT, dir)||".", items };
    }

    if(action === "read"){
      const file = safe(args.path);
      const data = fs.readFileSync(file, "utf-8");
      return { ok:true, path: path.relative(ROOT, file), data };
    }

    if(action === "write"){
      const file = safe(args.path);
      const absDir = path.dirname(file);
      if(!absDir.startsWith(WRITE_ROOT)) return { error: "write outside project" };
      fs.mkdirSync(absDir, { recursive:true });
      fs.writeFileSync(file, args.data ?? "", "utf-8");
      return { ok:true, path: path.relative(ROOT, file), bytes: Buffer.byteLength(args.data ?? "") };
    }

    return { error: "unknown action" };
  }
};
