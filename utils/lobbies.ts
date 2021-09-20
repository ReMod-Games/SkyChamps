import { WSHandler } from "./ws_handler.ts";

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

  constructor(code: string) {
    this.#wsHandler = new WSHandler();
    this.playerCount = 0;
    this.state = 0;

    this.code = code;
    this.createdAt = new Date();
  }

  addPlayer(sock: WebSocket): string | undefined {
    // TODO: Make it possible to have spectators via a seperate WS lobby or something
    if (this.playerCount > 2) return "Too many players";

    this.#wsHandler.addSocket(sock, this.playerCount - 1 as 0 | 1);
    this.playerCount++;
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
