import type { Game } from "./utils/match/game.ts";
import type { Cache } from "./utils/cache.ts";

export interface ServerState {
  games: Map<string, Game>;
  cache: Cache;
}
