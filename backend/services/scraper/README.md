# Scraper (Bright Data) — Policy First
- Only scrape domains present in `config/allowlist.yaml`.
- UK-by-default; add non-UK domains explicitly when compliant.
- Outputs JSONL to `workspace/data/scrapes/`.
