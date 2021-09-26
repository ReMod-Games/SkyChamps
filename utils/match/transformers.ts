// This file may get replaced by some msgpack sugar

export function eventToPayload<T>(
  event: CloseEvent | Event | MessageEvent<T>,
): string {
  if (event instanceof CloseEvent) {
    return `type\x1Cclose\x1Dreason\x1C${event.reason}\x1Dcode\x1C${event.code}`;
  }
  if (event instanceof MessageEvent) {
    return `type\x1C${event.type}\x1Ddata\x1C${event.data}`;
  }

  return `type\x1C${event.type}`;
}

export function messageEventToRecord(
  evt: MessageEvent<string>,
): Record<string, string> {
  const rec: Record<string, string> = {};
  // \x1D is key+value seperator \x1C is for splitting key and value
  const data: string[][] = evt.data.split("\x1D").map((x) => x.split("\x1C"));
  for (const [key, value] of data) {
    rec[key] = value;
  }
  return rec;
}
