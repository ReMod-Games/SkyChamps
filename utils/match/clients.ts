import { Deck } from "./deck.ts";

import type { AnyServerEvent } from "../../types/server_payloads/mod.ts";

type VoidEventFunction<T> = (evt: MessageEvent<T>, id: number) => void;

interface ClientInit {
  gameID: string;
  name: string;
  id: number;
  webSocket: WebSocket;
  gameAbortController: AbortController;
  isExtended: boolean;
}

export class Spectator {
  public gameID: string;
  public name: string;
  public id: number;

  protected webSocket: WebSocket;
  protected gameAbortController: AbortController;

  constructor(init: ClientInit) {
    this.gameID = init.gameID;
    this.name = init.name;
    this.id = init.id;
    this.webSocket = init.webSocket;
    this.gameAbortController = init.gameAbortController;

    if (!init.isExtended) {
      this.gameAbortController.signal.addEventListener(
        "abort",
        this.cleanUp.bind(this),
      );
    }
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
   * Clears up AbortController stuff
   *
   * Clears up WebSocket stuff
   */
  cleanUp(): void {
    this.gameAbortController.signal.removeEventListener(
      "abort",
      this.cleanUp.bind(this),
    );
    this.webSocket.onclose = null;
    this.webSocket.onerror = null;
    this.webSocket.onopen = null;
    this.webSocket.onmessage = null;
    this.webSocket.close();
  }
}

export class Player extends Spectator {
  declare mana: number;
  declare hp: number;
  declare deck: Deck;

  constructor(init: ClientInit) {
    super(init);
    this.mana = 0;
    this.hp = 0;
    this.deck = new Deck();
    this.gameAbortController.signal.addEventListener(
      "abort",
      this.cleanUp.bind(this),
    );
  }

  onMessage<T>(cb: VoidEventFunction<T>): void {
    this.webSocket.onmessage = (evt) => cb(evt, this.id);
  }

  /**
   * Works as a destructor.
   *
   * Clears up AbortController stuff
   *
   * Clears up deck
   */
  cleanUp() {
    super.cleanUp();
    this.gameAbortController.signal.removeEventListener(
      "abort",
      this.cleanUp.bind(this),
    );
    this.deck.cleanUp();
  }
}
