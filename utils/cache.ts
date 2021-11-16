import { swcParse, swcPrint } from "../deps.ts";
import { logger } from "./logger.ts";

const encoder = new TextEncoder();

export class Cache {
  private data: Map<string, Uint8Array>;

  constructor() {
    this.data = new Map();

    const base = "./frontend/typescript/";
    for (const entry of Deno.readDirSync(base)) {
      if (entry.isFile) {
        logger.debug(`Reading ${entry.name}`);
        const tsCode = Deno.readTextFileSync(base + entry.name);
        logger.debug(`Parsing ${entry.name}`);
        const ast = swcParse(
          tsCode,
          {
            syntax: "typescript",
            comments: false,
            target: "es2020",
          },
        );
        logger.debug(`Printing & Encoding ${entry.name}`);
        const content = encoder.encode(
          swcPrint(ast, {
            minify: true,
          }).code,
        );

        this.data.set(base + entry.name.replace(".ts", ".js"), content);
        logger.debug(`Finished Compiling & Caching of ${entry.name}`);
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
