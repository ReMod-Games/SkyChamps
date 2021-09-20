export class WSHandler {
  status: EventTarget = new EventTarget();
  sockets: WebSocket[] = [];

  addSocket(sock: WebSocket, id: 0 | 1) {
    // I feel like this onopen will fuck up at some point
    sock.onopen = () => this.sockets[id] = sock;
    sock.onmessage = (evt) => this.#handleMessageEvent(id, evt);
    sock.onclose = () =>
      this.dispatchAll(new CloseEvent(`Player ${id} left the game`));

    sock.onerror = () =>
      this.dispatchAll(new CloseEvent(`Unexpected Disconnect from ${id}`));
  }

  dispatchAll(evt: Event) {
    this.sockets.forEach((sock) => sock.dispatchEvent(evt));
  }

  dispatchToID(id: 0 | 1, evt: Event) {
    this.sockets[id].dispatchEvent(evt);
  }

  #handleMessageEvent(senderID: 0 | 1, evt: MessageEvent) {
    switch (evt.type) {
      case "chat":
        // Transform into chat object
        this.dispatchAll(evt);
        break;
      //   case "playCard":
      //     // Transform into card object
      //     this.dispatchToID(senderID === 0 ? 1 : 0, EVENT);
      //     break;
      //   case "getCards":
      //     // Connect to db and make card object
      //     this.dispatchToID(senderID, evt, EVENT);
      //     break;
      //   case "leave":
      //     // Transform into leave object
      //     this.dispatchAll(EVENT);
      //     break;
      default:
        this.dispatchToID(
          senderID,
          new ErrorEvent("Invalid Action", {
            message: "Tried to input invalid action",
          }),
        );
        break;
    }
  }
}
