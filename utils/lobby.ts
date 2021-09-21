import { WSHandler } from "./ws_handler.ts";

/**
  Resources that need to be managed:
  - Timeout's
  - Abortcontroller (make sure this always abort once the socket's are closed)
*/

export class Lobby {
  code: string;
  createdAt = new Date();
  abortController: AbortController = new AbortController();
  /**
   * 0: Waiting for players
   *
   * 1: Playing
   *
   * 2: Done with the game
   */
  state: 0 | 1 | 2 = 0;
  playerCount: 0 | 1 | 2 = 0;
  #wsHandler: WSHandler;
  // Will cancel the game if both players don't join in 2 minutes
  #timeoutID = setTimeout(() => {
    if (this.playerCount < 2) this.abortController.abort();
  }, 1000 * 60 * 2);

  constructor(code: string) {
    this.#wsHandler = new WSHandler();
    this.#wsHandler.abortController.signal.onabort = () => {
      // Immediate disconnect may fuck this up?
      clearTimeout(this.#timeoutID);
      this.state = 2;
      this.abortController.abort();
    };

    this.code = code;
  }

  async addPlayer(sock: WebSocket): Promise<string | undefined> {
    // TODO: Make it possible to have spectators via a seperate WS lobby or something
    if (this.playerCount > 2) return "Too many players";

    // Only resolved after connection is established
    await this.#wsHandler.addSocket(sock, this.playerCount as 0 | 1);
    this.playerCount++;
  }

  startGame(): void {
    this.state = 1;
    this.#wsHandler.sendAll("type\x1Cstart");
  }
}
