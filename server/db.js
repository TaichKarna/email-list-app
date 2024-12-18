import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./emails.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS email_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender TEXT NOT NULL,
      subject TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      body TEXT 
    )
  `);
});

export default db;
