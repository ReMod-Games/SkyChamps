import { SQLiteDatabase } from "../../deps.ts";
// import type { Queries, Statements } from "./types.ts";

export class Database {
  db: SQLiteDatabase;
  // statements: Statements;

  constructor(file: string) {
    this.db = new SQLiteDatabase(file);
    this.db.query(`
      CREATE TABLE IF NOT EXISTS matches (
        match_id INTEGER,
        date INTEGER
      );
    `);
    this.db.query(`
      CREATE TABLE IF NOT EXISTS actions (
        FOREIGN KEY(match_id) REFERENCES matches(match_id),
        user TEXT,
        action BLOB,
        date INTEGER
      );
    `);
    this.db.query(`
      CREATE TABLE IF NOT EXISTS messages (
        FOREIGN KEY(match_id) REFERENCES matches(match_id),
        user TEXT,
        message TEXT,
        date INTEGER
      );
    `);
    this.db.query(`
      CREATE TABLE IF NOT EXISTS replays (
        FOREIGN KEY(match_id) REFERENCES matches(match_id),
        data BLOB
      );
    `);
  }
}
