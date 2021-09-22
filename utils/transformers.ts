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
