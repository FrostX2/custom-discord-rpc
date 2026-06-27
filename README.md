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

```bash
npm install
```

Create a Discord application at https://discord.com/developers/applications and add a redirect URI of `http://localhost:53173/callback`.

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

## Launcher Scripts

- `frozen-rpc.sh` — Linux
- `frozen-rpc.bat` — Windows
- `frozen-rpc.command` — macOS

## Data Storage

| File | Contents |
|------|----------|
| `rpc.db` | SQLite — accounts, presets, config |
| `config/config.json` | App credentials (Client ID/Secret) |

Export/import all data from the Accounts tab.

## Build

```bash
npx electron-builder
```

## Requirements

- Node.js 18+
- Discord desktop client (for local mode only)
