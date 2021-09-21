export class WSHandler {
  sockets: WebSocket[] = [];
  abortController: AbortController = new AbortController();

  addSocket(sock: WebSocket, id: 0 | 1) {
    // I feel like this onopen will fuck up at some point
    sock.onopen = () => this.sockets[id] = sock;
    sock.onmessage = (evt) => this.#handleMessageEvent(id, evt);
    sock.onclose = () => {
      this.sendAll(`type:close\x1Creason:Player ${id} left the game`);
      this.sockets.forEach((sock) => sock.close(0));
      this.abortController.abort();
    };

    sock.onerror = () => {
      this.sendAll(
        `type:error\x1Cerror:Player Disconnected\x1Cmessage:Unexpected Disconnect from ${id}`,
      );
      this.sockets.forEach((sock) => sock.close(0));
      this.abortController.abort();
    };
  }

  sendAll(data: string) {
    this.sockets.forEach((sock) => sock.send(data));
  }

  sendToID(id: 0 | 1, data: string) {
    this.sockets[id].send(data);
  }

  #handleMessageEvent(senderID: 0 | 1, evt: MessageEvent) {
    switch (evt.type) {
      case "chat":
        // Transform into chat object
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
        this.sendToID(
          senderID,
          "type:error\x1Cerror:Invalid Action\x1Cmessage:Tried to input invalid action",
        );
        break;
    }
  }
}
