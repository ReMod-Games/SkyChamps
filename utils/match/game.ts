import { Player } from "./clients.ts";
import { GameState } from "./game_state.ts";
import { CARD_CACHE } from "../cards/cards_cache.ts";
import { gameEventHandler } from "./game_event_handler.ts";

import type { AnyServerEvent } from "../../types/server_send_payloads/mod.ts";

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

  private timeoutID: number;

  constructor(gameID: string) {
    this.gameID = gameID;
    this.createdAt = new Date();
    this.abortController = new AbortController();
    this.state = new GameState();
    this.playercount = 0;
    this.players = [];

    this.abortController
      .signal
      .addEventListener("abort", () => this.cleanUp(), { once: true });

    this.timeoutID = setTimeout(() => {
      if (this.players.length < 2) this.cancelGame();
      this.timeoutID = NaN;
    }, 1000 * 60);
  }

  startGame(): void {
    clearTimeout(this.timeoutID);
    this.sendGlobalEvent({ type: "game_start" });
    for (let i = 0; i < 2; i++) {
      const player = this.players[i];
      const enemy = this.players[(i + 1) % 2];
      for (let j = 0; j < 6; j++) {
        const card = CARD_CACHE.getRandomCard();
        player.sendEvent({
          type: "self_draw",
          cardIndex: j,
          card,
        });
        player.deck.addCard(card);
        enemy.sendEvent({ type: "opp_draw", cardIndex: j });
      }
      player.sendEvent({ type: "self_end_turn" });
      enemy.sendEvent({ type: "opp_end_turn" });
    }
  }

  stopGame(reason: string): void {
    this.sendGlobalEvent({ type: "game_cancel", reason });
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
    for (const player of this.players) player?.sendEvent(record);
  }

  async addPlayer(webSocket: WebSocket, name: string) {
    const player = new Player({
      gameID: this.gameID,
      id: this.players.length,
      gameAbortSignal: this.abortController.signal,
      webSocket,
      name,
    });

    // Initiate all eventListeners
    const stopCB = () => {
      delete this.players[player.id];
      this.stopGame("Opponent Disconnected");
    };

    player.onClose(stopCB);
    player.onError(stopCB);

    player.onMessage((evt) => gameEventHandler(evt, this, player.id));

    // Wait for the connection to be opened
    await player.awaitConnection();

    this.players.push(player);
    this.playercount += 1;
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
    this.players.forEach((x) => x.cleanUp());
    this.players = [];
  }
}
