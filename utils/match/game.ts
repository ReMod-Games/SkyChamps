import { Player, Spectator } from "./clients.ts";
import { CloseCodes } from "./codes.ts";
import { GameState } from "./game_state.ts";
/**
 * Resources that need to be managed
 *
 * Websocket connections of players (done by `Player` and `Spectator` classes)
 *
 * Timeout for lobby (done by `this.cleanUp`)
 *
 * AbortController eventListeners (done by `Player`, `Spectator` classes and `this.cleanUp`)
 */
export class Game {
  gameID: string;
  createdAt: Date;
  abortController: AbortController;
  state: GameState;
  playercount: number;

  #spectators: Spectator[];
  #players: Player[];
  #timeoutID: number;

  constructor(gameID: string) {
    this.gameID = gameID;
    this.createdAt = new Date();
    this.abortController = new AbortController();
    this.state = new GameState();
    this.playercount = 0;
    this.#spectators = [];
    this.#players = [];

    this.abortController.signal.addEventListener(
      "abort",
      this.cleanUp.bind(this),
    );

    this.#timeoutID = setTimeout(() => {
      if (this.#players.length < 2) this.cancelGame();
      else {
        clearTimeout(this.#timeoutID);
        this.#timeoutID = NaN;
      }
    }, 1000 * 60 * 2);
  }

  startGame(): void {
    if (isFinite(this.#timeoutID)) clearTimeout(this.#timeoutID);
    const event = new Event("start");
    this.sendGlobalEvent(event);
  }

  stopGame(evt: CloseEvent): void {
    this.abortController.signal.dispatchEvent(evt);
  }

  cancelGame(): void {
    const evt = new CloseEvent("abort", {
      reason: "Not all players connected",
      code: CloseCodes.MATCH_CANCELED,
    });
    // don't need to use `this.sendGlobalEvent`
    // That get's handled by `Spectator#cleanUp` and `Player#cleanUp`
    this.abortController.signal.dispatchEvent(evt);
  }

  sendGlobalEvent(evt: Event): void {
    // Broadcast to players and spectators
    for (const player of this.#players) player.sendEvent(evt);
    for (const spectator of this.#spectators) spectator.sendEvent(evt);
  }

  sendPlayerEvent(evt: Event): void {
    // Send only to players
    // Not intended for spectators
    for (const player of this.#players) player.sendEvent(evt);
  }

  async addClient(websocket: WebSocket, name: string) {
    if (this.#players.length < 2) {
      await this.#addPlayer(websocket, name);
      this.playercount = this.#players.length;
      return;
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
    this.abortController.signal.removeEventListener(
      "abort",
      this.cleanUp.bind(this),
    );
    this.state.cleanUp();
    this.#spectators = [];
    this.#players = [];

    // Only clear if not cleared
    if (isFinite(this.#timeoutID)) clearTimeout(this.#timeoutID);
  }

  // Private API

  async #addPlayer(webSocket: WebSocket, name: string) {
    const player = new Player({
      gameID: this.gameID,
      id: this.#players.length,
      gameAbortController: this.abortController,
      isExtended: true,
      webSocket,
      name,
    });

    // Initiate all eventListeners
    player.onClose(() =>
      this.stopGame(
        new CloseEvent("abort", {
          reason: "Player disconnected",
          code: CloseCodes.PLAYER_LEFT,
        }),
      )
    );

    player.onError(() =>
      this.stopGame(
        new CloseEvent("abort", {
          reason: "Player connection got forcibly closed",
          code: CloseCodes.PLAYER_LEFT_ERROR,
        }),
      )
    );

    player.onMessage(this.#gameEventHandler.bind(this));

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
      isExtended: false,
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

  #gameEventHandler(_evt: MessageEvent<string>, _player: Player): void {
    // Handle incoming events from players
  }
}
