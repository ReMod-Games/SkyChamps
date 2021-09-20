import { Err, Ok } from "./deps.ts";
import { WSHandler } from "./utils/ws_handler.ts";

import type { Result } from "./deps.ts";

export class Lobby {
  code: string;
  createdAt: Date;
  /**
  0: Waiting for players
  1: Playing
  2: Done with the game
  */
  state: 0 | 1 | 2;
  playerCount: 0 | 1 | 2;
  wsHandler: WSHandler;

  constructor() {
    this.wsHandler = new WSHandler();
    this.playerCount = 0;
    this.state = 0;

    const d = new Date();
    this.code = d.getMilliseconds().toString(16);
    this.createdAt = d;
  }

  addPlayer(req: Request): Result<string, string> {
    if (this.playerCount > 2) return Err("Too many players");

    const sock = Deno.upgradeWebSocket(req);
    this.wsHandler.addSocket(sock, this.playerCount - 1 as 0 | 1);
    this.playerCount++;

    return Ok("Player Connected");
  }

  startGame(): void {
    const start = new Event("start");
    this.wsHandler.dispatchAll(start);
  }
}
