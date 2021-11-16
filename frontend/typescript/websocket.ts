/// <reference lib="dom"/>
export class WebSocketConnection {
  #websocket: WebSocket;

  constructor(url: URL | string) {
    this.#websocket = new WebSocket(url);
  }
}
