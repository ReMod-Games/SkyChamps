import { Player, Spectator } from "./clients.ts";
import { GameState } from "./game_state.ts";
import { gameEventHandler } from "./game_event_handler.ts";

import type {
  AnyServerEvent,
  MiscEvents,
} from "../../types/server_send_payloads/mod.ts";

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
  public gameID: string;
  public createdAt: Date;
  public abortController: AbortController;
  public state: GameState;
  public playercount: number;
  public players: Player[];

  private spectators: Spectator[];
  private timeoutID: number;

  constructor(gameID: string) {
    this.gameID = gameID;
    this.createdAt = new Date();
    this.abortController = new AbortController();
    this.state = new GameState();
    this.playercount = 0;
    this.spectators = [];
    this.players = [];

    this.abortController
      .signal
      .addEventListener("abort", () => this.cleanUp(), { once: true });

    this.timeoutID = setTimeout(() => {
      if (this.players.length < 2) this.cancelGame();
      this.timeoutID = NaN;
    }, 1000 * 60 * 2);
  }

  startGame(): void {
    clearTimeout(this.timeoutID);
    this.sendGlobalEvent({ type: "game_start" });
  }

  stopGame(event: MiscEvents.GameCancel): void {
    this.sendGlobalEvent(event);
    // cleanUp will handle all player connections
    this.cleanUp();
  }

  cancelGame(): void {
    this.sendGlobalEvent({
      type: "game_cancel",
      reason: "Not all players connected",
    });
  }

  sendGlobalEvent(record: AnyServerEvent): void {
    // Broadcast to players and spectators
    this.spectators
      .concat(this.players)
      .forEach((x) => x.sendEvent(record));
  }

  // Not sure if I will need this.
  sendPlayerEvent(record: AnyServerEvent): void {
    // Send only to players
    // Not intended for spectators
    for (const player of this.players) player.sendEvent(record);
  }

  addClient(websocket: WebSocket, name: string): Promise<void> {
    return this.playercount < 2
      ? this.addPlayer(websocket, name)
      : this.addSpectator(websocket, name);
  }

  /**
   * Works as a destructor.
   *
   * Clears up AbortController stuff
   *
   * Clears up Players and Spectators
   */
  cleanUp(): void {
    this.state.cleanUp();
    this.spectators = [];
    this.players.forEach((x) => x.cleanUp());
    this.players = [];
  }

  // Private API

  async addPlayer(webSocket: WebSocket, name: string) {
    const player = new Player({
      gameID: this.gameID,
      id: this.players.length,
      gameAbortSignal: this.abortController.signal,
      webSocket,
      name,
    });

    // Initiate all eventListeners
    player.onClose(() =>
      this.stopGame({ type: "game_cancel", reason: "Player disconnected" })
    );

    player.onError(() =>
      this.stopGame({
        type: "game_cancel",
        reason: "Player connection got forcibly closed",
      })
    );

    player.onMessage((evt) => gameEventHandler(evt, this, player.id));

    // Wait for the connection to be opened
    await player.awaitConnection();

    this.players.push(player);
    this.playercount += 1;
  }

  async addSpectator(webSocket: WebSocket, name: string) {
    const possibleID = this.spectators.findIndex((x) => x === undefined);
    const spectator = new Spectator({
      gameID: this.gameID,
      // If there is a empty spot in array, grab that. Else assign new one
      id: possibleID > 0 ? possibleID : this.spectators.length,
      gameAbortSignal: this.abortController.signal,
      webSocket,
      name,
    });

    // Silently remove spectator from match if disconnected
    spectator.onClose(() => this.removeSpectator(spectator));
    spectator.onError(() => this.removeSpectator(spectator));

    // Wait for the connection to be opened
    await spectator.awaitConnection();
    this.spectators[spectator.id] = spectator;
  }

  removeSpectator(spectator: Spectator) {
    delete this.spectators[spectator.id];
    spectator.cleanUp();
  }
}
