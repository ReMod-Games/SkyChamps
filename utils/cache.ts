import { walk } from "../deps.ts";
import { compile } from "./otf_compile.ts";

const NORMALIZE_PATH = /\\/g;

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
        const path = entry.path.replace(NORMALIZE_PATH, "/");
        const content = await compile(path, entry.name);
        this.data.set(path.replace(".ts", ".js"), content);
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
