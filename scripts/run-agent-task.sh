#!/usr/bin/env bash
set -euo pipefail

if ! [[ "${AGENT_TIMEOUT_MINUTES:-}" =~ ^[1-9][0-9]?$ ]] || (( AGENT_TIMEOUT_MINUTES > 50 )); then
  echo 'agent_timeout_minutes must be an integer from 1 to 50, leaving time for verification.' >&2
  exit 1
fi
: "${GITHUB_WORKSPACE:?}"
cd "$GITHUB_WORKSPACE"
prompt=.agent-runtime/prompt.md
final=.agent-runtime/final.md
case "${AGENT_RUNNER:-codex}" in
  codex)
    args=(exec --cd "$GITHUB_WORKSPACE" --sandbox danger-full-access --output-last-message "$final")
    if [ -n "${MODEL:-}" ]; then args+=(--model "$MODEL"); fi
    if [ -n "${EFFORT:-}" ]; then
      if ! [[ "$EFFORT" =~ ^[a-z]+$ ]]; then echo 'Invalid reasoning effort' >&2; exit 1; fi
      args+=(--config "model_reasoning_effort=\"$EFFORT\"")
    fi
    timeout "${AGENT_TIMEOUT_MINUTES}m" codex "${args[@]}" - < "$prompt"
    ;;
  claude)
    : "${ANTHROPIC_API_KEY:?ANTHROPIC_API_KEY secret is required for Claude}"
    args=(--print --output-format text --permission-mode bypassPermissions)
    if [ -n "${MODEL:-}" ]; then args+=(--model "$MODEL"); fi
    if [ -n "${EFFORT:-}" ]; then args+=(--effort "$EFFORT"); fi
    timeout "${AGENT_TIMEOUT_MINUTES}m" claude "${args[@]}" < "$prompt" > "$final"
    ;;
  *) echo 'Unsupported runner; select codex or claude.' >&2; exit 1 ;;
esac
if [ ! -s "$final" ]; then echo 'Runner did not produce a final message.' >&2; exit 1; fi
