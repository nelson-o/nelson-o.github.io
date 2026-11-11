#!/usr/bin/env bash
# System dependencies come from the pinned CI image; never run apt at job setup.
# Retain bounded retries for browser downloads if the matching cache is absent.
set -uo pipefail

for attempt in 1 2 3; do
  echo "Installing Playwright Chromium (attempt ${attempt}/3)"
  if bunx playwright install chromium; then
    exit 0
  else
    status=$?
  fi

  if (( attempt == 3 )); then
    echo "Playwright installation failed after 3 attempts (exit ${status})." >&2
    exit "$status"
  fi

  delay=$((attempt * 20))
  echo "Installation failed (exit ${status}); retrying in ${delay}s." >&2
  sleep "$delay" || exit "$?"
done
