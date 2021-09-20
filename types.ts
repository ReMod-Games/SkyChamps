import type { Lobby } from "./utils/lobby.ts";
import type { Cache } from "./utils/cache.ts";

export interface ServerState {
  lobbies: Map<string, Lobby>;
  cache: Cache;
}
