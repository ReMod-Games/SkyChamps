import { Player, Spectator } from "./clients.ts";
import { CloseCodes } from "./codes.ts";

/**
 * Resources that need to be managed
 *
 * Websocket connections of players (done by `Player` and `Spectator` classes)
 *
 * Timeout for lobby (done by `this.cleanUp`)
 *
 * AbortController eventListeners (done by `Player` and `Spectator` classes)
 */
export class Game {
  gameID: string;
  createdAt = new Date();
  abortController: AbortController = new AbortController();
  state: 0 | 1 | 2 = 0;

  #spectators: Spectator[] = [];
  #players: Player[] = [];

  #timeoutID = setTimeout(() => {
    if (this.#players.length < 2) this.cancelGame();
  }, 1000 * 60 * 2);

  constructor(gameID: string) {
    this.gameID = gameID;

    this.abortController.signal.addEventListener("abort", this.cleanUp);
  }

  startGame(): void {
    const event = new Event("start");
    for (const player of this.#players) player.sendEvent(event);
    for (const spectator of this.#spectators) spectator.sendEvent(event);
  }

  stopGame(evt: CloseEvent): void {
    this.abortController.signal.dispatchEvent(evt);
  }

  cancelGame(): void {
    this.abortController.signal.dispatchEvent(
      new CloseEvent("closing", {
        reason: "Not all players connected",
        code: CloseCodes.MATCH_CANCELED,
      }),
    );
  }

  sendGlobalEvent(): void {
    // Broadcast to players and spectators
  }

  sendPlayerEvent(): void {
    // Send only to players
  }

  async addClient(websocket: WebSocket, name: string) {
    if (this.#players.length < 2) {
      return await this.#addPlayer(websocket, name);
    }
    await this.#addSpectator(websocket, name);
  }

  /**
   * Works as a destructor.
   *
   * Clears up AbortController stuff
   *
   * Clears up Players and Spectators
   */
  cleanUp(): void {
    this.abortController.signal.removeEventListener("abort", this.cleanUp);
    this.#spectators = [];
    this.#players = [];
    clearTimeout(this.#timeoutID);
  }

  // Private API

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
      this.stopGame(
        new CloseEvent("close", {
          reason: "Player disconnected",
          code: CloseCodes.PLAYER_LEFT,
        }),
      )
    );

    player.onError(() =>
      this.stopGame(
        new CloseEvent("close", {
          reason: "Player connection got forcibly closed",
          code: CloseCodes.PLAYER_LEFT_ERROR,
        }),
      )
    );

    player.onMessage(this.#gameEventHandler);

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

    // Silently remove spectator from match if disconnected
    spectator.onClose(() => this.#removeSpectator(spectator));
    spectator.onError(() => this.#removeSpectator(spectator));

    // Wait for the connection to be opened
    await spectator.awaitConnection();
    this.#spectators[spectator.id] = spectator;
  }

  #removeSpectator(spectator: Spectator) {
    delete this.#spectators[spectator.id];
    spectator.cleanUp(
      new CloseEvent("close", {
        code: CloseCodes.OK,
        reason: "Spectator Disconnected",
      }),
    );
  }

  #gameEventHandler(evt: MessageEvent<string>, player: Player): void {
    // Handle incoming events from players
  }
}
