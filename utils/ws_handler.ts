/**
  Resources that need to be managed:
  - Websocket connections (make sure all of these are closed)
  - Abortcontroller (make sure this always abort once the socket's are closed)
*/

export class WSHandler {
  sockets: WebSocket[] = [];
  abortController: AbortController = new AbortController();

  async addSocket(sock: WebSocket, id: 0 | 1) {
    const connection = new Promise((res) => sock.onopen = res);
    sock.onmessage = (evt) => this.#handleMessageEvent(id, evt);
    sock.onclose = () => {
      // Remove itself from the connection pool when closed
      delete this.sockets[id];
      this.sendAll(`type:close\x1Creason:Player ${id} left the game`);
      this.sockets.forEach((sock) => sock.close(0));
      this.abortController.abort();
    };
    sock.onerror = () => {
      // Remove itself from the connection pool when it errors
      delete this.sockets[id];
      this.sendAll(
        `type:error\x1Cerror:Player Disconnected\x1Cmessage:Unexpected Disconnect from ${id}`,
      );
      this.sockets.forEach((sock) =>
        sock.close(0, "Unexpected Disconnect from " + id)
      );
      this.abortController.abort();
    };
    await connection;
    this.sockets[id] = sock;
  }

  sendAll(data: string) {
    this.sockets.forEach((sock) => sock.send(data));
  }

  sendToID(id: 0 | 1, data: string) {
    this.sockets[id].send(data);
  }

  #handleMessageEvent(senderID: 0 | 1, originalEvent: MessageEvent<string>) {
    const data = transformMessageEvent(originalEvent);
    // Remove this console
    console.log({ senderID, evt: originalEvent.type, data });
    // Switch statement here, Still needs some things
  }
}

// Transform message event into a object.
function transformMessageEvent(
  evt: MessageEvent<string>,
): Record<string, string> {
  const rec: Record<string, string> = {};
  const data: string[][] = evt.data.split("\x1D").map((x) => x.split("\x1C"));
  for (const [key, value] of data) {
    rec[key] = value;
  }
  return rec;
}
