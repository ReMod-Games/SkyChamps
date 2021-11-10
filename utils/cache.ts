import { swcParse, swcPrint } from "../deps.ts";

const encoder = new TextEncoder();

export class Cache {
  private data: Map<string, Uint8Array>;

  constructor() {
    this.data = new Map();
  }

  async get(path: string): Promise<Uint8Array> {
    let content = this.data.get(path);
    if (!content) {
      if (path.endsWith(".js")) {
        const ast = swcParse(
          await Deno.readTextFile(path.replace(".js", ".ts")),
          {
            syntax: "typescript",
            comments: false,
            target: "es2020",
          },
        );

        content = encoder.encode(
          swcPrint(ast, {
            minify: true,
          }).code,
        );
      } else {
        content = await Deno.readFile(path);
      }
      // TODO: Re-enable this once html files are done.
      // this.#data.set(path, content);
    }

    return content;
  }

  set(path: string, data: Uint8Array) {
    this.data.set(path, data);
  }
}
