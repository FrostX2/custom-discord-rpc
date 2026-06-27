import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, "..", "rpc.db");

let db;

export function initDB() {
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      avatar TEXT,
      access_token TEXT NOT NULL,
      refresh_token TEXT,
      expires_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS presets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      config TEXT NOT NULL,
      created_at INTEGER DEFAULT (unixepoch())
    );
  `);

  return db;
}

export function getDB() {
  if (!db) initDB();
  return db;
}

export function getConfig(key) {
  const row = getDB().prepare("SELECT value FROM config WHERE key = ?").get(key);
  return row ? row.value : null;
}

export function setConfig(key, value) {
  getDB().prepare("INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)").run(key, value);
}

export function getAccounts() {
  return getDB().prepare("SELECT * FROM accounts ORDER BY username").all();
}

export function getAccount(id) {
  return getDB().prepare("SELECT * FROM accounts WHERE id = ?").get(id);
}

export function saveAccount(account) {
  getDB().prepare(`
    INSERT OR REPLACE INTO accounts (id, username, avatar, access_token, refresh_token, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(account.id, account.username, account.avatar || null, account.access_token, account.refresh_token || null, account.expires_at || null);
}

export function deleteAccount(id) {
  getDB().prepare("DELETE FROM accounts WHERE id = ?").run(id);
}

export function getPresets() {
  return getDB().prepare("SELECT * FROM presets ORDER BY name").all();
}

export function getPreset(id) {
  return getDB().prepare("SELECT * FROM presets WHERE id = ?").get(id);
}

export function savePreset(name, config) {
  const existing = getDB().prepare("SELECT id FROM presets WHERE name = ?").get(name);
  if (existing) {
    getDB().prepare("UPDATE presets SET config = ?, created_at = unixepoch() WHERE id = ?").run(JSON.stringify(config), existing.id);
    return existing.id;
  }
  const result = getDB().prepare("INSERT INTO presets (name, config) VALUES (?, ?)").run(name, JSON.stringify(config));
  return result.lastInsertRowid;
}

export function deletePreset(id) {
  getDB().prepare("DELETE FROM presets WHERE id = ?").run(id);
}

export function exportAllData() {
  return {
    config: getDB().prepare("SELECT * FROM config").all(),
    accounts: getAccounts(),
    presets: getPresets(),
  };
}

export function importAllData(data) {
  const db = getDB();
  const tx = db.transaction(() => {
    if (data.config) {
      for (const row of data.config) {
        db.prepare("INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)").run(row.key, row.value);
      }
    }
    if (data.accounts) {
      for (const acc of data.accounts) {
        db.prepare(`
          INSERT OR REPLACE INTO accounts (id, username, avatar, access_token, refresh_token, expires_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(acc.id, acc.username, acc.avatar, acc.access_token, acc.refresh_token, acc.expires_at);
      }
    }
    if (data.presets) {
      for (const p of data.presets) {
        db.prepare(`
          INSERT OR REPLACE INTO presets (id, name, config, created_at)
          VALUES (?, ?, ?, ?)
        `).run(p.id, p.name, p.config, p.created_at);
      }
    }
  });
  tx();
}
