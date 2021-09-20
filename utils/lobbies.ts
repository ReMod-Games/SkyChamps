import { Err, Ok } from "../deps.ts";
import { WSHandler } from "./ws_handler.ts";

import type { Result } from "../deps.ts";

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
  #wsHandler: WSHandler;

  constructor() {
    this.#wsHandler = new WSHandler();
    this.playerCount = 0;
    this.state = 0;

    const d = new Date();
    this.code = d.getMilliseconds().toString(16).toUpperCase();
    this.createdAt = d;
  }

  addPlayer(sock: WebSocket): Result<string, string> {
    if (this.playerCount > 2) return Err("Too many players");

    this.#wsHandler.addSocket(sock, this.playerCount - 1 as 0 | 1);
    this.playerCount++;

    return Ok("Player Connected");
  }

  startGame(): void {
    this.state = 1;
    this.#wsHandler.dispatchAll(new Event("start"));
  }

  stopGame(): void {
    this.state = 2;
    this.#wsHandler.dispatchAll(new CloseEvent("Server stopped this game"));
  }
}
