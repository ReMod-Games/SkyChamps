import { compile } from "./jit_compile.ts";

const base = "./frontend/typescript/";

export class Cache {
  private data: Map<string, Uint8Array>;

  constructor() {
    this.data = new Map();

    this.init();
  }

  async init(): Promise<void> {
    for await (const entry of Deno.readDir(base)) {
      (async () => {
        if (entry.isFile) {
          const content = await compile(base, entry);
          this.data.set(base + entry.name.replace(".ts", ".js"), content);
        }
      })();
    }
  }

  get(path: string): Promise<Uint8Array> | Uint8Array {
    const content = this.data.get(path);

    if (!content) {
      return Deno.readFile(path);
    }

    // TODO: Re-enable this once html files are done.
    // this.#data.set(path, content);

    return content;
  }
}
