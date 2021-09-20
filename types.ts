import { Lobby } from "./utils/lobbies.ts";

export interface ServerState {
  lobbies: Map<string, Lobby>;
}
