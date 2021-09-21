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
      this.abortMatch(1000, `type:close\x1Creason:Player ${id} left the game`);
    };

    sock.onerror = () => {
      // Remove itself from the connection pool when it errors
      delete this.sockets[id];
      this.abortMatch(
        1000,
        `type:error\x1Cerror:Player Disconnected\x1Cmessage:Unexpected Disconnect from ${id}`,
      );
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

  abortMatch(code: number, message?: string): void {
    // Ping with reason
    for (const ws of this.sockets) {
      // Silently ignore removed connections
      if (ws) {
        // These are to ensure they don't get called multiple times during abort
        ws.onclose = null;
        ws.onerror = null;
        ws.onmessage = null;
        ws.onopen = null;
        if (message) ws.send(message);
        ws.close(code);
      }
    }
    // Delete socket array;
    this.sockets = [];
    // Abort
    this.abortController.abort();
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
