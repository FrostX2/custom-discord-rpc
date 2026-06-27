# Frozen RPC

Cross-platform desktop app for Discord Rich Presence injection with OAuth2, auto-reconnect, and preset management.

## Features

- **Local mode** — sets presence via running Discord client (IPC)
- **Inject mode** — sets presence via Discord Gateway using OAuth2 (no local client needed)
- **All RPC fields** — text, images, timestamps, party, secrets, buttons, instance
- **OAuth2 login** — authorize with Discord to get a token
- **Auto-reconnect** — exponential backoff on disconnect
- **Presets** — save/load/config export/import
- **SQLite DB** (`rpc.db`) — stores accounts, presets, and config

## Setup

Create a Discord application at https://discord.com/developers/applications and add a redirect URI of `http://localhost:53173/callback`.

Run the launcher for your OS:

```bash
./frozen-rpc.sh      # Linux / macOS
frozen-rpc.bat       # Windows (double-click)
```

The launcher auto-detects your distro/OS and runs the right script from `other-distro/`.

## Usage

```bash
npm start
```

1. **Settings tab** — enter your Client ID/Secret
2. **Accounts tab** → click **Login with Discord**
3. **RPC tab** → fill in your presence, choose mode, click **Connect**
4. Minimize to tray — presence keeps running

### Local Mode

Uses Discord's local IPC. Discord must be running. Enter your Client ID and connect.

### Inject Mode (OAuth2)

Uses Discord Gateway with an OAuth2 token. No local client needed. Authorize an account, select it, and connect.

## Shortcuts / Desktop Integration

| OS | File | How to install |
|----|------|---------------|
| Linux | `frozen-rpc.desktop` | Run `bash other-distro/linux-install-desktop.sh` |
| macOS | `Frozen RPC.app` (in `other-distro/`) | Run `bash other-distro/macos-install-app.sh` |
| Windows | `frozen-rpc.bat` + shortcut | Double-click `other-distro/windows-shortcut.vbs` |

## Build Installers

```bash
npm run dist:win         # Windows NSIS (.exe)
npm run dist:linux       # Linux: AppImage + .deb + .rpm + .pacman
npm run dist:mac         # macOS DMG + PKG
npm run dist:flatpak     # Linux Flatpak (.flatpak)
npm run dist:all         # All for current OS (via build-installers.sh)
```

| Format | OS | Output |
|--------|----|--------|
| **NSIS** | Windows | `dist/Frozen-RPC-Setup-*.exe` — installs to `%APPDATA%`, Start Menu + Desktop shortcuts |
| **AppImage** | Linux | `dist/Frozen RPC-*.AppImage` — portable, double-click to run |
| **DEB** | Linux (Debian/Ubuntu) | `dist/frozen-rpc_*.deb` — `sudo dpkg -i` |
| **RPM** | Linux (Fedora/RHEL) | `dist/frozen-rpc-*.rpm` — `sudo rpm -i` |
| **pacman** | Linux (Arch) | `dist/frozen-rpc-*.pkg.tar.zst` — `sudo pacman -U` |
| **Flatpak** | Linux (any) | `flatpak/frozen-rpc.flatpak` — `flatpak --user install` |
| **DMG** | macOS | `dist/Frozen RPC-*.dmg` — drag to Applications |
| **PKG** | macOS | `dist/Frozen RPC-*.pkg` — double-click installer |

## Data Storage

| File | Contents |
|------|----------|
| `rpc.db` | SQLite — accounts, presets, config |
| `config/config.json` | App credentials (Client ID/Secret) |

Export/import all data from the Accounts tab.

## Requirements

- Node.js 18+
- Discord desktop client (for local mode only)
