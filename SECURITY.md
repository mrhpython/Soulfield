Security Policy

Supported Versions
- Active development on `main`. Releases are tagged `vX.Y.Z`.

Reporting a Vulnerability
- Please report security issues privately via GitHub Security Advisories:
  - Go to the repository’s “Security” tab → “Advisories” → “Report a vulnerability”.
- If that’s unavailable, email the maintainer or open a minimal issue requesting a private channel.

Do not disclose publicly until a fix is available and coordinated.

Handling & Disclosure
- We will acknowledge reports within 72 hours.
- We aim to provide a fix or mitigation and publish a patch release.
- After a fix is released, we’ll coordinate a responsible disclosure timeline.

Secrets & Hardening
- `.env` and `.env.*` are ignored by git; do not commit secrets.
- The MCP server is read‑only and blocks `.env*`, `.git`, `.ssh`, and `receipts/` paths.
- Avoid logging sensitive values; use environment variables for API keys.

