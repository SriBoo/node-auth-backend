import sqlite3 from "sqlite3";

const dbFile = process.env.DB_FILE || "./data/users.db";

export function initDB() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbFile, (err) => {
      if (err) {
        reject(err);
      } else {
        db.run(
          `CREATE TABLE IF NOT EXISTS users (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             email TEXT NOT NULL UNIQUE,
             password_hash TEXT NOT NULL,
             created_at DATETIME DEFAULT CURRENT_TIMESTAMP
           )`,
          (err2) => {
            if (err2) reject(err2);
            else resolve(db);
          }
        );
      }
    });
  });
}
