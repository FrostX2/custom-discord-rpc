# Custom Discord RPC

Cross-platform custom Discord Rich Presence application.

## Setup

1. Create a Discord application at https://discord.com/developers/applications
2. Copy your application's **Client ID**
3. Install dependencies:

```bash
npm install
```

4. Configure your presence:

```bash
cp .env.example .env
# Edit .env and add your CLIENT_ID

cp config.example.json config.json
# Edit config.json to customize your Rich Presence
```

## Usage

Start the Rich Presence:

```bash
npm start
```

Make sure Discord is running before starting the app.

## Configuration

Edit `config.json` to customize:
- `details` / `state` — main text lines
- `showTime` — show elapsed time
- `largeImageKey` / `smallImageKey` — image asset keys from your Discord app
- `buttons` — up to 2 buttons with label and url

## Requirements

- Node.js 18+
- Discord desktop client running
