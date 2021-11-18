import { walk } from "../deps.ts";
import { compile } from "./otf_compile.ts";

const base = "./frontend/typescript/";

export class Cache {
  private data: Map<string, string>;

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

  async get(path: string): Promise<string> {
    let content: string | undefined = this.data.get(path);

    if (!content) {
      content = await Deno.readTextFile(path);
      this.data.set(path, content);
    }

    return content;
  }
}
