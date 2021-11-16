import { swcParse, swcPrint } from "../deps.ts";

const encoder = new TextEncoder();

export class Cache {
  private data: Map<string, Uint8Array>;

  constructor() {
    this.data = new Map();

    for (const entry of Deno.readDirSync("./frontend/typescript")) {
      if (entry.isFile) {
        const ast = swcParse(
          Deno.readTextFileSync(entry.name),
          {
            syntax: "typescript",
            comments: false,
            target: "es2020",
          },
        );

        const content = encoder.encode(
          swcPrint(ast, {
            minify: true,
          }).code,
        );

        this.data.set(entry.name.replace(".ts", ".js"), content);
      }
    }
  }

  async get(path: string): Promise<Uint8Array> {
    let content = this.data.get(path);

    if (!content) {
      content = await Deno.readFile(path);
    }

    // TODO: Re-enable this once html files are done.
    // this.#data.set(path, content);

    return content;
  }

  set(path: string, data: Uint8Array) {
    this.data.set(path, data);
  }
}
