import { app, BrowserWindow, ipcMain, Tray, Menu, dialog, shell, nativeImage } from "electron";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { createServer } from "http";
import { initDB, getAccounts, saveAccount, deleteAccount, getPresets, savePreset, deletePreset, exportAllData, importAllData } from "../src/db.js";
import { buildAuthURL, exchangeCode, fetchDiscordUser } from "../src/auth.js";
import { startLocalRPC, startGatewayRPC, stopRPC, updateActivity, isConnected, getMode } from "../src/rpc.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, "..", "config", "config.json");

let mainWindow = null;
let tray = null;

function loadAppConfig() {
  try {
    if (existsSync(CONFIG_PATH)) {
      return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
    }
  } catch {}
  return { clientId: "", clientSecret: "", redirectUri: "http://localhost:53173/callback" };
}

function saveAppConfig(cfg) {
  const dir = join(__dirname, "..", "config");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
}

function createTray() {
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  tray.setToolTip("Custom Discord RPC");
  updateTrayMenu(false);
}

function updateTrayMenu(connected) {
  const contextMenu = Menu.buildFromTemplate([
    { label: connected ? "Connected" : "Disconnected", enabled: false },
    { type: "separator" },
    {
      label: "Show Window",
      click: () => { if (mainWindow) { mainWindow.show(); mainWindow.focus(); } },
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => { stopRPC(); app.quit(); },
    },
  ]);
  tray.setContextMenu(contextMenu);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 580,
    height: 760,
    resizable: false,
    title: "Custom Discord RPC",
    webPreferences: { preload: join(__dirname, "preload.js") },
  });

  mainWindow.loadFile(join(__dirname, "..", "renderer", "index.html"));
  mainWindow.setMenu(null);

  mainWindow.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

app.on("ready", () => {
  initDB();
  createTray();
  createWindow();

  app.on("activate", () => {
    if (mainWindow) mainWindow.show();
    else createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") { stopRPC(); app.quit(); }
});

app.isQuitting = false;
app.on("before-quit", () => { app.isQuitting = true; });

// ── Config ──

ipcMain.handle("get-app-config", () => loadAppConfig());

ipcMain.handle("save-app-config", (_e, cfg) => {
  saveAppConfig(cfg);
  return { success: true };
});

// ── Accounts ──

ipcMain.handle("get-accounts", () => getAccounts());

ipcMain.handle("delete-account", (_e, id) => {
  deleteAccount(id);
  return { success: true };
});

// ── OAuth ──

ipcMain.handle("start-oauth", async (_e, { clientId, clientSecret, redirectUri }) => {
  try {
    const tokenData = await startAuthServer(clientId, clientSecret, redirectUri);
    const user = await fetchDiscordUser(tokenData.access_token);

    saveAccount({
      id: user.id,
      username: user.username,
      avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + tokenData.expires_in * 1000,
    });

    return { success: true, user };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

function startAuthServer(clientId, clientSecret, redirectUri) {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      const url = new URL(req.url, redirectUri);
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end("<h2>Authorization failed</h2><p>You can close this tab.</p>");
        server.close();
        reject(new Error(error));
        return;
      }

      if (code) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h2>Authorized!</h2><p>You can close this tab and return to the app.</p>");

        try {
          const tokenData = await exchangeCode(code, clientId, clientSecret, redirectUri);
          server.close();
          resolve(tokenData);
        } catch (err) {
          server.close();
          reject(err);
        }
        return;
      }

      res.writeHead(404);
      res.end();
    });

    server.listen(53173, () => {
      const authUrl = buildAuthURL(clientId, redirectUri);
      shell.openExternal(authUrl);
    });

    server.on("error", reject);
  });
}

// ── RPC ──

ipcMain.handle("start-local-rpc", async (_e, id, config) => {
  try {
    startLocalRPC(id, config, (status) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("rpc-status", status);
      }
      updateTrayMenu(status.connected);
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("start-gateway-rpc", async (_e, token, config) => {
  try {
    startGatewayRPC(token, config, (status) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("rpc-status", status);
      }
      updateTrayMenu(status.connected);
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("stop-rpc", () => {
  stopRPC();
  updateTrayMenu(false);
  return { success: true };
});

ipcMain.handle("update-activity", async (_e, config) => {
  try {
    await updateActivity(config);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("is-connected", () => isConnected());
ipcMain.handle("get-mode", () => getMode());

// ── Presets ──

ipcMain.handle("get-presets", () => getPresets());

ipcMain.handle("save-preset", (_e, name, config) => {
  return savePreset(name, config);
});

ipcMain.handle("delete-preset", (_e, id) => {
  deletePreset(id);
  return { success: true };
});

// ── Export / Import ──

ipcMain.handle("export-data", async () => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    defaultPath: "discord-rpc-backup.json",
    filters: [{ name: "JSON", extensions: ["json"] }],
  });
  if (!filePath) return { success: false };
  const data = exportAllData();
  writeFileSync(filePath, JSON.stringify(data, null, 2));
  return { success: true, path: filePath };
});

ipcMain.handle("import-data", async () => {
  const { filePaths } = await dialog.showOpenDialog(mainWindow, {
    filters: [{ name: "JSON", extensions: ["json"] }],
    properties: ["openFile"],
  });
  if (!filePaths?.length) return { success: false };
  const raw = readFileSync(filePaths[0], "utf-8");
  importAllData(JSON.parse(raw));
  return { success: true };
});
