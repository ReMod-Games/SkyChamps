// import { SQLiteDatabase } from "../../deps.ts";
import type { PreparedQuery } from "../../deps.ts";

type R = Record<string, unknown>;

type ToQueryArray<T> = T[keyof T][];
type ToPreparedQuery<T extends R> = PreparedQuery<ToQueryArray<T>, T>;

interface Action extends R {
  matchID: number;
  user: string;
  action: Record<string, string>;
  date: Date;
}

interface Message extends R {
  matchID: number;
  user: string;
  message: string;
  date: Date;
}

interface Replay extends R {
  matchID: number;
  data: Record<string, string>;
}

interface Match extends R {
  matchID: number;
  date: Date;
  status: 0 | 1 | 2;
}

export interface Queries {
  matches: ToPreparedQuery<Match>;
  actions: ToPreparedQuery<Action>;
  messages: ToPreparedQuery<Message>;
  replays: ToPreparedQuery<Replay>;
}

export interface Statements {
  select: Queries;
  insert: Queries;
  update: Queries;
}
