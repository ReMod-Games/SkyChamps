import type { Game } from "./utils/match/game.ts";
import type { Cache } from "./utils/cache.ts";
import type { Context } from "./deps.ts";

interface ServerConfig {
  port: number;
  protocol: "tcp";
}

interface StateBase {
  tracker(ctx: Context): void;
  serverConfig: ServerConfig;
}

export interface HTTPState extends StateBase {
  cache: Cache;
}

export interface WebSocketState extends StateBase {
  games: Map<string, Game>;
}
