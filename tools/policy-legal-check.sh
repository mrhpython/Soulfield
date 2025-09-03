#!/usr/bin/env bash
set -euo pipefail
miss=0

# helper
check_file() {
  if [ -f "$1" ]; then
    echo "✅ $1 exists"
  else
    echo "❌ $1 missing"
    miss=1
    return
  fi

  # run grep-based content checks depending on filename
  case "$1" in
    ./legal/privacy.md)
      grep -qi "contact" "$1" || { echo "❌ privacy.md missing contact info"; miss=1; }
      ;;
    ./legal/returns.md)
      grep -qi "14" "$1" || { echo "❌ returns.md missing 14-day return mention"; miss=1; }
      ;;
    ./legal/terms.md)
      grep -qi "consumer" "$1" || { echo "❌ terms.md missing consumer rights mention"; miss=1; }
      ;;
  esac
}

# checks
check_file ./legal/privacy.md
check_file ./legal/terms.md
check_file ./legal/returns.md
check_file ./legal/cookies.md

if [ $miss -ne 0 ]; then
  echo "⚠️ One or more legal requirements failed."
  exit 1
fi

echo "🎉 All legal compliance checks passed."
