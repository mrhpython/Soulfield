#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "CoderOS placeholder starting…"
echo "Reading MCP plan from data/agents.json"
jq '.agents[] | select(.id=="coder") | {name, mcp: .mcp.servers}' data/agents.json

echo "ℹ️ This is a scaffold only. Next step wires MCP servers:"
echo "   - Filesystem, Fetch, Git, Memory, Sequential Thinking, Time"
echo "   - Scoped to ~/soulfield (read/write guard on)"
echo "When ready, we’ll install via npm/npx and spawn them here."
