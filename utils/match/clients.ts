import { eventToPayload } from "./transformers.ts";
import type { CardRecord as Card } from "../database/types.ts";

type VoidEventFunction<T> = (evt: MessageEvent<T>, player: Player) => void;

interface ClientInit {
  gameID: string;
  name: string;
  id: number;
  webSocket: WebSocket;
  gameAbortController: AbortController;
  isExtended: boolean;
}

export class Spectator {
  declare gameID: string;
  declare name: string;
  declare id: number;

  declare protected webSocket: WebSocket;
  declare protected gameAbortController: AbortController;

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
  sendEvent(evt: Event): void {
    this.webSocket.send(eventToPayload(evt));
  }

  /**
   * Works as a destructor.
   *
   * Clears up AbortController stuff
   *
   * Clears up WebSocket stuff
   */
  cleanUp(evt: Event): void {
    this.gameAbortController.signal.removeEventListener(
      "abort",
      this.cleanUp.bind(this),
    );
    this.webSocket.onclose = null;
    this.webSocket.onerror = null;
    this.webSocket.onopen = null;
    this.webSocket.onmessage = null;
    this.webSocket.close((evt as CloseEvent).code, (evt as CloseEvent).reason);
  }
}

export class Player extends Spectator {
  declare mana: number;
  declare hp: number;
  declare shield: number;
  declare deck: Card[];

  constructor(init: ClientInit) {
    super(init);
    this.mana = 0;
    this.hp = 0;
    this.shield = 0;
    // this.deck = [];
    this.gameAbortController.signal.addEventListener(
      "abort",
      this.cleanUp.bind(this),
    );
  }

  onMessage<T>(cb: VoidEventFunction<T>): void {
    this.webSocket.onmessage = (evt) => cb(evt, this);
  }

  /**
   * Works as a destructor.
   *
   * Clears up AbortController stuff
   *
   * Clears up deck
   */
  cleanUp(evt: Event) {
    super.cleanUp(evt);
    this.gameAbortController.signal.removeEventListener(
      "abort",
      this.cleanUp.bind(this),
    );
    this.deck = [];
  }
}
