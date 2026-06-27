#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "╔══════════════════════════════════════════╗"
echo "║   Frozen RPC - Build All Installers     ║"
echo "╚══════════════════════════════════════════╝"
echo ""

OS="$(uname -s)"

case "$OS" in
  Linux*)
    echo "[1/3] Building Linux installers (AppImage, deb, rpm, pacman)..."
    cd "$DIR" && npx electron-builder --linux
    echo "  → dist/"

    echo ""
    echo "[2/3] Building Flatpak..."
    if command -v flatpak-builder &>/dev/null; then
      bash "$DIR/flatpak/build.sh"
    else
      echo "  → SKIP: flatpak-builder not installed"
    fi

    echo ""
    echo "[3/3] Copying launcher scripts..."
    mkdir -p "$DIR/dist/launcher"
    cp "$DIR/frozen-rpc.sh" "$DIR/dist/launcher/"
    cp "$DIR/frozen-rpc.desktop" "$DIR/dist/launcher/"
    cp -r "$DIR/other-distro" "$DIR/dist/launcher/"
    echo "  → dist/launcher/"
    ;;

  Darwin*)
    echo "[1/1] Building macOS installers (DMG + PKG)..."
    cd "$DIR" && npx electron-builder --mac
    echo "  → dist/"
    ;;

  MINGW*|MSYS*|CYGWIN*)
    echo "[1/1] Building Windows installer (NSIS)..."
    cd "$DIR" && npx electron-builder --win
    echo "  → dist/"
    ;;

  *)
    echo "Unsupported OS: $OS"
    exit 1
    ;;
esac

echo ""
echo "=== All installers built successfully ==="
echo "Output: $DIR/dist/"
