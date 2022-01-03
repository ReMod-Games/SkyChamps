import { Deck } from "./deck.ts";

import type { AnyServerEvent } from "../../types/server_send_payloads/mod.ts";

type VoidEventFunction<T> = (evt: MessageEvent<T>) => void;

interface ClientInit {
  gameID: string;
  name: string;
  id: number;
  webSocket: WebSocket;
  gameAbortSignal: AbortSignal;
}

export class Player {
  public gameID: string;
  public name: string;
  public id: number;

  protected webSocket: WebSocket;
  protected gameAbortSignal: AbortSignal;

  public mana: number;
  public hp: number;
  /**
   * Private deck of the player
   */
  public deck: Deck;

  constructor(init: ClientInit) {
    this.gameID = init.gameID;
    this.name = init.name;
    this.id = init.id;
    this.webSocket = init.webSocket;
    this.gameAbortSignal = init.gameAbortSignal;
    this.mana = 0;
    this.hp = 0;
    this.deck = new Deck();
    this.gameAbortSignal
      .addEventListener("abort", () => this.cleanUp(), { once: true });
  }

  onMessage(cb: VoidEventFunction<string>): void {
    this.webSocket.onmessage = cb;
  }

  /** What to do when websocket errors */
  onError(cb: VoidFunction): void {
    this.webSocket.onerror = cb;
  }

  /** What to do when socket closes */
  onClose(cb: VoidFunction): void {
    this.webSocket.onclose = cb;
  }

  /** Wait for connection to be opened */
  awaitConnection(): Promise<unknown> {
    return new Promise((res) => this.webSocket.onopen = res);
  }

  /** Send events to this websocket */
  sendEvent(record: AnyServerEvent): void {
    this.webSocket.send(JSON.stringify(record));
  }

  /**
   * Works as a destructor.
   *
   * Clears up WebSocket stuff
   */
  cleanUp(): void {
    this.webSocket.onclose = null;
    this.webSocket.onerror = null;
    this.webSocket.onopen = null;
    this.webSocket.onmessage = null;
    this.webSocket.close();
    this.deck.cleanUp();
  }
}
