import type { PreparedQuery } from "../../deps.ts";

interface Queries {
  replays: PreparedQuery;
  chatMessages: PreparedQuery;
  matches: PreparedQuery;
}

export interface Statements {
  select: {
    replays: PreparedQuery;
    chatMessages: PreparedQuery;
    matches: PreparedQuery;
  };
  insert: {
    replays: PreparedQuery;
  };
}
