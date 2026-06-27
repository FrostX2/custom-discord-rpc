#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

if ! command -v node &>/dev/null; then
  echo "Node.js not found."
  if command -v apt &>/dev/null; then
    echo "  Install: sudo apt install nodejs npm"
  elif command -v dnf &>/dev/null; then
    echo "  Install: sudo dnf install nodejs npm"
  elif command -v pacman &>/dev/null; then
    echo "  Install: sudo pacman -S nodejs npm"
  elif command -v zypper &>/dev/null; then
    echo "  Install: sudo zypper install nodejs npm"
  elif command -v apk &>/dev/null; then
    echo "  Install: sudo apk add nodejs npm"
  else
    echo "  Download from https://nodejs.org"
  fi
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting Frozen RPC..."
exec npx electron .
