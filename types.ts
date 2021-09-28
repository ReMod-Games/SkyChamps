import type { Game } from "./utils/match/game.ts";
import type { Cache } from "./utils/cache.ts";
import type { Context } from "./deps.ts";

export interface ServerState {
  tracker(ctx: Context): void;
  games: Map<string, Game>;
  cache: Cache;
}
