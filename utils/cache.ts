export class Cache {
  private data: Map<string, Uint8Array>;

  constructor() {
    this.data = new Map();
  }

  async get(path: string): Promise<Uint8Array> {
    let content = this.data.get(path);
    if (!content) {
      content = await Deno.readFile(path);
      // TODO: Re-enable this once html files are done.
      // this.#data.set(path, content);
    }

    return content;
  }
}
