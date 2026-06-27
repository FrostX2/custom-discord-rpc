#!/usr/bin/env bash
# Install system dependencies for Frozen RPC based on distro
set -e

echo "Detecting distro..."

if command -v apt &>/dev/null; then
  echo "Debian/Ubuntu detected."
  sudo apt update
  sudo apt install -y nodejs npm libnss3 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
    libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2

elif command -v dnf &>/dev/null; then
  echo "Fedora/RHEL detected."
  sudo dnf install -y nodejs npm nss atk at-spi2-atk cups-libs \
    libdrm libxkbcommon libXcomposite libXdamage libXfixes \
    libXrandr mesa-libgbm pango cairo alsa-lib

elif command -v pacman &>/dev/null; then
  echo "Arch Linux detected."
  sudo pacman -S --needed nodejs npm nss atk at-spi2-atk cups \
    libdrm libxkbcommon libxcomposite libxdamage libxfixes \
    libxrandr mesa pango cairo alsa-lib

elif command -v zypper &>/dev/null; then
  echo "openSUSE detected."
  sudo zypper install -y nodejs npm nss atk at-spi2-atk cups-libs \
    libdrm libxkbcommon libXcomposite libXdamage libXfixes \
    libXrandr Mesa-libGBM pango cairo alsa-lib

else
  echo "Unknown distro. Install Node.js 18+ from https://nodejs.org"
  echo "and Electron system deps manually."
  exit 1
fi

echo "System dependencies installed!"
