import { Player, Spectator } from "./clients.ts";

interface StopInit {
  reason?: string;
  code?: number;
}

/**
  Resources that need to be managed:
  - Timeout's
  - Abortcontroller (make sure this always abort once the socket's are closed)
*/

export class Game {
  gameID: string;
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
  #spectators: Spectator[] = [];
  #players: Player[] = [];
  #timeoutID = setTimeout(() => {
    if (this.#players.length > 2) this.cleanUp();
    clearTimeout(this.#timeoutID);
  });
  constructor(gameID: string) {
    this.gameID = gameID;
  }

  async addClient(websocket: WebSocket, name: string) {
    if (this.#players.length < 2) {
      await this.#addPlayer(websocket, name);
    } else {
      await this.#addSpectator(websocket, name);
    }
  }

  startGame(): void {}
  // Already started
  stopGame(init: StopInit): void {}
  // Not started yet
  cancelGame(): void {}

  async #addPlayer(webSocket: WebSocket, name: string) {
    const player = new Player({
      gameID: this.gameID,
      id: this.#players.length,
      gameAbortController: this.abortController,
      webSocket,
      name,
    });

    // Initiate all eventListeners
    player.onClose(() =>
      this.stopGame({ reason: "Player disconnected", code: 1000 })
    );
    player.onError(() =>
      this.stopGame({ reason: "Player disconnected unexpectedly", code: 4000 })
    );
    player.onMessage((evt) => this.#gameEventHandler(evt, player));

    // Wait for the connection to be opened
    await player.awaitConnection();

    this.#players.push(player);
  }

  async #addSpectator(webSocket: WebSocket, name: string) {
    const possibleID = this.#spectators.findIndex((x) => x === undefined);
    const spectator = new Spectator({
      gameID: this.gameID,

      // If there is a empty spot in array, grab that. Else assign new one
      id: possibleID > 0 ? possibleID : this.#spectators.length,
      gameAbortController: this.abortController,
      webSocket,
      name,
    });

    webSocket.onclose = () => this.#removeSpectator(spectator);
    webSocket.onerror = () => this.#removeSpectator(spectator);

    // Wait for the connection to be opened
    await new Promise((res) => webSocket.onopen = res);
    this.#spectators[spectator.id] = spectator;
  }

  #removeSpectator(spectator: Spectator) {
    delete this.#spectators[spectator.id];
    spectator.cleanUp();
  }

  #gameEventHandler(evt: MessageEvent<string>, player: Player): void {
  }
}
