export class Cache {
  #data: Map<string, Uint8Array> = new Map();

  async get(path: string): Promise<Uint8Array> {
    console.log(path);
    let content = this.#data.get(path);
    if (!content) {
      content = await Deno.readFile(path);
      this.#data.set(path, content);
    }

    return content;
  }
}
