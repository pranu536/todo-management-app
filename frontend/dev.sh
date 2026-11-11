#!/usr/bin/env bash
# Use the project-local Node when system npm is not installed.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/.tools/node-v22.14.0-darwin-arm64/bin:$PATH"

if ! command -v npm >/dev/null 2>&1; then
  echo "Node/npm not found. Expected at: $ROOT/.tools/node-v22.14.0-darwin-arm64/bin"
  exit 1
fi

cd "$ROOT/frontend" || exit 1
exec npm run dev -- --host 127.0.0.1 --port 5173 "$@"
