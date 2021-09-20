export class WSHandler {
  status: EventTarget = new EventTarget();
  conns: Deno.WebSocketUpgrade[] = [];

  addSocket(conn: Deno.WebSocketUpgrade, id: 0 | 1) {
    conn.socket.onopen = () => this.conns[id] = conn;
    conn.socket.onmessage = (evt) => this.#handleMessageEvent(id, evt);
    conn.socket.onclose = () =>
      this.dispatchAll(new CloseEvent(`Player ${id} left the game`));

    conn.socket.onerror = () =>
      this.dispatchAll(new CloseEvent(`Unexpected Disconnect from ${id}`));
  }

  dispatchAll(evt: Event) {
    this.conns.forEach((conn) => conn.socket.dispatchEvent(evt));
  }

  dispatchToID(id: 0 | 1, evt: Event) {
    this.conns[id].socket.dispatchEvent(evt);
  }

  #handleMessageEvent(senderID: 0 | 1, evt: MessageEvent) {
    switch (evt.type) {
      case "chat":
        this.dispatchAll(evt);
        break;
      case "playCard":
        this.dispatchToID(senderID === 0 ? 1 : 0, evt);
    }
  }
}
