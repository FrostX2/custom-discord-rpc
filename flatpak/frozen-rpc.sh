#!/usr/bin/env bash
set -e
export TMPDIR="$XDG_RUNTIME_DIR/app/$FLATPAK_ID"
exec zypak-wrapper /app/node_modules/electron/dist/electron /app --no-sandbox
