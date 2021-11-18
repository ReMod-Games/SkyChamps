import { walk } from "../deps.ts";
import { compile } from "./otf_compile.ts";

const base = "./frontend/typescript/";

export class Cache {
  private data: Map<string, Uint8Array>;

  constructor() {
    this.data = new Map();

    this.init();
  }

  async init(): Promise<void> {
    for await (const entry of walk(base, { includeDirs: false })) {
      (async () => {
        const content = await compile(entry.path, entry.name);
        this.data.set(entry.path.replace(".ts", ".js"), content);
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
