#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/.tools/node-v22.14.0-darwin-arm64/bin:$PATH"

echo "Stopping old Vite servers on 5173-5180..."
lsof -tiTCP:5173-5180 -sTCP:LISTEN 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

cd "$ROOT/frontend"
rm -rf node_modules/.vite

echo "Starting TaskFlow on http://127.0.0.1:5173 ..."
exec npm run dev -- --host 127.0.0.1 --port 5173 --force
