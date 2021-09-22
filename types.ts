import type { Game } from "./utils/game.ts";
import type { Cache } from "./utils/cache.ts";

export interface ServerState {
  lobbies: Map<string, Game>;
  cache: Cache;
}
