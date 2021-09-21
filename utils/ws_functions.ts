// Transform message event into a object.
export function transformMessageEvent(
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
