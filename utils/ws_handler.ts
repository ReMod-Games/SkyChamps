export class WSHandler {
  sockets: WebSocket[] = [];
  abortController: AbortController = new AbortController();

  addSocket(sock: WebSocket, id: 0 | 1) {
    // I feel like this onopen will fuck up at some point
    sock.onopen = () => this.sockets[id] = sock;
    sock.onmessage = (evt) => this.#handleMessageEvent(id, evt);
    sock.onclose = () => {
      this.sendAll(
        new CloseEvent("close", { reason: `Player ${id} left the game` }),
      );
      this.sockets.forEach((sock) => sock.close(0));
      this.abortController.abort();
    };

    sock.onerror = () => {
      this.sendAll(
        new ErrorEvent("error", {
          error: "Player Disconnect",
          message: `Unexpected Disconnect from ${id}`,
        }),
      );
      this.sockets.forEach((sock) => sock.close(0));
      this.abortController.abort();
    };
  }

  sendAll(evt: Event) {
    this.sockets.forEach((sock) => sock.send(formatEvent(evt)));
  }

  sendToID(id: 0 | 1, evt: Event) {
    this.sockets[id].send(formatEvent(evt));
  }

  #handleMessageEvent(senderID: 0 | 1, evt: MessageEvent) {
    switch (evt.type) {
      case "chat":
        // Transform into chat object
        this.sendAll(evt);
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
          new ErrorEvent("error", {
            error: "Invalid Action",
            message: "Tried to input invalid action",
          }),
        );
        break;
    }
  }
}

function formatEvent(evt: Event): string {
  switch (evt.type) {
    case "close":
      return `type:close\x1Creason:${(evt as CloseEvent).reason}`;
    case "message":
      return `type:message\x1Cmessage:${(evt as MessageEvent).data}`;
    case "error":
      // deno-fmt-ignore
      return `type:error\x1Cerror:${(evt as ErrorEvent).error}\x1Cmessage:${(evt as ErrorEvent).message}`;
  }
  return `type:error\x1Cerror:unknown\x1Cmessage:Unknown Error`;
}
