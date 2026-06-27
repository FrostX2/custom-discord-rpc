#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

if ! command -v node &>/dev/null; then
  echo "Node.js is required. Install it from https://nodejs.org"
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting Frozen RPC..."
exec npx electron .
