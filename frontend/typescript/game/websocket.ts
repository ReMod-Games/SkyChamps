/// <reference lib="dom"/>

let WEBSOCKET_CONNECTION: WebSocket;

export function connect(url: string): Promise<void> {
  WEBSOCKET_CONNECTION = new WebSocket(url);
  return new Promise(res => WEBSOCKET_CONNECTION.onopen = () => res());
}

export function send<E, T extends Record<string, E>>(payload: T): void {
  WEBSOCKET_CONNECTION.send(JSON.stringify(payload));
}

export function onMessage<T>(cb: (evt: MessageEvent<T>) => void): void {
  WEBSOCKET_CONNECTION.onmessage = cb;
}

export function onError(cb: (evt: Event) => void): void {
  WEBSOCKET_CONNECTION.onerror = cb;
}

export function onClose(cb: (evt: CloseEvent) => void): void {
  WEBSOCKET_CONNECTION.onclose = cb;
}