import { Client } from "discord-rpc";
import "dotenv/config";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadConfig() {
  const configPath = join(__dirname, "..", "config.json");
  if (!existsSync(configPath)) {
    console.error("config.json not found. Copy config.example.json and edit it.");
    process.exit(1);
  }
  return JSON.parse(readFileSync(configPath, "utf-8"));
}

const config = loadConfig();
const clientId = process.env.CLIENT_ID || config.clientId;

if (!clientId || clientId === "your_client_id_here") {
  console.error("Set CLIENT_ID in .env or config.json");
  process.exit(1);
}

const rpc = new Client({ transport: "ipc" });

rpc.on("ready", () => {
  console.log(`RPC connected as ${rpc.user?.username}`);

  rpc.setActivity({
    details: config.details || "Playing a game",
    state: config.state || "In menu",
    startTimestamp: config.showTime ? Date.now() : undefined,
    largeImageKey: config.largeImageKey || undefined,
    largeImageText: config.largeImageText || undefined,
    smallImageKey: config.smallImageKey || undefined,
    smallImageText: config.smallImageText || undefined,
    buttons: config.buttons?.length ? config.buttons : undefined,
  });

  console.log("Rich Presence updated!");
});

rpc.on("disconnected", () => {
  console.log("Disconnected from Discord");
  process.exit(0);
});

rpc.login({ clientId }).catch(console.error);

process.on("SIGINT", () => rpc.destroy().then(() => process.exit(0)));
process.on("SIGTERM", () => rpc.destroy().then(() => process.exit(0)));
