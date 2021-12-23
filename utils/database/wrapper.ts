import { SqliteDatabase } from "../../deps.ts";

export class Database {
  #client: SqliteDatabase;
  #statements: ;
  constructor(path: URL) {
    this.#client = new SqliteDatabase(path.href);
    this.#client;
  }

  select() {
  }

  remove() {
  }

  insert() {
  }
}
