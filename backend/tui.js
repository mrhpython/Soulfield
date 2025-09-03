#!/usr/bin/env node
// Soulfield Spec Browser (Terminal UI)
// Keys: ↑/↓ move • Enter full view • e edit in $EDITOR (fallback nano) • r reload • q quit

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const blessed = require("blessed");

const SPECS_DIR = path.join(__dirname, ".agent-os", "specs");

function findSpecs() {
  if (!fs.existsSync(SPECS_DIR)) return [];
  const out = [];
  for (const dir of fs.readdirSync(SPECS_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const p = path.join(SPECS_DIR, dir.name, "spec.md");
    if (fs.existsSync(p)) out.push(p);
  }
  // newest first (ids start with timestamp)
  return out.sort((a, b) => path.basename(path.dirname(b)).localeCompare(path.basename(path.dirname(a))));
}
function idFromFile(f) { return path.basename(path.dirname(f)); }

const screen = blessed.screen({ smartCSR: true, title: "Soulfield — Specs (TUI)" });

const list = blessed.list({
  parent: screen, label: " Specs ", width: "30%", height: "100%",
  keys: true, mouse: true, border: { type: "line" },
  style: { selected: { bg: "blue" } }
});

const preview = blessed.box({
  parent: screen, label: " Preview ", left: "30%", width: "70%", height: "100%",
  border: { type: "line" }, scrollable: true, alwaysScroll: true, keys: true, vi: true, mouse: true
});

const modal = blessed.box({
  parent: screen, hidden: true, top: "center", left: "center", width: "90%", height: "90%",
  border: { type: "line" }, label: " Spec ",
  scrollable: true, alwaysScroll: true, keys: true, vi: true, mouse: true, style: { border: { fg: "cyan" } }
});

let files = [];

function reload() {
  files = findSpecs();
  list.setItems(files.length ? files.map(idFromFile) : ["(no specs yet — create one with !coder-open)"]);
  list.select(0);
  updatePreview(0);
  screen.render();
}
function updatePreview(idx) {
  if (!files.length) { preview.setContent("No specs found.\n\nUse: !coder-open \"Task\" #code #plan-aligned"); return; }
  const file = files[idx];
  const text = fs.readFileSync(file, "utf8");
  preview.setContent(text.split("\n").slice(0, 50).join("\n"));
}
function openFull(idx) {
  if (!files.length) return;
  const file = files[idx];
  const text = fs.readFileSync(file, "utf8");
  modal.setLabel(" " + idFromFile(file) + " ");
  modal.setContent(text);
  modal.show(); modal.focus(); screen.render();
}
// NEW: edit support
function editFile(idx) {
  if (!files.length) return;
  const file = files[idx];
  const editor = process.env.EDITOR || "nano"; // fallback
  // temporarily leave curses mode so the editor takes over the terminal
  screen.leave();
  try {
    spawnSync(editor, [file], { stdio: "inherit" });
  } finally {
    screen.enter();
    reload(); // pick up changes
  }
}

// events
list.on("select", (_item, idx) => updatePreview(idx));
list.key(["enter"], () => openFull(list.selected));
list.key(["e"], () => editFile(list.selected));
modal.key(["e"], () => { modal.hide(); list.focus(); editFile(list.selected); });
modal.key(["q", "escape"], () => { modal.hide(); list.focus(); screen.render(); });

screen.key(["r"], () => reload());
screen.key(["q", "C-c"], () => process.exit(0));

// boot
reload();
list.focus();
screen.render();
