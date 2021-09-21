interface ClientInit {
  gameID: string;
  name: string;
  id: number;
  webSocket: WebSocket;
  gameAbortController: AbortController;
}

export class Spectator {
  gameID: string;
  name: string;
  id: number;

  #webSocket: WebSocket;
  #gameAbortController: AbortController;

  constructor(init: ClientInit) {
    this.gameID = init.gameID;
    this.name = init.name;
    this.id = init.id;
    this.#webSocket = init.webSocket;
    this.#gameAbortController = init.gameAbortController;

    this.#gameAbortController.signal.addEventListener("abort", this.cleanUp);
  }

  onError(cb: VoidFunction): void {
    this.#webSocket.onerror = cb;
  }

  onClose(cb: VoidFunction): void {
    this.#webSocket.onclose = cb;
  }

  awaitConnection(): Promise<unknown> {
    return new Promise((res) => this.#webSocket.onopen = res);
  }

  /**
   * Works as a destructor.
   *
   * Clears up AbortController stuff
   *
   * Clears up WebSocket stuff
   */
  cleanUp(): void {
    this.#gameAbortController.signal.removeEventListener("abort", this.cleanUp);

    this.#webSocket.onclose = null;
    this.#webSocket.onerror = null;
    this.#webSocket.onopen = null;
    this.#webSocket.close(1000);
  }
}

export class Player extends Spectator {
  mana = 0;
  hp = 0;
  shield = 0;
  // #deck: Card[] = [];

  constructor(init: ClientInit) {
    super(init);
  }

  /**
   * Works as a destructor.
   *
   * Clears up AbortController stuff
   *
   * Clears up WebSocket stuff
   */
  cleanUp() {
    super.cleanUp();

    // this.#deck = [];
  }
}
