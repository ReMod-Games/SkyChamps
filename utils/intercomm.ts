export class InterCommHTTP {
  underlyingChannel: BroadcastChannel;
  id: number;
  constructor(name: string) {
    this.id = 0;
    this.underlyingChannel = new BroadcastChannel(name);
  }

  requestLobby(): Promise<string> {
    const newID = this.id++;
    this.underlyingChannel.postMessage({id: newID});

    return new Promise(res => {
      const fn = (evt: MessageEvent<{id: number, lobby: string}>) => {
        if (evt.data.id === newID) {
          this.underlyingChannel.removeEventListener("message", fn);
          res(evt.data.lobby);
        }
      }
  
      this.underlyingChannel.addEventListener("message", fn);
    });
  }

  verifyCode(code: string): Promise<boolean> {
    const newID = this.id++;
    this.underlyingChannel.postMessage({id: newID, code});

    return new Promise(res => {
      const fn = (evt: MessageEvent<{id: number, isLobby: boolean}>) => {
        if (evt.data.id === newID) {
          this.underlyingChannel.removeEventListener("message", fn);
          res(evt.data.isLobby);
        }
      }
  
      this.underlyingChannel.addEventListener("message", fn);
    });
  }
}
