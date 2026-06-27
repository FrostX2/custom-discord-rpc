<p align="center">
  <img src="assets/icon.png" alt="Frozen RPC" width="120">
</p>

<h1 align="center">❄️ Frozen RPC</h1>

<p align="center">
  <b>Cross-platform Discord Rich Presence Injector</b><br>
  <i>Local IPC • OAuth2 Gateway • Auto-Reconnect • Presets</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue?style=flat-square">
  <img src="https://img.shields.io/github/v/release/FrostX2/frosty-rpc?style=flat-square&color=blueviolet&label=version">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square">
  <img src="https://img.shields.io/badge/electron-42.x-47848F?style=flat-square&logo=electron">
  <img src="https://img.shields.io/badge/discord-rpc-5865F2?style=flat-square&logo=discord">
</p>

<br>

<table>
<tr>
<td width="50%" align="center">

### ⬇️ Download

[**Releases →**](https://github.com/FrostX2/frosty-rpc/releases)

| OS | Format |
|----|--------|
| 🪟 Windows | `.exe` installer |
| 🐧 Linux | `.AppImage` / `.deb` / `.rpm` / `.pkg.tar.zst` / `.flatpak` |
| 🍎 macOS | `.dmg` / `.pkg` |

</td>
<td width="50%" align="center">

### 🔧 Build

```bash
git clone https://github.com/FrostX2/frosty-rpc.git
cd frosty-rpc
npm install
./frozen-rpc              # run directly
npm run dist:all          # build installers
```

</td>
</tr>
</table>

<br>

## ✨ Features

| | | |
|---|---|---|
| 🎮 **Local & Inject modes** | 🔐 **OAuth2 login** | 💾 **Preset manager** |
| Direct IPC or Gateway WS | Token refresh & persistence | Save/load/swap profiles |
| 📋 **Full RPC fields** | 🔄 **Auto-reconnect** | 📦 **Cross-platform** |
| Text, images, timestamps, party, secrets, buttons | Exponential backoff, tray indicator | Windows • Linux • macOS |

<br>

## 🚀 Quick Start

```
./frozen-rpc          # Linux / macOS
shell\frozen-rpc.bat  # Windows
```

1. **Settings** → enter your Discord Client ID & Secret
2. **Accounts** → **Login with Discord** → authorize
3. **RPC** → fill in presence → pick mode → **Connect**

Minimize to tray — your presence runs in the background.

<br>

## 📦 Installers

| Command | Produces |
|---------|----------|
| `npm run dist:win` | `Frozen-RPC-Setup-*.exe` |
| `npm run dist:linux` | AppImage, deb, rpm, pkg.tar.zst |
| `npm run dist:mac` | DMG, PKG |
| `npm run dist:flatpak` | `.flatpak` bundle |
| `npm run dist:all` | Everything for your OS |

| Format | Install |
|--------|---------|
| 🪟 `.exe` | Double-click — auto-installs |
| 🐧 `.AppImage` | `chmod +x && ./Frozen RPC-*.AppImage` |
| 🐧 `.deb` | `sudo dpkg -i frozen-rpc_*.deb` |
| 🐧 `.rpm` | `sudo rpm -i frozen-rpc-*.rpm` |
| 🐧 `.pkg.tar.zst` | `sudo pacman -U frozen-rpc-*.pkg.tar.zst` |
| 🐧 `.flatpak` | `flatpak --user install frozen-rpc.flatpak` |
| 🍎 `.dmg` | Drag to Applications |
| 🍎 `.pkg` | Double-click installer |

Output goes to `../installer/`.

<br>

## 🛠️ Requirements

- **Node.js 18+**
- Discord client — only needed for **Local** mode (Inject mode works without it)

<br>

## 📁 Structure

```
frosty-rpc/
├── src/              Main process & modules
├── renderer/         UI (HTML, JS, CSS)
├── shell/            Launchers, distro scripts, helpers
├── assets/           Icons
├── flatpak/          Flatpak manifest
├── frozen-rpc        Universal launcher
└── package.json
```

Data lives in `rpc.db` (SQLite) and `config/config.json`.

<br>

<hr>

<p align="center">
  <sub>Built with Electron + discord-rpc + better-sqlite3</sub><br>
  <sub>MIT License · © NotFrost</sub><br>
  <a href="https://github.com/FrostX2/frosty-rpc/releases">Releases</a> · <a href="https://github.com/FrostX2/frosty-rpc">GitHub</a>
</p>
